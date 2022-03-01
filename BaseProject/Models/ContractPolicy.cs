﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
#nullable disable
using System;
using System.Collections.Generic;

namespace BaseProject.Models
{
    public partial class ContractPolicy
    {
        public int Id { get; set; }
        public int? ContractId { get; set; }
        public int? PolicyId { get; set; }
        public string Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int? IsDeleted { get; set; }
        public int PaymentStatus { get; set; }

        public virtual Contract Contract { get; set; }
        public virtual Policy Policy { get; set; }
    }
}