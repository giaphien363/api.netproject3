using BaseProject.ApiDbContext;
using BaseProject.Models;
using System.Collections.Generic;
using System.Linq;

namespace BaseProject.MyModels
{
    public class InsuranceCompanyFilter : PaginationFilter
    {
        public string SearchString { get; set; }

        public InsuranceCompanyFilter() { }
        public InsuranceCompanyFilter(int pageNumber, int pageSize, string searchString)
        {
            this.PageNumber = pageNumber;
            this.PageSize = pageSize;
            this.SearchString = searchString.ToLower();
        }

        public IEnumerable<InsuranceCompany> GetInCompanyFilter(ApiNetContext context)
        {
            if (this.SearchString != null)
            {
                return context.InsuranceCompanies
                    .Where(item => item.IsDeleted == 0)
                    .Where(item => item.Name.ToLower().Contains(this.SearchString))
                    .OrderBy(item => item.Name);

            }
            return context.InsuranceCompanies
                .Where(item => item.IsDeleted == 0)
                .OrderBy(item => item.Name);
            //.Skip((this.PageNumber - 1) * this.PageSize)
            //.Take(this.PageSize)
            //.ToList();
        }

    }
}
