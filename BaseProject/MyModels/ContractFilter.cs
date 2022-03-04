using BaseProject.ApiDbContext;
using BaseProject.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace BaseProject.MyModels
{
    public class ContractFilter : PaginationFilter
    {
        public string Name { get; set; }

        public ContractFilter() { }
        public ContractFilter(int pageNumber, int pageSize, string name)
        {
            this.PageNumber = pageNumber;
            this.PageSize = pageSize;
            this.Name = name;
        }

        public IEnumerable<ContractResponse> GetContractFilter(ApiNetContext context)
        {
            if (this.Name != null)
            {
                return context.Contracts
                    .Where(item => item.IsDeleted == 0)
                    .Where(item => item.Name.Contains(this.Name))
                    .Where(item => item.Employee.Firstname.Contains(this.Name))
                    .Where(item => item.Employee.Lastname.Contains(this.Name))
                    .Where(item => item.Employee.Username.Contains(this.Name))
                    .OrderBy(item => item.Name)
                    .Select(item => new ContractResponse()
                    {
                        EmployeeRes = item.Employee,
                        TotalContractPolicy = item.ContractPolicies.Count
                    });

            }
            return context.Contracts
                .Where(item => item.IsDeleted == 0)
                .OrderBy(item => item.Name)
                .Select(item => new ContractResponse()
                {
                    EmployeeRes = item.Employee,
                    TotalContractPolicy = item.ContractPolicies.Count
                });

        }

    }
}
