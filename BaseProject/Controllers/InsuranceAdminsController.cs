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
    public class InsuranceAdminsController : ControllerBase
    {
        private readonly ApiNetContext _context;

        public InsuranceAdminsController(ApiNetContext context)
        {
            _context = context;
        }

        // GET: api/InsuranceAdmins
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<InsuranceAdmin>>> GetInsuranceAdmins()
        {
            ClaimsIdentity identity = HttpContext.User.Identity as ClaimsIdentity;
            ObjReturnToken role = GenToken.GetCurrentUser(identity).Value as ObjReturnToken;
            if (role.Role != RoleUser.ADMIN)
            {
                return Unauthorized(new CustomError { Code = 403, Detail = "Permission denied!" });
            }

            return await _context.InsuranceAdmins
                .Where(item => item.IsDeleted == 0)
                .ToListAsync();
        }

        // GET: api/InsuranceAdmins/5
        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<InsuranceAdmin>> GetInsuranceAdmin(int id)
        {
            ClaimsIdentity identity = HttpContext.User.Identity as ClaimsIdentity;
            ObjReturnToken role = GenToken.GetCurrentUser(identity).Value as ObjReturnToken;
            if (role.Role != RoleUser.ADMIN)
            {
                return Unauthorized(new CustomError { Code = 403, Detail = "Permission denied!" });
            }

            var insuranceAdmin = await _context.InsuranceAdmins
                .Where(item => item.Id == id && item.IsDeleted == 0)
                .FirstOrDefaultAsync();

            if (insuranceAdmin == null)
            {
                return NotFound();
            }

            return insuranceAdmin;
        }

        // PUT: api/InsuranceAdmins/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> PutInsuranceAdmin(int id, InsuranceAdmin insuranceAdmin)
        {
            ClaimsIdentity identity = HttpContext.User.Identity as ClaimsIdentity;
            ObjReturnToken role = GenToken.GetCurrentUser(identity).Value as ObjReturnToken;
            if (role.Role != RoleUser.ADMIN)
            {
                return Unauthorized(new CustomError { Code = 403, Detail = "Permission denied!" });
            }

            var current = await _context.InsuranceAdmins.Where(item => item.Id == id && item.IsDeleted == 0).FirstOrDefaultAsync();
            if (current == null)
                return NotFound(new CustomError { Detail = "Account not found!" });

            if (insuranceAdmin.Role == null)
            {
                return BadRequest();
            }

            current.Role = insuranceAdmin.Role;

            _context.InsuranceAdmins.Update(current);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }

            return Ok();
        }

        // POST: api/InsuranceAdmins
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<InsuranceAdmin>> PostInsuranceAdmin(InsuranceAdmin insuranceAdmin)
        {
            ClaimsIdentity identity = HttpContext.User.Identity as ClaimsIdentity;
            ObjReturnToken role = GenToken.GetCurrentUser(identity).Value as ObjReturnToken;
            if (role.Role != RoleUser.ADMIN)
            {
                return Unauthorized(new CustomError { Code = 403, Detail = "Permission denied!" });
            }

            if (
                insuranceAdmin.Username == null ||
                insuranceAdmin.Password == null ||
                insuranceAdmin.Role == null
              )
            {
                return BadRequest(new CustomError { Code = 400, Detail = "Missing some field!" });
            }
            insuranceAdmin.Password = EncryptPassword.Encrypt(insuranceAdmin.Password);

            _context.InsuranceAdmins.Add(insuranceAdmin);
            await _context.SaveChangesAsync();

            return Ok();
        }

        // DELETE: api/InsuranceAdmins/5
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteInsuranceAdmin(int id)
        {
            ClaimsIdentity identity = HttpContext.User.Identity as ClaimsIdentity;
            ObjReturnToken role = GenToken.GetCurrentUser(identity).Value as ObjReturnToken;
            if (role.Role != RoleUser.ADMIN)
            {
                return Unauthorized(new CustomError { Code = 403, Detail = "Permission denied!" });
            }

            var inAdmin = await _context.InsuranceAdmins.FindAsync(id);
            if (inAdmin == null)
            {
                return NotFound(new CustomError { Detail = "Insurance Admin not found!" });
            }
            inAdmin.IsDeleted = 1;
            _context.InsuranceAdmins.Update(inAdmin);

            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}
