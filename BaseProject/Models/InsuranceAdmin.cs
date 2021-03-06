// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
#nullable disable
using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace BaseProject.Models
{
    public partial class InsuranceAdmin
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }
        public int? CompanyId { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int? IsDeleted { get; set; }

        [JsonIgnore]
        public virtual InsuranceCompany Company { get; set; }
    }
}