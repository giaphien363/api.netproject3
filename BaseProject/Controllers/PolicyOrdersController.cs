﻿
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

        // PUT: api/PolicyOrders/5/udpate-status
        [HttpPut("{id}/update-status")]
        [Authorize]
        public async Task<IActionResult> PutPolicyOrderStatus(int id, int statusType)
        {
            // check permission
            ClaimsIdentity identity = HttpContext.User.Identity as ClaimsIdentity;
            ObjReturnToken role = GenToken.GetCurrentUser(identity).Value as ObjReturnToken;
            if (role.Role != RoleUser.ADMIN)
            {
                return Unauthorized(new CustomError { Code = 403, Detail = "Permission denied!" });
            }
            if (
                statusType == null || 
                statusType != (int)StatusPolicyOrder.APPROVE || 
                statusType != (int)StatusPolicyOrder.REJECT
                )
            {
                return BadRequest(new CustomError { Detail = "Status invalid!" });
            }

            var current = await _context.PolicyOrders
            .Where(item => item.Id == id && item.IsDeleted == 0)
            .FirstOrDefaultAsync();
            if (current == null)
                return NotFound(new CustomError { Detail = "Policy order not found!" });

            current.Status = statusType;
            _context.PolicyOrders.Update(current);


            // create contract_policy and update total_amount in employee's contract
            if (statusType == (int)StatusPolicyOrder.APPROVE)
            {
                ContractPolicy newContract = ContractPolicyDto.CreateContractPolicy(current, current.Policy);
                _context.ContractPolicies.Add(newContract);

                Contract existContract = _context.Contracts
                    .Where(item => item.EmployeeId == (int)current.EmployeeId)
                    .FirstOrDefault();
                existContract.TotalAmount += current.Policy.Price;
            }

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
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<PolicyOrder>> PostPolicyOrder(OrderDto policyOrderDto)
        {
            // check permission
            //ClaimsIdentity identity = HttpContext.User.Identity as ClaimsIdentity;
            //ObjReturnToken role = GenToken.GetCurrentUser(identity).Value as ObjReturnToken;
            //if (role.Role != RoleUser.ADMIN)
            //{
            //    return Unauthorized(new CustomError { Code = 403, Detail = "Permission denied!" });
            //}

            // check policy exist in contract ?
            ContractPolicy[] listContractPolicies = _context.ContractPolicies
                .Where(item => item.IsDeleted == 0 && item.ContractId == policyOrderDto.EmployeeId)
                .ToArray();

            // get type policy want to add
            var policy_add = _context.Policies
                .Where(item => item.IsDeleted == 0 && item.Id == policyOrderDto.PolicyId)
                .First();
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

    }
}