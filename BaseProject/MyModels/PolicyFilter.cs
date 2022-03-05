using BaseProject.ApiDbContext;
using BaseProject.Models;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace BaseProject.MyModels
{
    public class PolicyFilter : PaginationFilter
    {
        public string Name { get; set; }
        public string Decs { get; set; }
        public int Status { get; set; }
        public int CompanyId { get; set; }

        public PolicyFilter() { }
        public PolicyFilter(int pageNumber, int pageSize, string name, int status, int company_id, string decs)
        {
            this.PageNumber = pageNumber;
            this.PageSize = pageSize;
            this.Name = name;
            this.Decs = decs;
            this.Status = status;
            this.CompanyId = company_id;
        }

        public IEnumerable<PolicyResponse> GetPolicyFilter(ApiNetContext context)
        {
            IEnumerable<PolicyResponse> query = context.Policies
                    .Join(
                        context.InsuranceCompanies,
                        policy => policy.CompanyId,
                        comp => comp.Id,
                        (policy, comp) => new { policy, comp }
                    )
                    .Join(
                        context.TypePolicies,
                        policy => policy.policy.TypeId,
                        typePolicy => typePolicy.Id,
                        (group, type) => new { group.policy, group.comp, type }
                    )
                    .Select(item => new PolicyResponse()
                    {
                        PolicyRes = item.policy,
                        TypeRes = item.type,
                        CompanyRes = item.comp
                    });

            if (this.Name != null)
            {
                query = this.QueryFilterName(query);
            }
            if (this.Decs != null)
            {
                query = this.QueryFilterDecs(query);
            }

            if (this.Status > 0)
            {
                query = this.QueryFilterStatus(query);
            }

            if (this.CompanyId > 0)
            {
                query = this.QueryFilterCompanyId(query);
            }

            return query.OrderBy(item => item.PolicyRes.Name);
        }

        private IEnumerable<PolicyResponse> QueryFilterName(IEnumerable<PolicyResponse> context)
        {
            return context.Where(item => item.PolicyRes.Name.Contains(this.Name));
        }
        private IEnumerable<PolicyResponse> QueryFilterDecs(IEnumerable<PolicyResponse> context)
        {
            return context.Where(item => item.PolicyRes.Description.Contains(this.Decs));
        }
        private IEnumerable<PolicyResponse> QueryFilterStatus(IEnumerable<PolicyResponse> context)
        {
            return context.Where(item => item.PolicyRes.Status == this.Status);
        }
        private IEnumerable<PolicyResponse> QueryFilterCompanyId(IEnumerable<PolicyResponse> context)
        {
            return context.Where(item => item.CompanyRes.Id == this.CompanyId);
        }
    }
}
