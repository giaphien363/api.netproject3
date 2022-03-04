
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
        public async Task<ActionResult<PagedResponse<IEnumerable<PolicyOrder>>>> GetPolicyOrders([FromQuery] PolicyOrderFilter filter)
        {
            ClaimsIdentity identity = HttpContext.User.Identity as ClaimsIdentity;
            ObjReturnToken role = GenToken.GetCurrentUser(identity).Value as ObjReturnToken;
            if (role.Role == RoleUser.EMPLOYEE)
            {
                var rawData_em = filter.GetPolicyOrderFilter(_context)
                            .Join(
                                _context.Employees,
                                poliOrder => poliOrder.EmployeeId,
                                em => em.Id,
                                (poliOrder, emp) => new { poliOrder, emp }
                            )
                            .Where(item => item.emp.Id == role.Id)
                            .Select(item => item.poliOrder);

                var pagedData_em = rawData_em
                    .Skip((filter.PageNumber - 1) * filter.PageSize)
                    .Take(filter.PageSize)
                    .ToList();
                var totalRecords_em = rawData_em.Count();

                PagedResponse<IEnumerable<PolicyOrder>> page_response_em = new PagedResponse<IEnumerable<PolicyOrder>>(pagedData_em, filter.PageNumber, filter.PageSize, totalRecords_em);
                return Ok(page_response_em);
            }

            var rawData = filter.GetPolicyOrderFilter(_context);
            var pagedData = rawData
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToList();
            var totalRecords = rawData.Count();

            PagedResponse<IEnumerable<PolicyOrder>> page_response = new PagedResponse<IEnumerable<PolicyOrder>>(pagedData, filter.PageNumber, filter.PageSize, totalRecords);
            return Ok(page_response);
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

            await _context.SaveChangesAsync();
            return Ok(current);
        }

        // PUT: api/PolicyOrders/5/update-status
        [HttpPut("{id}/update-status")]
        [Authorize]
        public async Task<IActionResult> PutPolicyOrderStatus(int id, [FromBody] UpdateStatus statusObj)
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
                (statusObj.Status != (int)StatusPolicyOrder.APPROVE &&
                statusObj.Status != (int)StatusPolicyOrder.REJECT)
                )
            {
                return BadRequest(new CustomError { Detail = "Status invalid!" });
            }

            var current = await _context.PolicyOrders
                .Where(item => item.Id == id && item.IsDeleted == 0)
                .Include(item => item.Policy)
                .FirstOrDefaultAsync();
            if (current == null)
                return NotFound(new CustomError { Detail = "Policy order not found!" });

            current.Status = statusObj.Status;
            _context.PolicyOrders.Update(current);


            // create contract_policy and update total_amount in employee's contract
            if (statusObj.Status == (int)StatusPolicyOrder.APPROVE)
            {
                ContractPolicy newContract = ContractPolicyDto.CreateContractPolicy(current, current.Policy);
                _context.ContractPolicies.Add(newContract);

                Contract existContract = _context.Contracts
                    .Where(item => item.EmployeeId == (int)current.EmployeeId)
                    .FirstOrDefault();
                existContract.TotalAmount += current.Policy.Price;
            }

            await _context.SaveChangesAsync();
            return Ok(current);
        }

        // POST: api/PolicyOrders
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<PolicyOrder>> PostPolicyOrder(OrderDto policyOrderDto)
        {
            // check permission
            ClaimsIdentity identity = HttpContext.User.Identity as ClaimsIdentity;
            ObjReturnToken role = GenToken.GetCurrentUser(identity).Value as ObjReturnToken;
            if (role.Role != RoleUser.EMPLOYEE)
            {
                return Unauthorized(new CustomError { Code = 403, Detail = "Permission denied!" });
            }

            // check policy_type exist in contract ?
            ContractPolicy[] listContractPolicies = _context.ContractPolicies
                .Where(item => item.IsDeleted == 0 && item.ContractId == policyOrderDto.EmployeeId)
                .ToArray();

            // get type policy want to add
            var policy_add = _context.Policies
                .Where(item => item.IsDeleted == 0 && item.Id == policyOrderDto.PolicyId)
                .FirstOrDefault();
            if (policy_add == null)
                return BadRequest(new CustomError { Code = 400, Detail = "Policy not found!" });
            // check that type exist in contract?
            foreach (var item in listContractPolicies)
            {
                if (item.Policy.TypeId == policy_add.TypeId)
                {
                    return BadRequest(new CustomError { Code = 400, Detail = "Type Policy exist!" });
                }
            }
            PolicyOrder order = OrderDto.CreateOrder(policyOrderDto);
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

    }
}
