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
    public class ClaimResponse
    {
        public ClaimEmployee ClaimRes { get; set; }
        public Policy PolicyRes { get; set; }
    }

    public class ClaimResponseDetail
    {
        public ClaimEmployee ClaimRes { get; set; }
        public ICollection<ClaimAction> ActionRes { get; set; }
        public Policy PolicyRes { get; set; }
        public TypePolicy TypeRes { get; set; }
        public InsuranceCompany CompanyRes { get; set; }
    }
}
