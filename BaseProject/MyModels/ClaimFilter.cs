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
