using BaseProject.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace BaseProject.MyModels
{
    public class ICompanyCreateDto
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public string Address { get; set; }
        [Required]
        public string Phone { get; set; }
        public string Url { get; set; }

        public static InsuranceCompany ConvertIntoICompany(ICompanyCreateDto comDto)
        {
            InsuranceCompany inCom = new InsuranceCompany();

            inCom.Name = comDto.Name;
            inCom.Address = comDto.Address;
            inCom.Phone = comDto.Phone;
            if (comDto.Url != null)
            {
                inCom.Url = comDto.Url;
            }

            return inCom;
        }

        public static InsuranceCompany UpdateICompany(InsuranceCompany current, InsuranceCompany incom)
        {
            if(incom.Name != null)
            {
                current.Name = incom.Name;
            }
            if (incom.Address != null)
            {
                current.Address = incom.Address;
            }
            if (incom.Phone != null)
            {
                current.Phone = incom.Phone;
            }
            if (incom.Url != null)
            {
                current.Url = incom.Url;
            }

            DateTime datetimeNow = DateTime.Now;
            current.UpdatedAt = datetimeNow;

            return current;
        }
    }
}
