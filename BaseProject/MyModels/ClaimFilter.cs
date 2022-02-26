using BaseProject.ApiDbContext;
using BaseProject.Models;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;

namespace BaseProject.MyModels
{
    public class ClaimFilter : PaginationFilter
    {
        public int EmId { get; set; }
        public int Status { get; set; }

        public ClaimFilter() { }
        public ClaimFilter(int pageNumber, int pageSize, int emId, int status)
        {
            this.PageNumber = pageNumber;
            this.PageSize = pageSize;
            this.EmId = emId;
            this.Status = status;
        }

        public IEnumerable<ClaimEmployee> GetClaimFilterForInsu(ApiNetContext context, int company_id)
        {
            if (this.EmId > 0)
            {
                if (this.Status >= 0)
                {
                    return context.ClaimEmployees
                        .Join(
                            context.Policies,
                            claim => claim.PolicyId,
                            po => po.Id,
                            (claim, poli) => new { claim, poli }
                        )
                        .Where(item => item.claim.IsDeleted == 0)
                        .Where(item => item.poli.CompanyId == company_id)
                        .Where(item => item.claim.EmployeeId == this.EmId)
                        .Where(item => item.claim.Status == this.Status)
                        .Include(item => item.claim.Policy)
                        .Include(item => item.claim.ClaimActions)
                        .OrderByDescending(d => d.claim.CreatedAt)
                        .Select(item => item.claim);
                        
                }
                return context.ClaimEmployees
                        .Join(
                            context.Policies,
                            claim => claim.PolicyId,
                            po => po.Id,
                            (claim, poli) => new { claim, poli }
                        )
                        .Where(item => item.claim.IsDeleted == 0)
                        .Where(item => item.poli.CompanyId == company_id)
                        .Where(item => item.claim.EmployeeId == this.EmId)
                        .Include(item => item.claim.Policy)
                        .Include(item => item.claim.ClaimActions)
                        .OrderByDescending(d => d.claim.CreatedAt)
                        .Select(item => item.claim);                        
            }

            if (this.Status >= 0)
            {
                return context.ClaimEmployees
                        .Join(
                            context.Policies,
                            claim => claim.PolicyId,
                            po => po.Id,
                            (claim, poli) => new { claim, poli }
                        )
                        .Where(item => item.claim.IsDeleted == 0)
                        .Where(item => item.poli.CompanyId == company_id)
                        .Where(item => item.claim.Status == this.Status)
                        .Include(item => item.claim.Policy)
                        .Include(item => item.claim.ClaimActions)
                        .OrderByDescending(d => d.claim.CreatedAt)
                        .Select(item => item.claim);
                        //.Skip((this.PageNumber - 1) * this.PageSize)
                        //.Take(this.PageSize)
                        //.ToList();
            }
            return context.ClaimEmployees
                        .Join(
                            context.Policies,
                            claim => claim.PolicyId,
                            po => po.Id,
                            (claim, poli) => new { claim, poli }
                        )
                        .Where(item => item.claim.IsDeleted == 0)
                        .Where(item => item.poli.CompanyId == company_id)
                        .Include(item => item.claim.Policy)
                        .Include(item => item.claim.ClaimActions)
                        .OrderByDescending(d => d.claim.CreatedAt)
                        .Select(item => item.claim);
                        //.Skip((this.PageNumber - 1) * this.PageSize)
                        //.Take(this.PageSize)
                        //.ToList();
        }
   
        public IEnumerable<ClaimEmployee> GetClaimFilter(ApiNetContext context)
        {
            if (this.EmId > 0)
            {
                if (this.Status >= 0)
                {
                    return context.ClaimEmployees
                    .Where(item => item.IsDeleted == 0)
                    .Where(item => item.EmployeeId == this.EmId)
                    .Where(item => item.Status == this.Status)
                    .Include(item => item.Policy)
                    .Include(item => item.ClaimActions)
                    .OrderByDescending(d => d.CreatedAt)
                    .Skip((this.PageNumber - 1) * this.PageSize)
                    .Take(this.PageSize)
                    .ToList();
                }
                return context.ClaimEmployees
                    .Where(item => item.IsDeleted == 0)
                    .Where(item => item.EmployeeId == this.EmId)
                    .Include(item => item.Policy)
                    .Include(item => item.ClaimActions)
                    .OrderByDescending(d => d.CreatedAt)
                    .Skip((this.PageNumber - 1) * this.PageSize)
                    .Take(this.PageSize)
                    .ToList();
            }

            if (this.Status >= 0)
            {
                return context.ClaimEmployees
                     .Where(item => item.IsDeleted == 0)
                     .Where(item => item.Status == this.Status)
                     .Include(item => item.Policy)
                     .Include(item => item.ClaimActions)
                     .OrderByDescending(d => d.CreatedAt)
                     .Skip((this.PageNumber - 1) * this.PageSize)
                     .Take(this.PageSize)
                     .ToList();
            }
            return context.ClaimEmployees
                   .Where(item => item.IsDeleted == 0)
                   .Include(item => item.Policy)
                   .Include(item => item.ClaimActions)
                   .OrderByDescending(d => d.CreatedAt)
                   .Skip((this.PageNumber - 1) * this.PageSize)
                   .Take(this.PageSize)
                   .ToList();
        }
    }
}
