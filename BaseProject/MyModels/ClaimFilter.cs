using BaseProject.ApiDbContext;
using BaseProject.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
//using System.Data.Entity;
using System.Linq;

namespace BaseProject.MyModels
{
    public class ClaimFilter : PaginationFilter
    {
        public int EmId { get; set; }
        public string Name { get; set; }
        public int Status { get; set; }

        public ClaimFilter() { }
        public ClaimFilter(int pageNumber, int pageSize, int emId, int status, string name)
        {
            this.PageNumber = pageNumber;
            this.PageSize = pageSize;
            this.EmId = emId;
            this.Name = name;
            this.Status = status;
        }

        public IEnumerable<ClaimEmployee> GetClaimFilterForInsu(ApiNetContext context, int company_id)
        {

            IEnumerable<ClaimEmployee> query = context.ClaimEmployees
                        .Join(
                            context.Policies,
                            claim => claim.PolicyId,
                            po => po.Id,
                            (claim, poli) => new { claim, poli }
                        )
                        .Where(item => item.poli.CompanyId == company_id)
                        .Select(item => item.claim)
                        .Where(item => item.IsDeleted == 0)
                        .Include(item => item.Policy)
                        .Include(item => item.Employee)
                        .Include(item => item.ClaimActions)
                        .OrderByDescending(d => d.CreatedAt);

            if (this.EmId > 0)
            {
                query = this.FilterByEmId(query);
            }
            
            if (this.Name != null)
            {
                query = this.FilterByName(query);
            }

            if (this.Status > 0)
            {
                query = this.FilterByStatus(query);
            }
            return query;
            //.Skip((this.PageNumber - 1) * this.PageSize)
            //.Take(this.PageSize)
            //.ToList();
        }

        public IEnumerable<ClaimEmployee> GetClaimFilter(ApiNetContext context)
        {
            IEnumerable<ClaimEmployee> query = context.ClaimEmployees
                                    .Where(item => item.IsDeleted == 0)
                                    .Include(item => item.ClaimActions)
                                    .Include(item => item.Policy)
                                    .OrderByDescending(d => d.CreatedAt);
            if (this.EmId > 0)
            {
                query = this.FilterByEmId(query);
            }

            if (this.Status > 0)
            {
                query = this.FilterByStatus(query);
            }
            return query;

            //.Skip((this.PageNumber - 1) * this.PageSize)
            //.Take(this.PageSize)
            //.ToList();
        }

        private IEnumerable<ClaimEmployee> FilterByName(IEnumerable<ClaimEmployee> context)
        {
            return context.Where(item => item.Employee.Username.Contains(this.Name))
                .Where(item => item.Employee.Firstname.Contains(this.Name))
                .Where(item => item.Employee.Lastname.Contains(this.Name));
        }
        private IEnumerable<ClaimEmployee> FilterByStatus(IEnumerable<ClaimEmployee> context)
        {
            return context.Where(item => item.Status == this.Status);
        }
        
        private IEnumerable<ClaimEmployee> FilterByEmId(IEnumerable<ClaimEmployee> context)
        {
            return context.Where(item => item.EmployeeId == this.EmId);
        }
    }
}
