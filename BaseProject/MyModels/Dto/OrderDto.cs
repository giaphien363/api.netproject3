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
        public int? EmployeeId { get; set; }
        [Required]
        public int? PolicyId { get; set; }

        public static PolicyOrder CreateOrder(OrderDto dto)
        {
            PolicyOrder order = new PolicyOrder();

            order.StartDate = DateTime.Now;
            order.EmployeeId = dto.EmployeeId;
            order.PolicyId = dto.PolicyId;
            order.Status = (int)StatusPolicyOrder.PENDING;
            return order;
        }

        public static PolicyOrder UpdateOrder(PolicyOrder current, PolicyOrder order)
        {
            if (order.StartDate != null)
            {
                current.StartDate = order.StartDate;
            }
            if (order.EmployeeId != null)
            {
                current.EmployeeId = order.EmployeeId;
            }
            if (order.PolicyId != null)
            {
                current.PolicyId = order.PolicyId;
            }

            DateTime datetimeNow = DateTime.Now;
            current.UpdatedAt = datetimeNow;

            return order;
        }
    }
}
