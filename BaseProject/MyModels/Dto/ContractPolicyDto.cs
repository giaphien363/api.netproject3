using BaseProject.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BaseProject.MyModels
{
    public class ContractPolicyDto
    {
        public int? ContractId { get; set; } // it's employee id
        public int? PolicyId { get; set; }
        public string Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal? Emi { get; set; }
        public decimal? AmountOwing { get; set; }
        public int PaymentStatus { get; set; }
        public int PaymentType { get; set; }


        public static ContractPolicy CreateContractPolicy(PolicyOrder dto, Policy policy)
        {
            ContractPolicy newContractPolicy = new ContractPolicy();

            newContractPolicy.ContractId = dto.EmployeeId;
            newContractPolicy.PolicyId = dto.PolicyId;
            newContractPolicy.StartDate = dto.StartDate;
            newContractPolicy.EndDate = dto.StartDate.AddDays(policy.DurationInDays);
            newContractPolicy.PaymentStatus = 0;
            newContractPolicy.AmountOwing = policy.Price;
            newContractPolicy.PaymentType = dto.PaymentType;
            if(dto.Emi != null)
            {
                newContractPolicy.Emi = dto.Emi;
            }
            
            return newContractPolicy;
        }

        public static ContractPolicy UpdateContractPolicy(ContractPolicy current, ContractPolicyDto newConPo)
        {

            if (newConPo.PolicyId != null)
                current.PolicyId = newConPo.PolicyId;
            if (newConPo.Description != null)
                current.Description = newConPo.Description;

            if (newConPo.StartDate != null)
                current.StartDate = newConPo.StartDate;
            if (newConPo.EndDate != null)
                current.EndDate = newConPo.EndDate;
            if (newConPo.Emi != null)
                current.Emi = newConPo.Emi;

            if (newConPo.AmountOwing != null)
                current.AmountOwing = newConPo.AmountOwing;
            if (newConPo.PaymentStatus != null)
                current.PaymentStatus = newConPo.PaymentStatus;
            if (newConPo.PaymentType != null)
                current.PaymentType = newConPo.PaymentType;

            DateTime datetimeNow = DateTime.Now;
            current.UpdatedAt = datetimeNow;

            return current;

        }
    }
}
