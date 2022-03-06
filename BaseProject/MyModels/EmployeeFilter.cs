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
        public string SearchString { get; set; }

        public EmployeeFilter() { }
        public EmployeeFilter(int pageNumber, int pageSize, string searchString)
        {
            this.PageNumber = pageNumber;
            this.PageSize = pageSize;
            this.SearchString = searchString.ToLower();
        }

        public IEnumerable<Employee> GetEmployeeFilter(ApiNetContext context)
        {
            if (this.SearchString != null)
            {
                return context.Employees
                .Where(item => item.IsDeleted == 0)
                .Where(item =>
                    item.Username.ToLower().Contains(this.SearchString) ||
                    (item.Firstname + " " + item.Lastname).ToLower().Contains(this.SearchString)
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
