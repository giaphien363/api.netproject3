using BaseProject.Common;
using BaseProject.Models;
using System;
using System.ComponentModel.DataAnnotations;

namespace BaseProject.MyModels
{
    public class EmployeeCreateDto
    {
        [Required]
        public string Username { get; set; }
        [Required]
        public string Password { get; set; }
        public decimal? Salary { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public DateTime? Joindate { get; set; }
        public string Designation { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
        public string Country { get; set; }
        public string City { get; set; }

        public static Employee ConvertIntoEmployee(EmployeeCreateDto emDto)
        {
            Employee employee = new Employee();
            employee.Password = EncryptPassword.Encrypt(emDto.Password);
            employee.Username = emDto.Username;
            employee.Salary = emDto.Salary;
            employee.Firstname = emDto.Firstname;
            employee.Lastname = emDto.Lastname;
            employee.Joindate = emDto.Joindate;
            employee.Designation = emDto.Designation;
            employee.Address = emDto.Address;
            employee.Phone = emDto.Phone;
            employee.Country = emDto.Country;
            employee.City = emDto.City;

            return employee;
        }

        public static Employee UpdateEmployee(Employee employeeOld, Employee employeeNew)
        {
            if (employeeNew.Salary != null)
                employeeOld.Salary = employeeNew.Salary;
            if (employeeNew.Firstname != null)
                employeeOld.Firstname = employeeNew.Firstname;
            if (employeeNew.Lastname != null)
                employeeOld.Lastname = employeeNew.Lastname;

            if (employeeNew.Joindate != null)
                employeeOld.Joindate = employeeNew.Joindate;
            if (employeeNew.Designation != null)
                employeeOld.Designation = employeeNew.Designation;
            if (employeeNew.Address != null)
                employeeOld.Address = employeeNew.Address;

            if (employeeNew.Phone != null)
                employeeOld.Phone = employeeNew.Phone;
            if (employeeNew.Country != null)
                employeeOld.Country = employeeNew.Country;
            if (employeeNew.City != null)
                employeeOld.City  = employeeNew.City;

            DateTime datetimeNow = DateTime.Now;
            employeeOld.UpdatedAt = datetimeNow;
            return employeeOld;
        }
    }
}
