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
                    .Join(
                        context.ClaimEmployees,
                        item => item.bill.ClaimId,
                        claim => claim.Id,
                        (item, claim) => new { item.bill, item.poli, item.em, claim }
                    )
                    .Where(item => item.poli.CompanyId == companyId)
                    .Select(item => new ResponseBill()
                    {
                        SupportCost = item.bill.SupportCost,
                        CreateAt = (DateTime)item.bill.CreatedAt,
                        PolicyName = item.poli.Name,
                        PolicySupport = item.poli.SupportPercent,
                        EmployeeName = item.em.Firstname + " " + item.em.Lastname,
                        ClaimReason = item.claim.Reason,
                        ClaimId = item.claim.Id,
                    });

            return query.OrderBy(item => item.CreateAt);
        }

        public IEnumerable<ResponseBill> GetBillFilterAdmin(ApiNetContext context)
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
                    .Join(
                        context.ClaimEmployees,
                        item => item.bill.ClaimId,
                        claim => claim.Id,
                        (item, claim) => new { item.bill, item.poli, item.em, claim }
                    )
                    .Select(item => new ResponseBill()
                    {
                        SupportCost = item.bill.SupportCost,
                        CreateAt = (DateTime)item.bill.CreatedAt,
                        PolicyName = item.poli.Name,
                        PolicySupport = item.poli.SupportPercent,
                        EmployeeName = item.em.Firstname + " " + item.em.Lastname,
                        ClaimReason = item.claim.Reason,
                        ClaimId = item.claim.Id,
                    });

            return query.OrderBy(item => item.CreateAt);
        }

        public IEnumerable<ResponseBill> GetBillFilterEmployee(ApiNetContext context, int employeeId)
        {

            IEnumerable<ResponseBill> query = context.Bills
                    .Where(item => item.EmployeeId == employeeId)
                    .Join(
                        context.Policies,
                        bill => bill.PolicyId,
                        po => po.Id,
                        (bill, poli) => new { bill, poli }
                    )
                    .Join(
                        context.ClaimEmployees,
                        item => item.bill.ClaimId,
                        claim => claim.Id,
                        (item, claim) => new { item.bill, item.poli, claim }
                    )
                    .Select(item => new ResponseBill()
                    {
                        SupportCost = item.bill.SupportCost,
                        CreateAt = (DateTime)item.bill.CreatedAt,
                        PolicyName = item.poli.Name,
                        PolicySupport = item.poli.SupportPercent,
                        ClaimReason = item.claim.Reason,
                        ClaimId = item.claim.Id,
                    });

            return query.OrderBy(item => item.CreateAt);

        }
    }
}
