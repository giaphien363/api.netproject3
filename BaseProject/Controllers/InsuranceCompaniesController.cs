using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BaseProject.ApiDbContext;
using BaseProject.Models;

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
        public async Task<ActionResult<IEnumerable<InsuranceCompany>>> GetInsuranceCompanies()
        {
            return await _context.InsuranceCompanies.ToListAsync();
        }

        // GET: api/InsuranceCompanies/5
        [HttpGet("{id}")]
        public async Task<ActionResult<InsuranceCompany>> GetInsuranceCompany(int id)
        {
            var insuranceCompany = await _context.InsuranceCompanies.FindAsync(id);

            if (insuranceCompany == null)
            {
                return NotFound();
            }

            return insuranceCompany;
        }

        // PUT: api/InsuranceCompanies/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutInsuranceCompany(int id, InsuranceCompany insuranceCompany)
        {
            if (id != insuranceCompany.Id)
            {
                return BadRequest();
            }

            _context.Entry(insuranceCompany).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!InsuranceCompanyExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/InsuranceCompanies
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<InsuranceCompany>> PostInsuranceCompany(InsuranceCompany insuranceCompany)
        {
            _context.InsuranceCompanies.Add(insuranceCompany);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetInsuranceCompany", new { id = insuranceCompany.Id }, insuranceCompany);
        }

        // DELETE: api/InsuranceCompanies/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInsuranceCompany(int id)
        {
            var insuranceCompany = await _context.InsuranceCompanies.FindAsync(id);
            if (insuranceCompany == null)
            {
                return NotFound();
            }

            _context.InsuranceCompanies.Remove(insuranceCompany);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool InsuranceCompanyExists(int id)
        {
            return _context.InsuranceCompanies.Any(e => e.Id == id);
        }
    }
}
