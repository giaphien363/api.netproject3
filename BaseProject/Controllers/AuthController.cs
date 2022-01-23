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

        // demo authorized (get role, check permission)
        [HttpGet]
        [Authorize]
        public async Task<ActionResult> GetUserLogin()
        {
            ClaimsIdentity identity = HttpContext.User.Identity as ClaimsIdentity;
            ObjReturnToken role = GenToken.GetCurrentUser(identity).Value as ObjReturnToken;

            if (role.Role == RoleUser.ADMIN)
            {
                var user = _db.UserAdmins.FirstOrDefault(obj => obj.Username == role.Username);
                if (user != null)
                    return Ok(user);
            }
            else if (role.Role == RoleUser.EMPLOYEE)
            {
                var user = _db.Employees.FirstOrDefault(obj => obj.Username == role.Username);
                if (user != null)
                    return Ok(user);
            }

            return BadRequest(new CustomError { Detail = "User not found" });
        }


        [HttpPost("admin/register")]
        public async Task<ActionResult<UserAdmin>> Register(UserDto adminDto)
        {
            UserAdmin newAdmin = new UserAdmin();

            newAdmin.Username = adminDto.UserName;
            newAdmin.Password = EncryptPassword.Encrypt(adminDto.Password);

            _db.UserAdmins.Add(newAdmin);
            if (_db.SaveChanges() > 0)
            {
                MyResponse token = new MyResponse();
                token.Access = GenToken.GenerateToken(_jwtConfig, newAdmin.Username, RoleUser.ADMIN);

                return Ok(token);
            }
            return BadRequest(new CustomError() { Detail = "Something went wrong!" });
        }

        [HttpPost("admin/login")]
        public async Task<ActionResult<UserAdmin>> Login(UserDto adminDto)
        {
            var admin = _db.UserAdmins.FirstOrDefault(x => x.Username == adminDto.UserName);

            if (admin == null)
                return BadRequest(new CustomError() { Detail = "User not found!" });

            if (!EncryptPassword.VerifyPassword(admin.Password, adminDto.Password))
                return BadRequest(new CustomError() { Detail = "Incorrect Password!" });

            // gen token
            MyResponse token = new MyResponse();
            token.Access = GenToken.GenerateToken(_jwtConfig, admin.Username, RoleUser.ADMIN);
            return Ok(token);
        }

        [HttpPost("employee/login")]
        public async Task<ActionResult<Employee>> LoginEmployee(UserDto emDto)
        {
            var employee = _db.Employees.FirstOrDefault(x => x.Username == emDto.UserName && x.IsDeleted == 0);

            if (employee == null)
                return BadRequest(new CustomError() { Detail = "User not found!" });

            if (!EncryptPassword.VerifyPassword(employee.Password, emDto.Password))
                return BadRequest(new CustomError() { Detail = "Incorrect Password!" });

            // gen token
            MyResponse token = new MyResponse();
            token.Access = GenToken.GenerateToken(_jwtConfig, employee.Username, RoleUser.EMPLOYEE);
            //return new JsonResult(token);
            return Ok(token);
        }

        [HttpPost("insurance/login")]
        public async Task<ActionResult<Employee>> InsuranceEmployee(UserDto emDto)
        {
            var employee = _db.InsuranceAdmins.FirstOrDefault(x => x.Username == emDto.UserName && x.IsDeleted == 0);

            if (employee == null)
                return BadRequest(new CustomError() { Detail = "User not found!" });

            if (!EncryptPassword.VerifyPassword(employee.Password, emDto.Password))
                return BadRequest(new CustomError() { Detail = "Incorrect Password!" });

            // check role insurance admin to gen token
            MyResponse token = new MyResponse();
            if (employee.Role.ToUpper() == RoleUser.IMANAGER)
            {
                token.Access = GenToken.GenerateToken(_jwtConfig, employee.Username, RoleUser.IMANAGER);
                return Ok(token);
            }
            token.Access = GenToken.GenerateToken(_jwtConfig, employee.Username, RoleUser.IFINMAN);
            return Ok(token);
        }

    }

    public static class RoleUser
    {
        static public string ADMIN = "AMDIN";
        static public string EMPLOYEE = "EMPLOYEE";
        static public string IMANAGER = "IMANAGER";
        static public string IFINMAN = "IFINMAN";
    }
    public class MyResponse
    {
        public string Access { get; set; }
    }
}
