using BaseProject.ApiDbContext;
using BaseProject.Models;

namespace BaseProject.MyModels
{
    public class BillDto
    {
        public static void CreateBill(ClaimEmployee claim)
        {
            using (var context = new ApiNetContext())
            {
                Bill bill = new Bill();

                bill.EmployeeId = claim.EmployeeId;
                bill.PolicyId = claim.PolicyId;
                bill.ClaimId = claim.Id;
                bill.SupportCost = (claim.TotalCost * claim.Policy.SupportPercent) /100;

                context.Bills.Add(bill);
                context.SaveChanges();
            }
        }
    }
}
