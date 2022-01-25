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
    public class PolicyOrdersController : ControllerBase
    {
        private readonly ApiNetContext _context;

        public PolicyOrdersController(ApiNetContext context)
        {
            _context = context;
        }

        // GET: api/PolicyOrders
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<PolicyOrder>>> GetPolicyOrders()
        {
            return await _context.PolicyOrders
                .Where(item => item.IsDeleted == 0)
                .ToListAsync();
        }

        // GET: api/PolicyOrders/5
        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<PolicyOrder>> GetPolicyOrder(int id)
        {
            var policyOrder = await _context.PolicyOrders
                .Where(item => item.Id == id && item.IsDeleted == 0)
                .FirstAsync();

            if (policyOrder == null)
            {
                return NotFound();
            }

            return Ok(policyOrder);
        }

        // PUT: api/PolicyOrders/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> PutPolicyOrder(int id, PolicyOrder policyOrder)
        {
            // check permission
            ClaimsIdentity identity = HttpContext.User.Identity as ClaimsIdentity;
            ObjReturnToken role = GenToken.GetCurrentUser(identity).Value as ObjReturnToken;
            if (role.Role != RoleUser.ADMIN)
            {
                return Unauthorized(new CustomError { Code = 403, Detail = "Permission denied!" });
            }

            var current = await _context.PolicyOrders
                .Where(item => item.Id == id && item.IsDeleted == 0)
                .FirstOrDefaultAsync();
            if (current == null)
                return NotFound(new CustomError { Detail = "Policy order not found!" });

            current = OrderDto.UpdateOrder(current, policyOrder);
            _context.PolicyOrders.Update(current);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }

            return Ok(current);
        }

        // POST: api/PolicyOrders
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<PolicyOrder>> PostPolicyOrder(OrderDto policyOrderDto)
        {
            // check permission
            ClaimsIdentity identity = HttpContext.User.Identity as ClaimsIdentity;
            ObjReturnToken role = GenToken.GetCurrentUser(identity).Value as ObjReturnToken;
            if (role.Role != RoleUser.ADMIN)
            {
                return Unauthorized(new CustomError { Code = 403, Detail = "Permission denied!" });
            }

            PolicyOrder order = OrderDto.CreateOrder(policyOrderDto);
            // check if exist username

            _context.PolicyOrders.Add(order);
            await _context.SaveChangesAsync();

            return Ok();
        }

        // DELETE: api/PolicyOrders/5
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeletePolicyOrder(int id)
        {
            // check permission
            ClaimsIdentity identity = HttpContext.User.Identity as ClaimsIdentity;
            ObjReturnToken role = GenToken.GetCurrentUser(identity).Value as ObjReturnToken;
            if (role.Role != RoleUser.ADMIN)
            {
                return Unauthorized(new CustomError { Code = 403, Detail = "Permission denied!" });
            }

            var order = await _context.PolicyOrders.FindAsync(id);
            if (order == null)
            {
                return NotFound(new CustomError { Detail = "Policy order not found!" });
            }
            order.IsDeleted = 1;
            _context.PolicyOrders.Update(order);

            await _context.SaveChangesAsync();

            return Ok();
        }

        private bool PolicyOrderExists(int id)
        {
            return _context.PolicyOrders.Any(e => e.Id == id);
        }
    }
}
