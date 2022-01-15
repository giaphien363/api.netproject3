using System;
using System.ComponentModel.DataAnnotations;

namespace BaseProject.MyModels
{
    public class EmployeeDto
    {
        [Required]
        public string Username { get; set; }
        [Required]
        public string Password { get; set; }
        public decimal? Salary { get; set; }
        public string? Firstname { get; set; }
        public string? Lastname { get; set; }
        public DateTime? Joindate { get; set; }
        public string? Designation { get; set; }
        public string? Address { get; set; }
        public string? Contact { get; set; }
        public string? State { get; set; }
        public string? Country { get; set; }
        public string? City { get; set; }
    }
}
