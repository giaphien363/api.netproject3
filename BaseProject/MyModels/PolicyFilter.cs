using BaseProject.ApiDbContext;
using BaseProject.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BaseProject.MyModels
{
    public class PolicyFilter : PaginationFilter
    {
        public string Key { get; set; }
        public decimal MaxPrice { get; set; }

        public PolicyFilter() { }
        public PolicyFilter(int pageNumber, int pageSize, string key, decimal maxPrice)
        {
            this.PageNumber = pageNumber;
            this.PageSize = pageSize;
            this.Key = key;
            this.MaxPrice = maxPrice;
        }

        public  IEnumerable<Policy> GetPolicyFilter(ApiNetContext context)
        {
            if (this.Key != null)
            {
                if (this.MaxPrice > 0)
                {
                    return  context.Policies
                    .Where(item => item.IsDeleted == 0)
                    .Where(item => item.Name.Contains(this.Key))
                    .Where(item => item.Price < this.MaxPrice)
                    .Skip((this.PageNumber - 1) * this.PageSize)
                    .Take(this.PageSize)
                    .ToList();
                }
                return  context.Policies
                    .Where(item => item.IsDeleted == 0)
                    .Where(item => item.Name.Contains(this.Key))
                    .Skip((this.PageNumber - 1) * this.PageSize)
                    .Take(this.PageSize)
                    .ToList();
            }

            if (this.MaxPrice != 0)
            {
                return  context.Policies
                .Where(item => item.IsDeleted == 0)
                .Where(item => item.Price < this.MaxPrice)
                .Skip((this.PageNumber - 1) * this.PageSize)
                .Take(this.PageSize)
                .ToList();
            }
            return  context.Policies
                .Where(item => item.IsDeleted == 0)
                .Skip((this.PageNumber - 1) * this.PageSize)
                .Take(this.PageSize)
                .ToList();
        }
    }
}
