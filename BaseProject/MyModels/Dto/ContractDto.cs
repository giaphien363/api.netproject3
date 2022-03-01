using BaseProject.Models;

namespace BaseProject.MyModels
{
    public class ContractDto
    {

        public static Contract CreateContract(Employee employee)
        {
            Contract new_contract = new Contract();
            new_contract.EmployeeId = employee.Id;
            new_contract.Name = "HD" + employee.Id;
            new_contract.Description = "A contract listing all medical insurance policies that " + employee.Username + " has taken out";

            return new_contract;
        }

        //public static void UpdateTotalAmount(Contract existContract,decimal amount)
        //{
        //    existContract.TotalAmount += amount;

        //}
    }
}
