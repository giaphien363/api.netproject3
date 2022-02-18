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
    public class PoliciesController : ControllerBase
    {
        private readonly ApiNetContext _context;

        public PoliciesController(ApiNetContext context)
        {
            _context = context;
        }

        // GET: api/Policies ---> list
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Policy>>> GetPolicies(string key, decimal maxPrice = 0)
        {
            if (key != null)
            {
                if (maxPrice != 0)
                {
                    return await _context.Policies
                    .Where(item => item.IsDeleted == 0)
                    .Where(item => item.Name.Contains(key))
                    .Where(item => item.Price < maxPrice)
                    .ToListAsync();
                }
                return await _context.Policies
                    .Where(item => item.IsDeleted == 0)
                    .Where(item => item.Name.Contains(key))
                    .ToListAsync();
            }

            if (maxPrice != 0)
            {
                return await _context.Policies
                .Where(item => item.IsDeleted == 0)
                .Where(item => item.Price < maxPrice)
                .ToListAsync();
            }
            return await _context.Policies.Where(item => item.IsDeleted == 0).ToListAsync();
        }

        // GET: api/Policies/5 ---> get detail 
        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<Policy>> GetPolicy(int id)
        {
            var policy = await _context.Policies.Where(item => item.IsDeleted == 0 && item.Id == id).FirstOrDefaultAsync();

            if (policy == null)
            {
                return NotFound(new CustomError { Code = 404, Detail = "Policy not found!" });
            }

            return Ok(policy);
        }

        // POST: api/Policies ----> create new policy
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Policy>> PostPolicy(Policy policy)
        {
            // check permission
            ClaimsIdentity identity = HttpContext.User.Identity as ClaimsIdentity;
            ObjReturnToken role = GenToken.GetCurrentUser(identity).Value as ObjReturnToken;
            if (role.Role != RoleUser.ADMIN)
            {
                return Unauthorized(new CustomError { Detail = "Permission denied!" });
            }

            _context.Policies.Add(policy);
            await _context.SaveChangesAsync();
            return Ok();
        }

        // PUT: api/Policies/5 ----> update
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> PutPolicy(int id, PolicyUpdateDto policyDto)
        {
            // check permission
            ClaimsIdentity identity = HttpContext.User.Identity as ClaimsIdentity;
            ObjReturnToken user = GenToken.GetCurrentUser(identity).Value as ObjReturnToken;
            if (user.Role != RoleUser.ADMIN)
            {
                return Unauthorized(new CustomError { Detail = "Permission denied!" });
            }

            var policy = await _context.Policies.Where(item => item.Id == id && item.IsDeleted == 0).FirstOrDefaultAsync();
            if (policy == null)
                return NotFound(new CustomError { Code = 404, Detail = "Policy not found!" });

            policy = PolicyUpdateDto.UpdatePolicy(policy, policyDto);
            _context.Policies.Update(policy);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }

            return Ok(policy);
        }

        // DELETE: api/Policies/5
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeletePolicy(int id)
        {
            // check permission
            ClaimsIdentity identity = HttpContext.User.Identity as ClaimsIdentity;
            ObjReturnToken role = GenToken.GetCurrentUser(identity).Value as ObjReturnToken;
            if (role.Role != RoleUser.ADMIN)
            {
                return Unauthorized(new CustomError { Detail = "Permission denied!" });
            }

            var policy = await _context.Policies.Where(item => item.IsDeleted == 0 && item.Id == id).FirstOrDefaultAsync();
            if (policy == null)
            {
                return NotFound(new CustomError { Code = 404, Detail = "Policy not found!" });
            }

            policy.IsDeleted = 1;
            _context.Policies.Attach(policy);
            _context.Entry(policy).Property(x => x.IsDeleted).IsModified = true;

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
