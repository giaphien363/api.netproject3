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
using BaseProject.Common;
using BaseProject.MyModels;
using System.Security.Claims;

namespace BaseProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TypePoliciesController : ControllerBase
    {
        private readonly ApiNetContext _context;

        public TypePoliciesController(ApiNetContext context)
        {
            _context = context;
        }

        // GET: api/TypePolicies
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<TypePolicy>>> GetTypePolicies()
        {
            // check permission
            //ClaimsIdentity identity = HttpContext.User.Identity as ClaimsIdentity;
            //ObjReturnToken user = GenToken.GetCurrentUser(identity).Value as ObjReturnToken;
            //if (user.Role == RoleUser.EMPLOYEE)
            //{
            //    return Unauthorized(new CustomError { Code = 403, Detail = "Permission denied!" });
            //}
            return await _context.TypePolicies.Where(item => item.IsDeleted == 0).ToListAsync();
        }


        // GET: api/TypePolicies/5
        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<TypePolicy>> GetTypePolicy(int id)
        {
            var typePolicy = await _context.TypePolicies.Where(item => item.IsDeleted == 0 && item.Id == id).FirstOrDefaultAsync();

            if (typePolicy == null)
            {
                return NotFound(new CustomError { Code = 404, Detail = "Type policy not found!" });
            }

            return Ok(typePolicy);
        }

        // PUT: api/TypePolicies/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> PutTypePolicy(int id, TypePolicy typePolicy)
        {
            // check permission
            ClaimsIdentity identity = HttpContext.User.Identity as ClaimsIdentity;
            ObjReturnToken role = GenToken.GetCurrentUser(identity).Value as ObjReturnToken;
            if (role.Role != RoleUser.ADMIN)
            {
                return Unauthorized(new CustomError { Code = 403, Detail = "Permission denied!" });
            }

            var retrieve = await _context.TypePolicies.Where(item => item.IsDeleted == 0 && item.Id == id).FirstOrDefaultAsync();

            if (retrieve == null)
            {
                return NotFound(new CustomError { Detail = "Not found!" });
            }
            if (typePolicy.Name != null)
            {
                retrieve.Name = typePolicy.Name;
            }
            if (typePolicy.Description != null)
            {
                retrieve.Description = typePolicy.Description;
            }

            DateTime datetimeNow = DateTime.Now;
            retrieve.UpdatedAt = datetimeNow;

            _context.TypePolicies.Update(retrieve);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }

            return Ok(retrieve);
        }

        // POST: api/TypePolicies
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<TypePolicy>> PostTypePolicy(TypePolicy typePolicy)
        {
            // check permission
            ClaimsIdentity identity = HttpContext.User.Identity as ClaimsIdentity;
            ObjReturnToken role = GenToken.GetCurrentUser(identity).Value as ObjReturnToken;
            if (role.Role != RoleUser.ADMIN)
            {
                return Unauthorized(new CustomError { Code = 403, Detail = "Permission denied!" });
            }

            if (typePolicy.Name == null)
            {
                return BadRequest(new CustomError { Code = 400, Detail = "Missing field!" });
            }

            _context.TypePolicies.Add(typePolicy);
            await _context.SaveChangesAsync();

            return Ok();
        }

        // DELETE: api/TypePolicies/5
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteTypePolicy(int id)
        {
            // check permission
            ClaimsIdentity identity = HttpContext.User.Identity as ClaimsIdentity;
            ObjReturnToken role = GenToken.GetCurrentUser(identity).Value as ObjReturnToken;
            if (role.Role != RoleUser.ADMIN)
            {
                return Unauthorized(new CustomError { Code = 403, Detail = "Permission denied!" });
            }

            var typePolicy = await _context.TypePolicies.FindAsync(id);
            if (typePolicy == null)
            {
                return NotFound(new CustomError { Detail = "Type Policy not found!" });
            }
            typePolicy.IsDeleted = 1;
            _context.TypePolicies.Update(typePolicy);

            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}
