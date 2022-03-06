using BaseProject.ApiDbContext;
using BaseProject.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
//using System.Data.Entity;
using System.Linq;

namespace BaseProject.MyModels
{
    public class ClaimFilter : PaginationFilter
    {
        public int EmId { get; set; }
        public string SearchString { get; set; }
        public int Status { get; set; }

        public ClaimFilter() { }
        public ClaimFilter(int pageNumber, int pageSize, int emId, int status, string searchString)
        {
            this.PageNumber = pageNumber;
            this.PageSize = pageSize;
            this.EmId = emId;
            this.SearchString = searchString.ToLower();
            this.Status = status;
        }

        public IEnumerable<ClaimResponse> GetClaimFilterForInsu(ApiNetContext context, int company_id)
        {
            if (this.SearchString != null)
            {
                //                query = this.FilterByName(context, query);
                IEnumerable<ClaimResponse> query = context.ClaimEmployees
                                    .Join(
                                        context.Policies,
                                        claim => claim.PolicyId,
                                        policy => policy.Id,
                                        (claim, policy) => new { claim, policy }
                                    )
                                    .Where(item => item.policy.CompanyId == company_id)
                                    .Join(
                                        context.Employees,
                                        claim => claim.claim.EmployeeId,
                                        emp => emp.Id,
                                        (group, emp) => new { group, emp }
                                    )
                                    .Where(item => item.emp.Username.ToLower().Contains(this.SearchString) 
                                        || (item.emp.Firstname + " " + item.emp.Lastname).ToLower().Contains(this.SearchString) 
                                        || item.group.claim.Reason.ToLower().Contains(this.SearchString))
                                    .OrderByDescending(d => d.group.claim.CreatedAt)
                                    .Select(item => new ClaimResponse()
                                    {
                                        PolicyRes = item.group.policy,
                                        ClaimRes = item.group.claim,
                                    });

                if (this.Status > 0)
                {
                    query = this.FilterByStatus(query);
                }
                return query;
            }
            else
            {
                IEnumerable<ClaimResponse> query = context.ClaimEmployees
                        .Join(
                            context.Policies,
                            claim => claim.PolicyId,
                            policy => policy.Id,
                            (claim, policy) => new { claim, policy }
                        )
                        .Where(item => item.policy.CompanyId == company_id)
                        .OrderByDescending(d => d.claim.CreatedAt)
                        .Select(item => new ClaimResponse()
                        {
                            PolicyRes = item.policy,
                            ClaimRes = item.claim,
                        });
                if (this.Status > 0)
                {
                    query = this.FilterByStatus(query);
                }
                return query;
            }
        }

        public IEnumerable<ClaimResponse> GetClaimFilter(ApiNetContext context)
        {

            if (this.SearchString != null)
            {
                IEnumerable<ClaimResponse> query = context.ClaimEmployees
                                    .Join(
                                        context.Policies,
                                        claim => claim.PolicyId,
                                        policy => policy.Id,
                                        (claim, policy) => new { claim, policy }
                                    )
                                    .Join(
                                        context.Employees,
                                        claim => claim.claim.EmployeeId,
                                        emp => emp.Id,
                                        (group, emp) => new { group, emp }
                                    )
                                    .Where(item => item.emp.Username.ToLower().Contains(this.SearchString) 
                                        || (item.emp.Firstname + " " + item.emp.Lastname).ToLower().Contains(this.SearchString) 
                                        || item.group.claim.Reason.ToLower().Contains(this.SearchString))
                                    .OrderByDescending(d => d.group.claim.CreatedAt)
                                    .Select(item => new ClaimResponse()
                                    {
                                        PolicyRes = item.group.policy,
                                        ClaimRes = item.group.claim,
                                    });
                if (this.EmId > 0)
                {
                    query = this.FilterByEmId(query);
                }
                if (this.Status > 0)
                {
                    query = this.FilterByStatus(query);
                }
                return query;
            }
            else
            {
                IEnumerable<ClaimResponse> query = context.ClaimEmployees
                    .Join(
                        context.Policies,
                        claim => claim.PolicyId,
                        policy => policy.Id,
                        (claim, policy) => new { claim, policy }
                    )
                    .OrderByDescending(d => d.claim.CreatedAt)
                    .Select(item => new ClaimResponse()
                    {
                        PolicyRes = item.policy,
                        ClaimRes = item.claim,
                    });

                if (this.EmId > 0)
                {
                    query = this.FilterByEmId(query);
                }

                if (this.Status > 0)
                {
                    query = this.FilterByStatus(query);
                }
                return query;
            }
        }

        private IEnumerable<ClaimResponse> FilterByStatus(IEnumerable<ClaimResponse> context)
        {
            return context.Where(item => item.ClaimRes.Status == this.Status);
        }
        private IEnumerable<ClaimResponse> FilterByEmId(IEnumerable<ClaimResponse> context)
        {
            return context.Where(item => item.ClaimRes.EmployeeId == this.EmId);
        }
    }
}