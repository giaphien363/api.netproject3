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
    public class InsuranceCompaniesController : ControllerBase
    {
        private readonly ApiNetContext _context;

        public InsuranceCompaniesController(ApiNetContext context)
        {
            _context = context;
        }

        // GET: api/InsuranceCompanies
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<PagedResponse<IEnumerable<InsuranceCompany>>>> GetInsuranceCompanies([FromQuery] InsuranceCompanyFilter inCompany)
        {
            InsuranceCompanyFilter validFilter = new InsuranceCompanyFilter(inCompany.PageNumber, inCompany.PageSize, inCompany.Name);
            var totalRecords = await _context.InsuranceCompanies.CountAsync();
            var pagedData = validFilter.GetInCompanyFilter(_context);
            PagedResponse<IEnumerable<InsuranceCompany>> page_response = new PagedResponse<IEnumerable<InsuranceCompany>>(pagedData, validFilter.PageNumber, validFilter.PageSize, totalRecords);
            return Ok(page_response);
        }

        // GET: api/InsuranceCompanies/5
        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<InsuranceCompany>> GetInsuranceCompany(int id)
        {
            var insuranceCompany = await _context.InsuranceCompanies.
                Where(item => item.IsDeleted == 0 && item.Id == id).FirstOrDefaultAsync();

            if (insuranceCompany == null)
            {
                return NotFound(new CustomError { Code = 404, Detail = "Insurance Company not found!" });
            }

            return Ok(insuranceCompany);
        }

        // PUT: api/InsuranceCompanies/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> PutInsuranceCompany(int id, InsuranceCompany incom)
        {
            // check permission
            ClaimsIdentity identity = HttpContext.User.Identity as ClaimsIdentity;
            ObjReturnToken role = GenToken.GetCurrentUser(identity).Value as ObjReturnToken;
            if (role.Role != RoleUser.ADMIN)
            {
                return Unauthorized(new CustomError { Code = 403, Detail = "Permission denied!" });
            }

            var retrieveInCom = await _context.InsuranceCompanies.
                Where(item => item.Id == id && item.IsDeleted == 0).
                FirstOrDefaultAsync();

            if (retrieveInCom == null)
                return NotFound(new CustomError { Detail = "Insurance Company not found!" });

            retrieveInCom = ICompanyCreateDto.UpdateICompany(retrieveInCom, incom);
            _context.InsuranceCompanies.Update(retrieveInCom);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }

            return Ok(retrieveInCom);
        }

        // POST: api/InsuranceCompanies
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<InsuranceCompany>> PostInsuranceCompany(ICompanyCreateDto iComDto)
        {
            // check permission
            ClaimsIdentity identity = HttpContext.User.Identity as ClaimsIdentity;
            ObjReturnToken role = GenToken.GetCurrentUser(identity).Value as ObjReturnToken;
            if (role.Role != RoleUser.ADMIN)
            {
                return Unauthorized(new CustomError { Code = 403, Detail = "Permission denied!" });
            }

            var newCompany = ICompanyCreateDto.ConvertIntoICompany(iComDto);

            _context.InsuranceCompanies.Add(newCompany);
            await _context.SaveChangesAsync();
            //var retrieve = await _context.Employees.Where(item => item.Username == employee.Username && item.IsDeleted == 0).FirstOrDefaultAsync();

            return Ok();
        }

        // DELETE: api/InsuranceCompanies/5
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteInsuranceCompany(int id)
        {
            // check permission
            ClaimsIdentity identity = HttpContext.User.Identity as ClaimsIdentity;
            ObjReturnToken role = GenToken.GetCurrentUser(identity).Value as ObjReturnToken;
            if (role.Role != RoleUser.ADMIN)
            {
                return Unauthorized(new CustomError { Code = 403, Detail = "Permission denied!" });
            }

            var company = await _context.InsuranceCompanies.FindAsync(id);
            if (company == null)
            {
                return NotFound(new CustomError { Detail = "Insurance company not found!" });
            }
            company.IsDeleted = 1;
            _context.InsuranceCompanies.Update(company);

            await _context.SaveChangesAsync();

            return Ok();
        }

        private bool InsuranceCompanyExists(int id)
        {
            return _context.InsuranceCompanies.Any(e => e.Id == id);
        }
    }
}
