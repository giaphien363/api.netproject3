using BaseProject.Common;
using BaseProject.Models;
using System;
using System.ComponentModel.DataAnnotations;

namespace BaseProject.MyModels
{
    public class ClaimDto
    {
        [Required]
        public string Reason { get; set; }
        [Required]
        public decimal TotalCost { get; set; }
        public int? EmployeeId { get; set; }
        [Required]
        public int PolicyId { get; set; }

        public static ClaimEmployee CreateClaimEmployee(ClaimDto claimDto)
        {
            ClaimEmployee newClaim = new ClaimEmployee();
            newClaim.Reason = claimDto.Reason;
            newClaim.TotalCost = claimDto.TotalCost;
            newClaim.EmployeeId = claimDto.EmployeeId;
            newClaim.PolicyId = claimDto.PolicyId;
            newClaim.Status = (int)StatusClaimEmployee.PENDING;

            return newClaim;
        }
        
        public static ClaimEmployee UpdateClaimEmployee(ClaimEmployee claimEmp, ClaimDto claimDto)
        {
            claimEmp.Reason = claimDto.Reason;
            claimEmp.TotalCost = claimDto.TotalCost;
            claimEmp.PolicyId = claimDto.PolicyId;

            DateTime datetimeNow = DateTime.Now;
            claimEmp.UpdatedAt = datetimeNow;
            return claimEmp;
        }
    }
}
