﻿using BaseProject.ApiDbContext;
using BaseProject.Common;
using BaseProject.Models;
using BaseProject.MyModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

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
        public async Task<ActionResult<PagedResponse<IEnumerable<Policy>>>> GetPolicies([FromQuery] PolicyFilter filter)
        {
            PolicyFilter validFilter = new PolicyFilter(filter.PageNumber, filter.PageSize, filter.Name, filter.Status);
            var totalRecords = await _context.Policies.CountAsync();
            var pagedData = validFilter.GetPolicyFilter(_context);
            PagedResponse<IEnumerable<Policy>> page_response = new PagedResponse<IEnumerable<Policy>>(pagedData, validFilter.PageNumber, validFilter.PageSize, totalRecords);
            return Ok(page_response);
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
            if (role.Role != RoleUser.IFINMAN || role.Role != RoleUser.IMANAGER)
            {
                return BadRequest(new CustomError { Detail = "Permission denied!" });
            }

            _context.Policies.Add(policy);
            await _context.SaveChangesAsync();
            return Ok();
        }

        // submition: api/Policies/confirm/5 ----> 1: approval, 2 reject
        // form body : {status: 1 || 2}
        [HttpPut("confirm/{id}")]
        [Authorize]
        public async Task<IActionResult> PutPolicy(int id, [FromBody] Policy policyPut)
        {
            // check permission
            ClaimsIdentity identity = HttpContext.User.Identity as ClaimsIdentity;
            ObjReturnToken role = GenToken.GetCurrentUser(identity).Value as ObjReturnToken;
            if (role.Role != RoleUser.ADMIN)
            {
                return BadRequest(new CustomError { Detail = "Permission denied!" });
            }

            var policy = await _context.Policies.Where(item => item.Id == id && item.IsDeleted == 0).FirstOrDefaultAsync();
            if (policy == null)
                return BadRequest(new CustomError { Code = 400, Detail = "Policy not found!" });

            if (policyPut.Status <= 0)
                return BadRequest(new CustomError { Code = 400, Detail = "Status invalid!" });
            policy.Status = policyPut.Status;

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

        // PUT: api/Policies/5 ----> update
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> PutPolicy(int id, PolicyUpdateDto policyDto)
        {
            // check permission
            ClaimsIdentity identity = HttpContext.User.Identity as ClaimsIdentity;
            ObjReturnToken role = GenToken.GetCurrentUser(identity).Value as ObjReturnToken;
            if (role.Role != RoleUser.IFINMAN || role.Role != RoleUser.IMANAGER)
            {
                return BadRequest(new CustomError { Detail = "Permission denied!" });
            }

            var policy = await _context.Policies.Where(item => item.Id == id && item.IsDeleted == 0).FirstOrDefaultAsync();
            if (policy == null)
                return BadRequest(new CustomError { Code = 404, Detail = "Policy not found!" });

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
            if (role.Role != RoleUser.IFINMAN || role.Role != RoleUser.IMANAGER)
            {
                return BadRequest(new CustomError { Detail = "Permission denied!" });
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
