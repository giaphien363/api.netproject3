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

        public static ClaimAction ConvertIntoAction(ClaimActionDto actionDto)
        {
            var claimAction = new ClaimAction();
            claimAction.ActionType = actionDto.ActionType;
            claimAction.ClaimId = actionDto.ClaimId;

            if (actionDto.Reason != null)
                claimAction.Reason = actionDto.Reason;
            if (actionDto.EmployeeId != null)
                claimAction.CreatebyEmployeeId = actionDto.EmployeeId;
            if (actionDto.InsuranceAdminId != null)
                claimAction.CreatebyInsuranceAdminId = actionDto.InsuranceAdminId;

            return claimAction;
        }
    }
}
