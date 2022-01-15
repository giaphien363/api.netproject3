using BaseProject.ApiDbContext;
using BaseProject.Common;
using BaseProject.Models;
using BaseProject.MyModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace BaseProject.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApiNetContext _db;
        private readonly static JwtConfig _jwtConfig = new JwtConfig();

        public AuthController(IConfiguration config, ApiNetContext db)
        {
            _jwtConfig.Key = config["Jwt:Key"];
            _jwtConfig.Issuer = config["Jwt:Issuer"];
            _jwtConfig.Audience = config["Jwt:Audience"];

            _db = db;
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult> GetCurrentUser()
        {
            ClaimsIdentity identity = HttpContext.User.Identity as ClaimsIdentity;
            ObjReturnToken role = GenToken.GetCurrentUser(identity).Value as ObjReturnToken;

            if (role.Role == "admin")
            {
                var user = _db.UserAdmins.FirstOrDefault(obj=>obj.Username == role.Username);
                if (user != null)
                    return Ok(user);
            }
            else if (role.Role == "employee")
            {
                var user = _db.Employees.FirstOrDefault(obj => obj.Username == role.Username);
                if (user != null)
                    return Ok(user);
            }

            return BadRequest("User not found");
        }


        [HttpPost("admin/register")]
        public async Task<ActionResult<UserAdmin>> Register(AdminDto adminDto)
        {
            UserAdmin newAdmin = new UserAdmin();

            newAdmin.Username = adminDto.UserName;
            newAdmin.Password = EncryptPassword.Encrypt(adminDto.Password);

            _db.UserAdmins.Add(newAdmin);
            if (_db.SaveChanges() > 0)
            {
                var token = GenToken.GenerateToken(_jwtConfig, newAdmin.Username, "admin");

                return Ok(token);
            }
            return BadRequest("Something went wrong!");
        }

        [HttpPost("admin/login")]
        public async Task<ActionResult<UserAdmin>> Login(AdminDto adminDto)
        {
            var admin = _db.UserAdmins.FirstOrDefault(x => x.Username == adminDto.UserName);

            if (admin == null)
                return BadRequest("User not found!");

            if (!EncryptPassword.VerifyPassword(admin.Password, adminDto.Password))
                return BadRequest("Incorrect Password!");

            // get token
            var token = GenToken.GenerateToken(_jwtConfig, admin.Username, "admin");
            return Ok(token);
        }


        [HttpPost("admin/register/employee")]
        public async Task<ActionResult<Employee>> RegisterEmployee(EmployeeDto emDto)
        {
            Employee newEm = new Employee();

            newEm.Username = emDto.Username;
            newEm.Password = EncryptPassword.Encrypt(emDto.Password);
            newEm.Designation = emDto.Designation != null ? emDto.Designation : null;
            newEm.Salary = emDto.Salary != null ? emDto.Salary : null;

            newEm.Firstname = emDto.Firstname != null ? emDto.Firstname : null;
            newEm.Lastname = emDto.Lastname != null ? emDto.Lastname : null;
            newEm.Joindate = emDto.Joindate != null ? emDto.Joindate : null;

            newEm.Address = emDto.Address != null ? emDto.Address : null;
            newEm.Contact = emDto.Contact != null ? emDto.Contact : null;
            newEm.State = emDto.State != null ? emDto.State : null;

            newEm.City = emDto.City != null ? emDto.City : null;
            newEm.Country = emDto.Country != null ? emDto.Country : null;

            _db.Employees.Add(newEm);
            if (_db.SaveChanges() > 0)
            {
                return Ok();
            }
            return BadRequest("Something went wrong!");
        }


        [HttpPost("employee/login")]
        public async Task<ActionResult<Employee>> LoginEmployee(EmployeeLogin emDto)
        {
            var employee = _db.Employees.FirstOrDefault(x => x.Username == emDto.Username);

            if (employee == null)
                return BadRequest("User not found!");

            if (!EncryptPassword.VerifyPassword(employee.Password, emDto.Password))
                return BadRequest("Incorrect Password!");

            // get token
            var token = GenToken.GenerateToken(_jwtConfig, employee.Username, "employee");
            //return new JsonResult(token);
            return Ok(token);
        }

    }
}
