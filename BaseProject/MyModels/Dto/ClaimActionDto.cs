using BaseProject.ApiDbContext;
using BaseProject.Models;

namespace BaseProject.MyModels
{
    public class ClaimActionDto
    {
        public int ActionType { get; set; }
        public string Reason { get; set; }
        public int? EmployeeId { get; set; }
        public int? InsuranceAdminId { get; set; }
        public int? ClaimId { get; set; }

        public static void AddAction(ClaimActionDto actionDto)
        {
            using (var context = new ApiNetContext())
            {
                var claimAction= new ClaimAction();

                claimAction.ActionType = actionDto.ActionType;
                claimAction.ClaimId = actionDto.ClaimId;

                if(actionDto.Reason != null)
                    claimAction.Reason = actionDto.Reason;
                if (actionDto.EmployeeId != null)
                    claimAction.CreatebyEmployeeId = actionDto.EmployeeId;
                if (actionDto.InsuranceAdminId != null)
                    claimAction.CreatebyInsuranceAdminId = actionDto.InsuranceAdminId;

                context.ClaimActions.Add(claimAction);
                context.SaveChanges();
            }
        }
    }
}
