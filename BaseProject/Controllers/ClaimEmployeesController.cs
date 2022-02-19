using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BaseProject.ApiDbContext;
using BaseProject.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using BaseProject.Common;
using BaseProject.MyModels;

namespace BaseProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClaimEmployeesController : ControllerBase
    {
        private readonly ApiNetContext _context;

        public ClaimEmployeesController(ApiNetContext context)
        {
            _context = context;
        }

        // GET: api/ClaimEmployees
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<PagedResponse<List<ClaimEmployee>>>> GetClaimEmployees([FromQuery] PaginationFilter filter)
        {
            // if admin return all
            // if employee thi return nhung claim cua no
            var validFilter = new PaginationFilter(filter.PageNumber, filter.PageSize);
            var pagedData = await _context.ClaimEmployees
                .Skip((validFilter.PageNumber - 1) * validFilter.PageSize)
                .Take(validFilter.PageSize)
                .ToListAsync();
            var totalRecords = await _context.ClaimEmployees.CountAsync();
            PagedResponse<List<ClaimEmployee>> page_response = new PagedResponse<List<ClaimEmployee>>(pagedData, validFilter.PageNumber, validFilter.PageSize, totalRecords);
            return Ok(page_response);
        }

        // GET: api/ClaimEmployees/5
        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<ClaimEmployee>> GetClaimEmployee(int id)
        {
            var claimEmployee = await _context.ClaimEmployees
                .Where(item => item.IsDeleted == 0 && item.Id == id)
                .FirstOrDefaultAsync();

            if (claimEmployee == null)
            {
                return NotFound();
            }

            return Ok(claimEmployee);
        }

        // PUT: api/ClaimEmployees/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> PutClaimEmployee(int id, ClaimDto claimDto)
        {
            var retrieveClaim = await _context.ClaimEmployees
                .Where(item => item.Id == id && item.IsDeleted == 0)
                .FirstOrDefaultAsync();
            if (retrieveClaim == null)
                return BadRequest(new CustomError { Detail = "The Claim not found!" });

            retrieveClaim = ClaimDto.UpdateClaimEmployee(retrieveClaim, claimDto);
            _context.ClaimEmployees.Update(retrieveClaim);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }
            // add record claim action 
            ClaimActionDto new_action = new ClaimActionDto();
            new_action.ActionType = (int)StatusClaimAction.EDIT;
            new_action.ClaimId = retrieveClaim.Id;
            // only employee have permission edit
            new_action.EmployeeId = retrieveClaim.EmployeeId;
            // add reason if have
            ClaimActionDto.AddAction(new_action);

            return Ok(retrieveClaim);
        }

        [HttpPut("{id}/update-status")]
        [Authorize]
        public async Task<IActionResult> UpdateStatusClaimEmployee(int id, int statusType)
        {

            // only insurance admin have permission
            ClaimsIdentity identity = HttpContext.User.Identity as ClaimsIdentity;
            ObjReturnToken role = GenToken.GetCurrentUser(identity).Value as ObjReturnToken;

            if (statusType == null)
            {
                return BadRequest(new CustomError { Detail = "Status invalid!" });
            }
            var current = await _context.ClaimEmployees
                .Where(item => item.Id == id && item.IsDeleted == 0)
                .FirstOrDefaultAsync();
            if (current == null)
                return NotFound(new CustomError { Detail = "The Claim not found!" });

            if (
                current.Status == (int)StatusClaimEmployee.REJECT_BY_MAN ||
                current.Status == (int)StatusClaimEmployee.REJECT_BY_FIN
                )
            {
                return BadRequest(new CustomError { Detail = "The Claim was reject!" });
            }

            current.Status = statusType;
            _context.ClaimEmployees.Update(current);

            // add action
            ClaimActionDto new_action = new ClaimActionDto();
            new_action.ClaimId = current.Id;
            new_action.InsuranceAdminId = role.Id;
            if (role.Role == RoleUser.IMANAGER)
            {
                if (statusType == (int)StatusClaimEmployee.APPROVE_BY_MAN)
                {
                    new_action.ActionType = (int)StatusClaimAction.APPROVE_BY_MAN;
                }
                if (statusType == (int)StatusClaimEmployee.REJECT_BY_MAN)
                {
                    new_action.ActionType = (int)StatusClaimAction.REJECT_BY_MAN;
                }
            }
            if (role.Role == RoleUser.IFINMAN)
            {
                if (statusType == (int)StatusClaimEmployee.APPROVE_BY_FIN)
                {
                    new_action.ActionType = (int)StatusClaimAction.APPROVE_BY_FIN;
                    // add bill
                    BillDto.CreateBill(current);
                }
                if (statusType == (int)StatusClaimEmployee.REJECT_BY_FIN)
                {
                    new_action.ActionType = (int)StatusClaimAction.REJECT_BY_FIN;
                }
            }
            // add reason if have
            ClaimActionDto.AddAction(new_action);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }
            // add record claim action (handle later)

            return Ok();

        }

        // POST: api/ClaimEmployees
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<ClaimEmployee>> PostClaimEmployee(ClaimDto claimDto)
        {
            var claim = ClaimDto.CreateClaimEmployee(claimDto);
            _context.ClaimEmployees.Add(claim);

            // add record claim action 
            ClaimActionDto new_action = new ClaimActionDto();
            new_action.ActionType = (int)StatusClaimAction.CREATE;
            new_action.ClaimId = claim.Id;

            // only employee have permission create
            new_action.EmployeeId = claim.EmployeeId;
            // add reason if have
            ClaimActionDto.AddAction(new_action);

            await _context.SaveChangesAsync();
            var retrieve = await _context.ClaimEmployees
                .Where(item => item.Id == claim.Id)
                .FirstOrDefaultAsync();
            return Ok(retrieve);
        }

        // DELETE: api/ClaimEmployees/5
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteClaimEmployee(int id)
        {
            // check permission
            ClaimsIdentity identity = HttpContext.User.Identity as ClaimsIdentity;
            ObjReturnToken role = GenToken.GetCurrentUser(identity).Value as ObjReturnToken;
            //if (role.Role != RoleUser.ADMIN)
            //{
            //    return Unauthorized(new CustomError { Code = 403, Detail = "Permission denied!" });
            //}

            var claimEmployee = await _context.ClaimEmployees
                .Where(item => item.IsDeleted == 0 && item.Id == id)
                .FirstOrDefaultAsync();

            if (claimEmployee == null)
            {
                return BadRequest(new CustomError { Detail = "The claim not found!" });
            }
            claimEmployee.IsDeleted = 1;
            _context.ClaimEmployees.Update(claimEmployee);

            await _context.SaveChangesAsync();

            // add record action (handlel later)
            ClaimActionDto new_action = new ClaimActionDto();
            new_action.ActionType = (int)StatusClaimAction.DELETE;
            new_action.ClaimId = claimEmployee.Id;
            if (role.Role == RoleUser.EMPLOYEE)
                new_action.EmployeeId = role.Id;
            if (role.Role == RoleUser.IMANAGER || role.Role == RoleUser.IFINMAN)
                new_action.InsuranceAdminId = role.Id;
            // add reason if have
            ClaimActionDto.AddAction(new_action);

            return Ok();
        }
    }
}
