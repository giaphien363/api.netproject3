// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
#nullable disable
using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace BaseProject.Models
{
    public partial class Policy
    {
        public Policy()
        {
            Bills = new HashSet<Bill>();
            ClaimEmployees = new HashSet<ClaimEmployee>();
            ContractPolicies = new HashSet<ContractPolicy>();
            PolicyOrders = new HashSet<PolicyOrder>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int SupportPercent { get; set; }
        public int DurationInDays { get; set; }
        public decimal Price { get; set; }
        public int? TypeId { get; set; }
        public int? CompanyId { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int? IsDeleted { get; set; }
        public int? Status { get; set; }


        [JsonIgnore]
        public virtual InsuranceCompany Company { get; set; }
        [JsonIgnore]

        public virtual TypePolicy Type { get; set; }
        [JsonIgnore]
        public virtual ICollection<Bill> Bills { get; set; }
        [JsonIgnore]
        public virtual ICollection<ClaimEmployee> ClaimEmployees { get; set; }
        [JsonIgnore]
        public virtual ICollection<ContractPolicy> ContractPolicies { get; set; }
        [JsonIgnore]
        public virtual ICollection<PolicyOrder> PolicyOrders { get; set; }
    }
}