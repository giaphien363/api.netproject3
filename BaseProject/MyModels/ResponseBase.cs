using BaseProject.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BaseProject.MyModels
{
    public class ResponseBase
    {
    }

    public class PolicyResponse
    {
        public Policy PolicyRes { get; set; }
        public TypePolicy TypeRes { get; set; }
        public InsuranceCompany CompanyRes { get; set; }
    }
}
