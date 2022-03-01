using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BaseProject.ApiDbContext;
using BaseProject.Models;
using System.Security.Claims;
using BaseProject.Common;
using BaseProject.MyModels;

namespace BaseProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContractsController : ControllerBase
    {
        private readonly ApiNetContext _context;

        public ContractsController(ApiNetContext context)
        {
            _context = context;
        }

        // GET: api/Contracts
        [HttpGet]
        public ActionResult<PagedResponse<IEnumerable<Contract>>> GetContracts([FromQuery] ContractFilter filter)
        {
            // check role
            ClaimsIdentity identity = HttpContext.User.Identity as ClaimsIdentity;
            ObjReturnToken role = GenToken.GetCurrentUser(identity).Value as ObjReturnToken;
            if (role.Role == RoleUser.EMPLOYEE)
            {
                return BadRequest();
            }
            ContractFilter validFilter = new ContractFilter(filter.PageNumber, filter.PageSize, filter.Name);

            var rawData = validFilter.GetContractFilter(_context);
            var totalRecords = rawData.Count();
            var pagedData = rawData
                .Skip((validFilter.PageNumber - 1) * validFilter.PageSize)
                .Take(validFilter.PageSize)
                .ToList();

            PagedResponse<IEnumerable<Contract>> page_response = new PagedResponse<IEnumerable<Contract>>(pagedData, validFilter.PageNumber, validFilter.PageSize, totalRecords);
            return Ok(page_response);
        }

        // GET: api/Contracts/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Contract>> GetContract(int id)
        {
            var contract = await _context.Contracts
                    .Where(item => item.IsDeleted == 0)
                    .Where(item => item.EmployeeId == id)
                    .Include(item => item.ContractPolicies)
                        .ThenInclude(cp => cp.Policy)
                            .ThenInclude(p => p.Company)
                    .Include(item => item.ContractPolicies)
                        .ThenInclude(cp => cp.Policy)
                            .ThenInclude(p => p.Type)
                    .FirstOrDefaultAsync();

            if (contract == null)
            {
                return NotFound();
            }

            return contract;
        }

        //// PUT: api/Contracts/5
        //// To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        //[HttpPut("{id}")]
        //public async Task<IActionResult> PutContract(int id, Contract contract)
        //{
        //    if (id != contract.EmployeeId)
        //    {
        //        return BadRequest();
        //    }

        //    _context.Entry(contract).State = EntityState.Modified;

        //    try
        //    {
        //        await _context.SaveChangesAsync();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!ContractExists(id))
        //        {
        //            return NotFound();
        //        }
        //        else
        //        {
        //            throw;
        //        }
        //    }

        //    return NoContent();
        //}

        //// POST: api/Contracts
        //// To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        //[HttpPost]
        //public async Task<ActionResult<Contract>> PostContract(Contract contract)
        //{
        //    _context.Contracts.Add(contract);
        //    try
        //    {
        //        await _context.SaveChangesAsync();
        //    }
        //    catch (DbUpdateException)
        //    {
        //        if (ContractExists(contract.EmployeeId))
        //        {
        //            return Conflict();
        //        }
        //        else
        //        {
        //            throw;
        //        }
        //    }

        //    return CreatedAtAction("GetContract", new { id = contract.EmployeeId }, contract);
        //}

        //// DELETE: api/Contracts/5
        //[HttpDelete("{id}")]
        //public async Task<IActionResult> DeleteContract(int id)
        //{
        //    var contract = await _context.Contracts.FindAsync(id);
        //    if (contract == null)
        //    {
        //        return NotFound();
        //    }

        //    _context.Contracts.Remove(contract);
        //    await _context.SaveChangesAsync();

        //    return NoContent();
        //}

        //private bool ContractExists(int id)
        //{
        //    return _context.Contracts.Any(e => e.EmployeeId == id);
        //}
    }
}
