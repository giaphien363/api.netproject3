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
    public class ContractPoliciesController : ControllerBase
    {
        private readonly ApiNetContext _context;

        public ContractPoliciesController(ApiNetContext context)
        {
            _context = context;
        }

        // GET: api/ContractPolicies
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<ContractPolicy>>> GetContractPolicies()
        {
            ClaimsIdentity identity = HttpContext.User.Identity as ClaimsIdentity;
            ObjReturnToken user = GenToken.GetCurrentUser(identity).Value as ObjReturnToken;
            if (user.Role == RoleUser.EMPLOYEE )
            {
                return await _context.ContractPolicies
                    .Where(item => item.IsDeleted == 0)
                    .Where(item => item.ContractId == user.Id)
                    .ToListAsync();
      }

            return await _context.ContractPolicies
                .Where(item => item.IsDeleted == 0)
                .ToListAsync();
        }

        // GET: api/ContractPolicies/5
        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<ContractPolicy>> GetContractPolicy(int id)
        {
            var contractPolicy = await _context.ContractPolicies
                .Where(item => item.IsDeleted == 0 && item.Id == id)
                .FirstOrDefaultAsync();

            if (contractPolicy == null)
            {
                return NotFound();
            }

            return Ok(contractPolicy);
        }

        // PUT: api/ContractPolicies/5
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> PutContractPolicy(int id, ContractPolicyDto contractPolicyDto)
        {
            // check permission
            ClaimsIdentity identity = HttpContext.User.Identity as ClaimsIdentity;
            ObjReturnToken role = GenToken.GetCurrentUser(identity).Value as ObjReturnToken;
            if (role.Role != RoleUser.ADMIN)
            {
                return Unauthorized(new CustomError { Code = 403, Detail = "Permission denied!" });
            }

            var contractPolicy = await _context.ContractPolicies
                .Where(item => item.Id == id && item.IsDeleted == 0)
                .FirstOrDefaultAsync();

            if (contractPolicy == null)
                return NotFound(new CustomError { Detail = "Contract Policy not found!" });

            contractPolicy = ContractPolicyDto.UpdateContractPolicy(contractPolicy, contractPolicyDto);
            _context.ContractPolicies.Update(contractPolicy);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }

            return Ok(contractPolicy);
        }


        // PUT: api/ContractPolicies/5/payment-status
        [HttpPut("{id}/payment-status")]
        [Authorize]
        public async Task<IActionResult> ContractPolicyStatus(int id, [FromBody] UpdateStatus statusObj)
        {
            // check permission
            ClaimsIdentity identity = HttpContext.User.Identity as ClaimsIdentity;
            ObjReturnToken role = GenToken.GetCurrentUser(identity).Value as ObjReturnToken;
            if (role.Role != RoleUser.ADMIN)
            {
                return Unauthorized(new CustomError { Code = 403, Detail = "Permission denied!" });
            }
            if (
                statusObj.Status < 0 ||
                statusObj.Status != (int)StatusPolicyPayment.PAID
                )
            {
                return BadRequest(new CustomError { Detail = "Status invalid!" });
            }

            var current = await _context.ContractPolicies
                .Where(item => item.Id == id && item.IsDeleted == 0)
                .Include(item => item.Policy)
                .FirstOrDefaultAsync();
            if (current == null)
                return BadRequest(new CustomError { Detail = "Contract Policy order not found!" });

            current.PaymentStatus = statusObj.Status;
            _context.ContractPolicies.Update(current);

            await _context.SaveChangesAsync();
            return Ok(current);
        }


        // POST: api/ContractPolicies: auto add record when admin approve
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<ContractPolicy>> PostContractPolicy([FromBody] ContractPolicyDto contractPLDto)
        {
            ClaimsIdentity identity = HttpContext.User.Identity as ClaimsIdentity;
            ObjReturnToken role = GenToken.GetCurrentUser(identity).Value as ObjReturnToken;
            if (role.Role != RoleUser.ADMIN)
            {
                return Unauthorized(new CustomError { Code = 403, Detail = "Permission denied!" });
            }

            Policy policy = _context.Policies
                   .Where(item => item.Id == contractPLDto.PolicyId)
                   .FirstOrDefault();

            ContractPolicy conPolicy = ContractPolicyDto.CreateContractPolicyDirectly(contractPLDto, policy);
            _context.ContractPolicies.Add(conPolicy);

            Contract existContract = _context.Contracts
                   .Where(item => item.EmployeeId == contractPLDto.ContractId)
                   .FirstOrDefault();

            existContract.TotalAmount += policy.Price;
            await _context.SaveChangesAsync();

            return Ok();
        }

        // DELETE: api/ContractPolicies/5
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteContractPolicy(int id)
        {
            // check permission
            ClaimsIdentity identity = HttpContext.User.Identity as ClaimsIdentity;
            ObjReturnToken role = GenToken.GetCurrentUser(identity).Value as ObjReturnToken;
            if (role.Role != RoleUser.ADMIN)
            {
                return Unauthorized(new CustomError { Code = 403, Detail = "Permission denied!" });
            }

            var contractPolicy = await _context.ContractPolicies
                .Where(item => item.IsDeleted == 0 && item.Id == id)
                .FirstOrDefaultAsync();

            if (contractPolicy == null)
            {
                return NotFound(new CustomError { Detail = "Contract Policy not found!" });
            }
            contractPolicy.IsDeleted = 1;
            _context.ContractPolicies.Update(contractPolicy);

            await _context.SaveChangesAsync();

            return Ok();
        }

    }
}
