using BaseProject.ApiDbContext;
using BaseProject.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BaseProject.MyModels
{
    public class PolicyOrderFilter : PaginationFilter
    {
        public int Status { get; set; }

        public PolicyOrderFilter() { }

        public IEnumerable<PolicyOrder> GetPolicyOrderFilter(ApiNetContext context)
        {
            if (this.Status > 0)
            {
                return context.PolicyOrders
                .Where(item => item.IsDeleted == 0)
                .Where(item => item.Status == this.Status)
                .OrderBy(item => item.CreatedAt);

            }
            return context.PolicyOrders
               .Where(item => item.IsDeleted == 0)
               .OrderBy(item => item.CreatedAt);
        }
    }
}
