﻿using BaseProject.ApiDbContext;
using BaseProject.Common;
using BaseProject.Models;
using BaseProject.MyModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace BaseProject.Controllers
{
    [Route("api/report")]
    [ApiController]
    public class ReportController : ControllerBase
    {

        private readonly ApiNetContext _context;

        public ReportController(ApiNetContext context)
        {
            _context = context;
        }

        //  api/report/line-chart
        [HttpGet("line-chart")]
        //[Authorize]
        public async Task<ActionResult<ClaimReportResponse>> GetLineChart()
        {
            // check role
            //ClaimsIdentity identity = HttpContext.User.Identity as ClaimsIdentity;
            //ObjReturnToken role = GenToken.GetCurrentUser(identity).Value as ObjReturnToken;
            //if (role.Role != RoleUser.ADMIN)
            //{
            //    return BadRequest(new CustomError { Code = 403, Detail = "Permission denied" });
            //}

            // get list claim pending (ClaimReportResponse)

            var allClaim = await _context.ClaimEmployees
                       .Where(item => ((DateTime)item.CreatedAt).Year == DateTime.Now.Year)
                       .ToListAsync();

            ClaimReportResponse claimReport = new ClaimReportResponse();
            foreach (var item in claimReport.Months)
            {
                // total claim 
                var num_total = this.FilterClaimReport(allClaim, item);
                claimReport.TotalClaims.Add(num_total);
                // pending
                var num_pending = this.FilterClaimReport(allClaim, item, (int)StatusClaimEmployee.PENDING);
                claimReport.ClaimPending.Add(num_pending);
                // approval
                var num_approval = this.FilterClaimReport(allClaim, item, (int)StatusClaimEmployee.PAY);
                claimReport.ClaimApproval.Add(num_approval);
                //reject
                var num_reject_man = this.FilterClaimReport(allClaim, item, (int)StatusClaimEmployee.REJECT_BY_MAN);
                var num_reject_fin = this.FilterClaimReport(allClaim, item, (int)StatusClaimEmployee.REJECT_BY_FIN);
                claimReport.ClaimReject.Add(num_reject_man + num_reject_fin);
            }

            return Ok(claimReport);
        }


        //  api/report/square-chart
        [HttpGet("square-chart")]
        //[Authorize]
        public async Task<ActionResult> GetSquareChart()
        {
            // check role
            //ClaimsIdentity identity = HttpContext.User.Identity as ClaimsIdentity;
            //ObjReturnToken role = GenToken.GetCurrentUser(identity).Value as ObjReturnToken;
            //if (role.Role != RoleUser.ADMIN)
            //{
            //    return BadRequest(new CustomError { Code = 403, Detail = "Permission denied" });
            //}
            DateTime last_month = DateTime.Now.AddMonths(-1);

            var no_user = _context.Employees.Where(item => item.IsDeleted == 0).ToList().Count();
            var policy_created = _context.Policies.Where(item => item.CreatedAt > last_month).ToList().Count();
            var claim_created = _context.ClaimEmployees.Where(item => item.CreatedAt > last_month).ToList().Count();
            var claim_approval = _context.ClaimEmployees
                .Where(item => item.CreatedAt > last_month)
                .Where(item => item.Status == (int)StatusClaimEmployee.PAY)
                .ToList().Count();
            SquareChartResponse result = new SquareChartResponse
            {
                NoUser = no_user,
                NoPolicy = policy_created,
                NoClaimCreated = claim_created,
                NoClaimApproval = claim_approval
            };

            return Ok(result);
        }

        private int FilterClaimReport(List<ClaimEmployee> allClaim, int month, int status = 0)
        {
            if (status > 0)
            {
                int number_record = allClaim
                    .Where(item => item.Status == status)
                    .Where(item => ((DateTime)item.CreatedAt).Month == month)
                    .Count();
                return number_record;
            }
            var all_record_1 = allClaim
                    .Where(item => ((DateTime)item.CreatedAt).Month == month)
                    .ToList();
            //.Count();
            int all_record = all_record_1.Count();
            return all_record;
        }


    }
}