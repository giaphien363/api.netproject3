using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BaseProject.ApiDbContext;
using BaseProject.Models;
using BaseProject.Common;
using BaseProject.MyModels;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace BaseProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeesController : ControllerBase
    {
        private readonly ApiNetContext _context;

        public EmployeesController(ApiNetContext context)
        {
            _context = context;
        }

        // GET: api/Employees ---> list
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<PagedResponse<IEnumerable<Employee>>>> GetEmployees([FromQuery] EmployeeFilter filter)
        {
            // check permission
            ClaimsIdentity identity = HttpContext.User.Identity as ClaimsIdentity;
            ObjReturnToken role = GenToken.GetCurrentUser(identity).Value as ObjReturnToken;
            if (role.Role != RoleUser.ADMIN)
            {
                return Unauthorized(new CustomError { Code = 403, Detail = "Permission denied!" });
            }

            var rawData = filter.GetEmployeeFilter(_context);
            var pagedData = rawData
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToList();
            var totalRecords = rawData.Count();
            PagedResponse<IEnumerable<Employee>> page_response = new PagedResponse<IEnumerable<Employee>>(pagedData, filter.PageNumber, filter.PageSize, totalRecords);
            return Ok(page_response);
        }

        // GET: api/Employees/5 ---> get detail 
        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<Employee>> GetEmployee(int id)
        {
            var employee = await _context.Employees.Where(item => item.Id == id && item.IsDeleted == 0).FirstOrDefaultAsync();

            if (employee == null)
            {
                return NotFound(new CustomError { Code = 404, Detail = "Employee not found!" });
            }

            return Ok(employee);
        }

        // POST: api/Employees ---> create new employee
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Employee>> PostEmployee(EmployeeCreateDto employeeDTO)
        {
            // check permission
            ObjReturnToken user = GetRoleCurrentUser();
            if (user.Role != RoleUser.ADMIN)
            {
                return Unauthorized(new CustomError { Code = 403, Detail = "Permission denied!" });
            }

            // convert employee dto into employee
            Employee employee = EmployeeCreateDto.ConvertIntoEmployee(employeeDTO);
            // check if exist username
            var userExist = await _context.Employees.Where(item => item.Username == employee.Username && item.IsDeleted == 0).FirstOrDefaultAsync();
            if (userExist != null)
            {
                return BadRequest(new CustomError { Code = 409, Detail = "User existed!" });
            }
            _context.Employees.Add(employee);

            await _context.SaveChangesAsync();

            // create contract when created employee
            // create contract one_to_one with employee
            var retrieve = await _context.Employees
                .Where(item => item.Username == employee.Username && item.IsDeleted == 0)
                .FirstOrDefaultAsync();

            Contract contract = ContractDto.CreateContract(retrieve);
            _context.Contracts.Add(contract);
            await _context.SaveChangesAsync();
            return Ok(retrieve);
        }

        // PUT: api/Employees/5 ---> update
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> PutEmployee(int id, Employee employee)
        {
            ObjReturnToken user = GetRoleCurrentUser();
            if (user.Role != RoleUser.ADMIN && user.Role != RoleUser.EMPLOYEE)
            {
                return Unauthorized(new CustomError { Code = 403, Detail = "Permission denied!" });
            }

            var retrieveEmployee = await _context.Employees.Where(item => item.Id == id && item.IsDeleted == 0).FirstOrDefaultAsync();
            if (retrieveEmployee == null)
                return NotFound(new CustomError { Detail = "Employee not found!" });

            retrieveEmployee = EmployeeCreateDto.UpdateEmployee(retrieveEmployee, employee);
            _context.Employees.Update(retrieveEmployee);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }

            return Ok(retrieveEmployee);
        }

        // DELETE: api/Employees/5 ---> delete (actually update isdelete)
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteEmployee(int id)
        {
            // check permission
            ClaimsIdentity identity = HttpContext.User.Identity as ClaimsIdentity;
            ObjReturnToken role = GenToken.GetCurrentUser(identity).Value as ObjReturnToken;
            if (role.Role != RoleUser.ADMIN)
            {
                return Unauthorized(new CustomError { Code = 403, Detail = "Permission denied!" });
            }

            var employee = await _context.Employees.FindAsync(id);
            if (employee == null)
            {
                return NotFound(new CustomError { Detail = "Employee not found!" });
            }
            employee.IsDeleted = 1;
            _context.Employees.Update(employee);

            await _context.SaveChangesAsync();

            return Ok();
        }

        private ObjReturnToken GetRoleCurrentUser()
        {
            // check permission
            ClaimsIdentity identity = HttpContext.User.Identity as ClaimsIdentity;
            ObjReturnToken user = GenToken.GetCurrentUser(identity).Value as ObjReturnToken;

            return user;
        }
    }
}
