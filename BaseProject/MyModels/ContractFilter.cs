using BaseProject.ApiDbContext;
using BaseProject.Models;
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

        public IEnumerable<Contract> GetContractFilter(ApiNetContext context)
        {
            if (this.Name != null)
            {
                return context.Contracts
                    .Where(item => item.IsDeleted == 0)
                    .Where(item => item.Name.Contains(this.Name))
                    .OrderBy(item => item.Name);
                //.Skip((this.PageNumber - 1) * this.PageSize)
                //.Take(this.PageSize)
                //.ToList();
            }
            return context.Contracts
                .Where(item => item.IsDeleted == 0)
                .OrderBy(item => item.Name);
            //.Skip((this.PageNumber - 1) * this.PageSize)
            //.Take(this.PageSize)
            //.ToList();
        }

    }
}
