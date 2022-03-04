using BaseProject.ApiDbContext;
using BaseProject.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BaseProject.MyModels
{
    public class EmployeeFilter : PaginationFilter
    {
        public string Name { get; set; }

        public EmployeeFilter() { }
        public EmployeeFilter(int pageNumber, int pageSize, string name)
        {
            this.PageNumber = pageNumber;
            this.PageSize = pageSize;
            this.Name = name;
        }

        public IEnumerable<Employee> GetEmployeeFilter(ApiNetContext context)
        {
            if (this.Name != null)
            {
                return context.Employees
                .Where(item => item.IsDeleted == 0)
                .Where(item =>
                    item.Username.Contains(this.Name) ||
                    item.Firstname.Contains(this.Name) ||
                    item.Lastname.Contains(this.Name)
                    )
                .OrderBy(item => item.Username);
                
            }
            return context.Employees
                .Where(item => item.IsDeleted == 0)
                .OrderBy(item => item.Username);
                //.Skip((this.PageNumber - 1) * this.PageSize)
                //.Take(this.PageSize)
                //.ToList();
        }

    }
}
