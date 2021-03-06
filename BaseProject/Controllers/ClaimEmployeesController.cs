using BaseProject.ApiDbContext;
using BaseProject.Common;
using BaseProject.Models;
using BaseProject.MyModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
//using System.Data.Entity;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

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
        public ActionResult<PagedResponse<IEnumerable<ClaimResponse>>> GetClaimEmployees([FromQuery] ClaimFilter filter)
        {
            ClaimsIdentity identity = HttpContext.User.Identity as ClaimsIdentity;
            ObjReturnToken role = GenToken.GetCurrentUser(identity).Value as ObjReturnToken;
            if (role.Role == RoleUser.IFINMAN || role.Role == RoleUser.IMANAGER)
            {
                return BadRequest(new CustomError { Code = 403, Detail = "Permission denied!" });
            }
            if (role.Role == RoleUser.EMPLOYEE)
            {
                filter.EmId = role.Id;
            }

            var rawData = filter.GetClaimFilter(_context);
            var pagedData = rawData
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToList();
            var totalRecords = rawData.Count();
            PagedResponse<IEnumerable<ClaimResponse>> page_response = new PagedResponse<IEnumerable<ClaimResponse>>(pagedData, filter.PageNumber, filter.PageSize, totalRecords);
            return Ok(page_response);
        }

        // GET: api/ClaimEmployees/insurance ---> only insurance admin
        [HttpGet("insurance")]
        [Authorize]
        public async Task<ActionResult<PagedResponse<IEnumerable<ClaimResponse>>>> GetClaimEmployeesForInsu([FromQuery] ClaimFilter filter)
        {
            ClaimsIdentity identity = HttpContext.User.Identity as ClaimsIdentity;
            ObjReturnToken role = GenToken.GetCurrentUser(identity).Value as ObjReturnToken;
            if (role.Role != RoleUser.IFINMAN && role.Role != RoleUser.IMANAGER)
            {
                return BadRequest(new CustomError { Code = 403, Detail = "Permission denied!" });
            }
            filter.EmId = 0;
            // get current insurance admin login
            InsuranceAdmin currentAdmin = _context.InsuranceAdmins.Where(item => item.Id == role.Id).FirstOrDefault();
            // get company id
            int company_id = (int)currentAdmin.CompanyId;

            var rawData = filter.GetClaimFilterForInsu(_context, company_id);
            var pagedData = rawData
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToList();
            var totalRecords = rawData.Count();
            PagedResponse<IEnumerable<ClaimResponse>> page_response = new PagedResponse<IEnumerable<ClaimResponse>>(pagedData, filter.PageNumber, filter.PageSize, totalRecords);
            return Ok(page_response);
        }


        // GET: api/ClaimEmployees/5
        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<ClaimResponseDetail>> GetClaimEmployee(int id)
        {
            ClaimResponseDetail claimEmployee = await _context.ClaimEmployees
                    .Where(item => item.IsDeleted == 0 && item.Id == id)
                    .Join(
                        _context.Policies,
                        claim => claim.PolicyId,
                        policy => policy.Id,
                        (claim, policy) => new { claim, policy }
                    )
                    .OrderByDescending(item => item.claim.CreatedAt)
                    .Select(item => new ClaimResponseDetail()
                    {
                        ClaimRes = item.claim,
                        PolicyRes = item.policy,
                        ActionsRes = item.claim.ClaimActions
                    }).FirstOrDefaultAsync();
            if (claimEmployee == null)
            {
                return BadRequest();
            }

            return Ok(claimEmployee);
        }

        // PUT: api/ClaimEmployees/5
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

            // add record claim action 
            ClaimAction claimAction = new ClaimAction();

            claimAction.ActionType = (int)StatusClaimAction.EDIT;
            claimAction.ClaimId = retrieveClaim.Id;
            claimAction.CreatebyEmployeeId = retrieveClaim.EmployeeId;
            _context.ClaimActions.Add(claimAction);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }

            return Ok(retrieveClaim);
        }

        // field required {status: int, reason: string}
        [HttpPut("{id}/update-status")]
        [Authorize]
        public async Task<IActionResult> UpdateStatusClaimEmployee(int id, [FromBody] ClaimEmployee claimEm)
        {
            // only insurance admin have permission
            ClaimsIdentity identity = HttpContext.User.Identity as ClaimsIdentity;
            ObjReturnToken role = GenToken.GetCurrentUser(identity).Value as ObjReturnToken;
            if (role.Role != RoleUser.IFINMAN && role.Role != RoleUser.IMANAGER)
            {
                return Unauthorized(new CustomError { Code = 403, Detail = "Permission denied!" });
            }

            if (claimEm.Status < 0)
            {
                return BadRequest(new CustomError { Detail = "Status invalid!" });
            }
            var current = await _context.ClaimEmployees
                .Where(item => item.Id == id && item.IsDeleted == 0)
                .Include(item => item.Policy)
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

            current.Status = claimEm.Status;
            _context.ClaimEmployees.Update(current);

            // add action
            ClaimActionDto new_action = new ClaimActionDto();
            new_action.Reason = claimEm.Reason;
            new_action.ClaimId = current.Id;
            new_action.InsuranceAdminId = role.Id;
            if (role.Role == RoleUser.IMANAGER)
            {
                if (claimEm.Status == (int)StatusClaimEmployee.APPROVE_BY_MAN)
                {
                    new_action.ActionType = (int)StatusClaimAction.APPROVE_BY_MAN;
                }
                if (claimEm.Status == (int)StatusClaimEmployee.REJECT_BY_MAN)
                {
                    new_action.ActionType = (int)StatusClaimAction.REJECT_BY_MAN;
                }
            }
            if (role.Role == RoleUser.IFINMAN)
            {
                if (claimEm.Status == (int)StatusClaimEmployee.PAY)
                {
                    new_action.ActionType = (int)StatusClaimAction.PAY;
                    // add bill
                    BillDto.CreateBill(_context, current);
                }
                if (claimEm.Status == (int)StatusClaimEmployee.REJECT_BY_FIN)
                {
                    new_action.ActionType = (int)StatusClaimAction.REJECT_BY_FIN;
                }
            }
            var action_new = ClaimActionDto.ConvertIntoAction(new_action);
            _context.ClaimActions.Add(action_new);
            await _context.SaveChangesAsync();

            return Ok();
        }

        // POST: api/ClaimEmployees
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<ClaimEmployee>> PostClaimEmployee(ClaimDto claimDto)
        {
            ClaimsIdentity identity = HttpContext.User.Identity as ClaimsIdentity;
            ObjReturnToken role = GenToken.GetCurrentUser(identity).Value as ObjReturnToken;
            if (role.Role != RoleUser.EMPLOYEE)
            {
                return Unauthorized(new CustomError { Code = 403, Detail = "Permission denied!" });
            }
            claimDto.EmployeeId = role.Id;
            var contractPolicies = _context.ContractPolicies
                .Where(item => item.IsDeleted == 0)
                .Where(item => item.PolicyId == claimDto.PolicyId)
                .Where(item => item.ContractId == claimDto.EmployeeId)
                .FirstOrDefault();
            if (contractPolicies == null)
            {
                return BadRequest(new CustomError { Code = 400, Detail = "You need to purchase this policy first" });
            }

            if (contractPolicies.PaymentStatus != (int)StatusPolicyPayment.PAID)
            {
                return BadRequest(new CustomError { Code = 400, Detail = "You need to paid this policy first" });
            }
            if (contractPolicies.EndDate < DateTime.Now)
            {
                return BadRequest(new CustomError { Code = 400, Detail = "Your policy expired!" });
            }

            var claim = ClaimDto.CreateClaimEmployee(claimDto);
            _context.ClaimEmployees.Add(claim);
            await _context.SaveChangesAsync();

            // add record claim action 
            ClaimActionDto new_action = new ClaimActionDto();
            new_action.ActionType = (int)StatusClaimAction.CREATE;
            new_action.ClaimId = claim.Id;

            // only employee have permission create
            new_action.EmployeeId = claim.EmployeeId;
            // add reason if have
            var action_new = ClaimActionDto.ConvertIntoAction(new_action);
            _context.ClaimActions.Add(action_new);
            await _context.SaveChangesAsync();

            return Ok();
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

            // add record action
            ClaimAction claimAction = new ClaimAction();

            claimAction.ActionType = (int)StatusClaimAction.DELETE;
            claimAction.ClaimId = claimEmployee.Id;
            if (role.Role == RoleUser.EMPLOYEE)
                claimAction.CreatebyEmployeeId = role.Id;
            if (role.Role == RoleUser.IMANAGER || role.Role == RoleUser.IFINMAN)
                claimAction.CreatebyInsuranceAdminId = role.Id;
            _context.ClaimActions.Add(claimAction);

            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}
