using BaseProject.ApiDbContext;
using BaseProject.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace BaseProject.MyModels
{
    public class ContractFilter : PaginationFilter
    {
        public string SearchString { get; set; }
        public int ContractId { get; set; } // chinh la employee id

        public ContractFilter() { }
        public ContractFilter(int pageNumber, int pageSize, string searchString)
        {
            this.PageNumber = pageNumber;
            this.PageSize = pageSize;
            this.SearchString = searchString.ToLower();
        }

        public IEnumerable<ContractResponse> GetContractFilter(ApiNetContext context)
        {
            if (this.SearchString != null)
            {
                return context.Contracts
                    .Where(item => item.IsDeleted == 0)
                    .Where(item => item.Name.ToLower().Contains(this.SearchString) 
                        || (item.Employee.Firstname + ' ' + item.Employee.Lastname).ToLower().Contains(this.SearchString)
                        || item.Employee.Username.ToLower().Contains(this.SearchString))
                    .OrderBy(item => item.Name)
                    .Select(item => new ContractResponse()
                    {
                        ContractRes = item,
                        EmployeeRes = item.Employee,
                        TotalContractPolicy = item.ContractPolicies.Count
                    });

            }

            if (this.ContractId > 0)
            {
                return context.Contracts
                    .Where(item => item.IsDeleted == 0)
                    .Where(item => item.EmployeeId == this.ContractId)
                    .OrderBy(item => item.Name)
                    .Select(item => new ContractResponse()
                    {
                        ContractRes = item,
                        EmployeeRes = item.Employee,
                        TotalContractPolicy = item.ContractPolicies.Count
                    });

            }
            return context.Contracts
                .Where(item => item.IsDeleted == 0)
                .OrderBy(item => item.Name)
                .Select(item => new ContractResponse()
                {
                    ContractRes = item,
                    EmployeeRes = item.Employee,
                    TotalContractPolicy = item.ContractPolicies.Count
                });

        }

    }
}
