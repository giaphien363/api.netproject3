using BaseProject.Common;
using Microsoft.AspNetCore.Mvc;

namespace BaseProject.Controllers
{
    [Route("api/TestApi")]
    [ApiController]
    public class TestApi : ControllerBase
    {
        // GET: api/ClaimEmployees
        [HttpGet]
        public ActionResult GetTest()
        {
            var status = (int)StatusClaimAction.CREATE;
            return Ok(status);
        }

    }
}
