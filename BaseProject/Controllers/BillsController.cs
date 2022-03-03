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
    public class BillsController : ControllerBase
    {
        private readonly ApiNetContext _context;

        public BillsController(ApiNetContext context)
        {
            _context = context;
        }

        // GET: api/Bills ==> for insurance admin
        [HttpGet("insurance")]
        [Authorize]
        public async Task<ActionResult<PagedResponse<IEnumerable<ResponseBill>>>> GetBillsInsu([FromQuery] BillFilter filter)
        {
            // check permission
            ClaimsIdentity identity = HttpContext.User.Identity as ClaimsIdentity;
            ObjReturnToken role = GenToken.GetCurrentUser(identity).Value as ObjReturnToken;
            if (role.Role != RoleUser.IFINMAN && role.Role != RoleUser.IMANAGER)
            {
                return BadRequest(new CustomError { Code = 403, Detail = "Permission denied!" });
            }
            // get company id from current acc login
            InsuranceAdmin insu_admin = _context.InsuranceAdmins
                                .Where(item => item.Id == role.Id)
                                .FirstOrDefault();

            var rawData = filter.GetBillFilterInsu(_context, (int)insu_admin.CompanyId);

            var pagedData = rawData
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToList();

            var totalRecords = rawData.Count();

            PagedResponse<IEnumerable<ResponseBill>> page_response = new PagedResponse<IEnumerable<ResponseBill>>(pagedData, filter.PageNumber, filter.PageSize, totalRecords);
            return Ok(page_response);
            // return await _context.Bills.ToListAsync();
        }

        // GET: api/Bills
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<PagedResponse<IEnumerable<Bill>>>> GetBills([FromQuery] BillFilter filter)
        {
            // check permission
            ClaimsIdentity identity = HttpContext.User.Identity as ClaimsIdentity;
            ObjReturnToken role = GenToken.GetCurrentUser(identity).Value as ObjReturnToken;
            if (role.Role == RoleUser.IFINMAN || role.Role == RoleUser.IMANAGER)
            {
                return BadRequest(new CustomError { Code = 403, Detail = "Permission denied!" });
            }
            var rawData = filter.GetBillFilter(_context);

            var pagedData = rawData
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToList();

            var totalRecords = rawData.Count();

            PagedResponse<IEnumerable<Bill>> page_response = new PagedResponse<IEnumerable<Bill>>(pagedData, filter.PageNumber, filter.PageSize, totalRecords);
            return Ok(page_response);
        }


        // GET: api/Bills/5
        //[HttpGet("{id}")]
        //[Authorize]
        //public async Task<ActionResult<Bill>> GetBill(int id)
        //{
        //    var bill = await _context.Bills
        //        .Where(item => item.ClaimId == id)
        //        .Include(item => item.Policy)
        //        .Include(item => item.Claim)
        //        .FirstOrDefaultAsync();

        //    if (bill == null)
        //    {
        //        return NotFound();
        //    }

        //    return bill;
        //}


        //// PUT: api/Bills/5
        //[HttpPut("{id}")]
        //public async Task<IActionResult> PutBill(int id, Bill bill)
        //{
        //    if (id != bill.ClaimId)
        //    {
        //        return BadRequest();
        //    }

        //    _context.Entry(bill).State = EntityState.Modified;

        //    try
        //    {
        //        await _context.SaveChangesAsync();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!BillExists(id))
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

        //// POST: api/Bills
        //[HttpPost]
        //public async Task<ActionResult<Bill>> PostBill(Bill bill)
        //{
        //    _context.Bills.Add(bill);
        //    try
        //    {
        //        await _context.SaveChangesAsync();
        //    }
        //    catch (DbUpdateException)
        //    {
        //        if (BillExists(bill.ClaimId))
        //        {
        //            return Conflict();
        //        }
        //        else
        //        {
        //            throw;
        //        }
        //    }

        //    return CreatedAtAction("GetBill", new { id = bill.ClaimId }, bill);
        //}

        //// DELETE: api/Bills/5
        //[HttpDelete("{id}")]
        //public async Task<IActionResult> DeleteBill(int id)
        //{
        //    var bill = await _context.Bills.FindAsync(id);
        //    if (bill == null)
        //    {
        //        return NotFound();
        //    }

        //    _context.Bills.Remove(bill);
        //    await _context.SaveChangesAsync();

        //    return NoContent();
        //}

        //private bool BillExists(int id)
        //{
        //    return _context.Bills.Any(e => e.ClaimId == id);
        //}

    }

}
