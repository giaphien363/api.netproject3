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
        public int Status { get; set; }
        public int CompanyId { get; set; }

        public PolicyFilter() { }
        public PolicyFilter(int pageNumber, int pageSize, string name, int status, int company_id)
        {
            this.PageNumber = pageNumber;
            this.PageSize = pageSize;
            this.Name = name;
            this.Status = status;
            this.CompanyId = company_id;
        }

        public IEnumerable<Policy> GetPolicyFilter(ApiNetContext context)
        {
            IEnumerable<Policy> query = context.Policies
                    .Where(item => item.IsDeleted == 0)
                    .Include(item => item.Company)
                    .Include(item => item.Type);

            if (this.Name != null)
            {
                query = this.QueryFilterName(query);
            }

            if (this.Status > 0)
            {
                query = this.QueryFilterStatus(query);
            }

            if (this.CompanyId > 0)
            {
                query = this.QueryFilterCompanyId(query);
            }

            return query.OrderBy(item => item.Name);
            //.Skip((this.PageNumber - 1) * this.PageSize)
            //.Take(this.PageSize)
            //.ToList();
        }

        private IEnumerable<Policy> QueryFilterName(IEnumerable<Policy> context)
        {
            return context.Where(item => item.Name.Contains(this.Name));
        }
        private IEnumerable<Policy> QueryFilterStatus(IEnumerable<Policy> context)
        {
            return context.Where(item => item.Status == this.Status);
        }
        private IEnumerable<Policy> QueryFilterCompanyId(IEnumerable<Policy> context)
        {
            return context.Where(item => item.CompanyId == this.CompanyId);
        }
    }
}
