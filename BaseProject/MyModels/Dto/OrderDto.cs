using BaseProject.Common;
using BaseProject.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace BaseProject.MyModels
{
    public class OrderDto
    {
        [Required]
        public DateTime StartDate { get; set; }
        [Required]
        public int PaymentType { get; set; }
        public decimal? Emi { get; set; }
        [Required]
        public int? EmployeeId { get; set; }
        [Required]
        public int? PolicyId { get; set; }

        public static PolicyOrder CreateOrder(OrderDto dto)
        {
            PolicyOrder order = new PolicyOrder();

            order.StartDate = dto.StartDate;
            order.PaymentType = dto.PaymentType;
            order.EmployeeId = dto.EmployeeId;
            order.PolicyId = dto.PolicyId;
            order.Status = (int)StatusPolicyOrder.PENDING;

            if (dto.Emi != null)
            {
                order.Emi = dto.Emi;
            }
            return order;
        }

        public static PolicyOrder UpdateOrder(PolicyOrder current, PolicyOrder order)
        {
            if (order.StartDate != null)
            {
                current.StartDate = order.StartDate;
            }
            if (order.PaymentType != null)
            {
                current.PaymentType = order.PaymentType;
            }
            if (order.EmployeeId != null)
            {
                current.EmployeeId = order.EmployeeId;
            }
            if (order.PolicyId != null)
            {
                current.PolicyId = order.PolicyId;
            }

            if (order.Emi != null)
            {
                current.Emi = order.Emi;
            }

            DateTime datetimeNow = DateTime.Now;
            current.UpdatedAt = datetimeNow;

            return order;
        }
    }
}
