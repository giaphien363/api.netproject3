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
using Microsoft.AspNetCore.Authorization;

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
        [Authorize]
        public ActionResult<PagedResponse<IEnumerable<ContractResponse>>> GetContracts([FromQuery] ContractFilter filter)
        {
            // check role
            //ClaimsIdentity identity = HttpContext.User.Identity as ClaimsIdentity;
            //ObjReturnToken role = GenToken.GetCurrentUser(identity).Value as ObjReturnToken;
            //if (role.Role == RoleUser.EMPLOYEE)
            //{
            //    return BadRequest();
            //}

            var rawData = filter.GetContractFilter(_context);
            var pagedData = rawData
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToList();
            var totalRecords = rawData.Count();

            PagedResponse<IEnumerable<ContractResponse>> page_response = new PagedResponse<IEnumerable<ContractResponse>>(pagedData, filter.PageNumber, filter.PageSize, totalRecords);
            return Ok(page_response);
        }

        // GET: api/Contracts/5
        [HttpGet("{id}")]
        //[Authorize]
        public async Task<ActionResult<DetailContractResponse>> GetContract(int id)
        {
            //var contract = await _context.Contracts
            //        .Where(item => item.IsDeleted == 0)
            //        .Where(item => item.EmployeeId == id)
            //        .Include(item => item.ContractPolicies)
            //            .ThenInclude(cp => cp.Policy)
            //                .ThenInclude(p => p.Company)
            //        .Include(item => item.ContractPolicies)
            //            .ThenInclude(cp => cp.Policy)
            //                .ThenInclude(p => p.Type)
            //        .FirstOrDefaultAsync();


            var contract = await _context.Contracts
                    .Where(item => item.IsDeleted == 0)
                    .Where(item => item.EmployeeId == id)
                    .FirstOrDefaultAsync();
            if (contract == null)
            {
                return NotFound();
            }

            var listContractPolicies = await _context.ContractPolicies
                    .Where(item => item.ContractId == id)
                    .Join(
                        _context.Policies,
                        ctP => ctP.PolicyId,
                        pl => pl.Id,
                        (con, pl) => new { policies = pl }
                    )
                    .Join(
                        _context.InsuranceCompanies,
                        group1 => group1.policies.CompanyId,
                        com => com.Id,
                        (g1, com) => new { policy = g1.policies, company = com }
                    )
                    .Join(
                        _context.TypePolicies,
                        group2 => group2.policy.TypeId,
                        type => type.Id,
                        (g2, type) => new { policy = g2.policy, company = g2.company, type = type }
                    )

                    .Select(item => new PolicyCompanyTypeResponse()
                    {
                        PolicyRes = item.policy,
                        CompanyRes = item.company,
                        TypeRes = item.type
                    })
                    .ToListAsync();

            DetailContractResponse dataResponse = new DetailContractResponse()
            {
                ContractRes = contract,
                PoliciesRes = listContractPolicies
            };
            return Ok(dataResponse);
        }

        //// PUT: api/Contracts/5
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
