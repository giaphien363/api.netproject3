using BaseProject.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;

namespace BaseProject.Common
{
    public static class GenToken
    {
        public static string GenerateToken(JwtConfig jwtConfig, string userName, string role, int id)
        {

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtConfig.Key));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.Name, userName),
                new Claim(ClaimTypes.Role, role),
                new Claim(ClaimTypes.NameIdentifier, id.ToString()),
            };

            var token = new JwtSecurityToken(jwtConfig.Issuer,
              jwtConfig.Audience,
              claims,
              expires: DateTime.Now.AddDays(1),
              signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public static JsonResult GetCurrentUser(ClaimsIdentity identity)
        {
            /*
             **: Demo param, because this func in class static, so i do stupid thing 

             ClaimsIdentity identity = HttpContext.User.Identity as ClaimsIdentity;
             */

            if (identity != null)
            {
                var userClaims = identity.Claims;

                return new JsonResult(new ObjReturnToken
                {
                    Username = userClaims.FirstOrDefault(o => o.Type == ClaimTypes.Name)?.Value,
                    Role = userClaims.FirstOrDefault(o => o.Type == ClaimTypes.Role)?.Value,
                    Id = Int32.Parse(userClaims.FirstOrDefault(o => o.Type == ClaimTypes.NameIdentifier)?.Value)
                });
            }
            return null;
        }
    }

    public class ObjReturnToken
    {
        public string Username { get; set; }
        public string Role { get; set; }
        public int Id{ get; set; }

    }
}
