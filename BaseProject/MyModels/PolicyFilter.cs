using BaseProject.ApiDbContext;
using BaseProject.Models;
using System.Collections.Generic;
using System.Linq;

namespace BaseProject.MyModels
{
    public class PolicyFilter : PaginationFilter
    {
        public string Name { get; set; }
        public int Status { get; set; }

        public PolicyFilter() { }
        public PolicyFilter(int pageNumber, int pageSize, string name, int status)
        {
            this.PageNumber = pageNumber;
            this.PageSize = pageSize;
            this.Name = name;
            this.Status = status;
        }

        public IEnumerable<Policy> GetPolicyFilter(ApiNetContext context)
        {
            if (this.Name != null)
            {
                if (this.Status > 0)
                {
                    return context.Policies
                    .Where(item => item.IsDeleted == 0)
                    .Where(item => item.Name.Contains(this.Name))
                    .Where(item => item.Status == this.Status)
                    .OrderBy(item => item.Name);
                    //.Skip((this.PageNumber - 1) * this.PageSize)
                    //.Take(this.PageSize)
                    //.ToList();
                }
                return context.Policies
                    .Where(item => item.IsDeleted == 0)
                    .Where(item => item.Name.Contains(this.Name))
                    .OrderBy(item => item.Name);
                //.Skip((this.PageNumber - 1) * this.PageSize)
                //.Take(this.PageSize)
                //.ToList();
            }

            if (this.Status > 0)
            {
                return context.Policies
                .Where(item => item.IsDeleted == 0)
                .Where(item => item.Status == this.Status)
                .OrderBy(item => item.Name);
                //.Skip((this.PageNumber - 1) * this.PageSize)
                //.Take(this.PageSize)
                //.ToList();
            }
            return context.Policies
                .Where(item => item.IsDeleted == 0)
                .OrderBy(item => item.Name);
            //.Skip((this.PageNumber - 1) * this.PageSize)
            //.Take(this.PageSize)
            //.ToList();
        }
    }
}
