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

        // POST: api/ContractPolicies: auto add record when admin approve
        /**
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<ContractPolicy>> PostContractPolicy(ContractPolicy contractPolicy)
        {
            _context.ContractPolicies.Add(contractPolicy);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetContractPolicy", new { id = contractPolicy.Id }, contractPolicy);
        }
         * */

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
