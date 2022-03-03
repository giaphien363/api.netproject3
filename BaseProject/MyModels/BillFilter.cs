using BaseProject.ApiDbContext;
using BaseProject.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BaseProject.MyModels
{
    public class BillFilter : PaginationFilter
    {
        public int EmployeeId { get; set; }
        public BillFilter() { }

        public BillFilter(int pageNumber, int pageSize)
        {
            this.PageNumber = pageNumber;
            this.PageSize = pageSize;
        }

        public IEnumerable<ResponseBill> GetBillFilterInsu(ApiNetContext context, int companyId)
        {
            IEnumerable<ResponseBill> query = context.Bills
                    .Join(
                        context.Policies,
                        bill => bill.PolicyId,
                        po => po.Id,
                        (bill, poli) => new { bill, poli }
                    )
                    .Join(
                        context.Employees,
                        bill => bill.bill.EmployeeId,
                        em => em.Id,
                        (bill, em) => new { bill.bill, bill.poli, em }
                    )
                    .Where(item => item.poli.CompanyId == companyId)
                    .Select(item => new ResponseBill()
                    {
                        SupportCost = item.bill.SupportCost,
                        CreateAt = (DateTime)item.bill.CreatedAt,
                        PolicyName = item.poli.Name,
                        PolicySupport = item.poli.SupportPercent,
                        EmployeeName = item.em.Firstname + " " + item.em.Lastname
                    });

            return query.OrderBy(item => item.CreateAt);
        }

        public IEnumerable<Bill> GetBillFilter(ApiNetContext context)
        {
            if (this.EmployeeId > 0)
            {
                IEnumerable<Bill> query = context.Bills
                        .Join(
                            context.ClaimEmployees,
                            bill => bill.ClaimId,
                            claim => claim.Id,
                            (bill, claim) => new { bill, claim }
                        )
                        .Where(item => item.claim.EmployeeId == this.EmployeeId)
                        .Select(item => item.bill);
                return query.OrderBy(item => item.CreatedAt);
            }
            IEnumerable<Bill> query_admin = context.Bills.ToList();
            return query_admin.OrderBy(item => item.CreatedAt);

        }

    }
}
