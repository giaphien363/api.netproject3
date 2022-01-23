using System.ComponentModel.DataAnnotations;

namespace BaseProject.MyModels
{
    public class UserDto
    {
        [Required]
        public string UserName{ get; set; }
        [Required]
        public string Password{ get; set; }
    }
}
