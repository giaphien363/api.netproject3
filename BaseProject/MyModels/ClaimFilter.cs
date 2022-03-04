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
        public string Name { get; set; }
        public int Status { get; set; }

        public ClaimFilter() { }
        public ClaimFilter(int pageNumber, int pageSize, int emId, int status, string name)
        {
            this.PageNumber = pageNumber;
            this.PageSize = pageSize;
            this.EmId = emId;
            this.Name = name;
            this.Status = status;
        }

        public IEnumerable<ClaimResponse> GetClaimFilterForInsu(ApiNetContext context, int company_id)
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


            if (this.EmId > 0)
            {
                query = this.FilterByEmId(query);
            }

            if (this.Name != null)
            {
                query = this.FilterByName(context, query);
            }

            if (this.Status > 0)
            {
                query = this.FilterByStatus(query);
            }
            return query;
            //.Skip((this.PageNumber - 1) * this.PageSize)
            //.Take(this.PageSize)
            //.ToList();
        }

        public IEnumerable<ClaimResponse> GetClaimFilter(ApiNetContext context)
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

        private IEnumerable<ClaimResponse> FilterByName(ApiNetContext api, IEnumerable<ClaimResponse> context)
        {
            IEnumerable<ClaimResponse> res = context.Join(
                                        api.Employees,
                                        claim => claim.ClaimRes.Id,
                                        emp => emp.Id,
                                        (claim, emp) => new { claim, emp }
                                    )
                                    .Where(item => item.emp.Username.Contains(this.Name))
                                    .Where(item => item.emp.Firstname.Contains(this.Name))
                                    .Where(item => item.emp.Lastname.Contains(this.Name))
                                    .Select(item => new ClaimResponse()
                                    {
                                        PolicyRes = item.claim.PolicyRes,
                                        ClaimRes = item.claim.ClaimRes,
                                    }
                                    );

            return res;
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