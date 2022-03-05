using BaseProject.Models;

namespace BaseProject.MyModels
{
    public class ContractResponse
    {
        public Contract ContractRes { get; set; }
        public Employee EmployeeRes { get; set; }
        public int TotalContractPolicy { get; set; }
    }
}
