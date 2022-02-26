using System.ComponentModel.DataAnnotations;

namespace BaseProject.MyModels
{
    public class UpdateStatus
    {
        [Required]
        public int Status { get; set; }
    }
}
