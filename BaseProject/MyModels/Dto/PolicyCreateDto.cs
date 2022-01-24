using BaseProject.Models;
using System;

namespace BaseProject.MyModels
{
    public class PolicyUpdateDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public int SupportPercent { get; set; }
        public int DurationInDays { get; set; }
        public decimal Price { get; set; }
        public int? TypeId { get; set; }
        public int? CompanyId { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public static Policy UpdatePolicy(Policy current, PolicyUpdateDto policyDto)
        {
            if (policyDto.Name != null)
                current.Name = policyDto.Name;
            if (policyDto.Description != null)
                current.Description = policyDto.Description;

            if (policyDto.SupportPercent != null)
                current.SupportPercent = policyDto.SupportPercent;

            if (policyDto.DurationInDays != null)
                current.DurationInDays = policyDto.DurationInDays;
            if (policyDto.Price != null)
                current.Price = policyDto.Price;

            if (policyDto.TypeId != null)
                current.TypeId = policyDto.TypeId;
            if (policyDto.CompanyId != null)
                current.CompanyId = policyDto.CompanyId;

            DateTime datetimeNow = DateTime.Now;
            current.UpdatedAt = datetimeNow;

            return current;
        }
    }
}
