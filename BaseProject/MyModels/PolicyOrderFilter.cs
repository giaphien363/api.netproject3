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

        public IEnumerable<OrderResponse> GetPolicyOrderFilter(ApiNetContext context)
        {
            IEnumerable<OrderResponse> listOrders = context.PolicyOrders
                             .Join(
                                 context.Employees,
                                 poliOrder => poliOrder.EmployeeId,
                                 em => em.Id,
                                 (poliOrder, emp) => new { poliOrder, emp }
                             )
                             .Join(
                                 context.Policies,
                                 group => group.poliOrder.PolicyId,
                                 policy => policy.Id,
                                 (group, policy) => new { group, policy }
                             )
                             .Select(item => new OrderResponse()
                             {
                                 OrderRes = item.group.poliOrder,
                                 EmployeeRes = item.group.emp,
                                 PolicyRes = item.policy
                             });
            // OrderResponse
            if (this.Status > 0)
            {
                return listOrders.Where(item => item.OrderRes.Status == this.Status).OrderBy(item => item.OrderRes.CreatedAt); ;
            }
            return listOrders.OrderBy(item => item.OrderRes.CreatedAt);
        }
        public IEnumerable<OrderResponse> GetPolicyOrderFilterEmployee(ApiNetContext context, int employeeId)
        {
            IEnumerable<OrderResponse> listOrders = context.PolicyOrders
                            .Where(item => item.EmployeeId == employeeId)
                            .Join(
                                context.Employees,
                                poliOrder => poliOrder.EmployeeId,
                                em => em.Id,
                                (poliOrder, emp) => new { poliOrder, emp }
                            )
                            .Join(
                                context.Policies,
                                group => group.poliOrder.PolicyId,
                                policy => policy.Id,
                                (group, policy) => new { group, policy }
                            )
                            .Select(item => new OrderResponse()
                            {
                                OrderRes = item.group.poliOrder,
                                EmployeeRes = item.group.emp,
                                PolicyRes = item.policy
                            });
            // OrderResponse
            if (this.Status > 0)
            {
                return listOrders
                    .Where(item => item.OrderRes.Status == this.Status)
                    .OrderBy(item => item.OrderRes.CreatedAt)
                    .Where(item => item.OrderRes.IsDeleted == 0);
            }
            return listOrders.OrderBy(item => item.OrderRes.CreatedAt).Where(item => item.OrderRes.IsDeleted == 0);
        }
    }
}
