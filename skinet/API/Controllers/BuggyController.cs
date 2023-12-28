using API.Errors;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class BuggyController : BaseApiController
    {
        private readonly StoreContext _context;

        public BuggyController(StoreContext context)
        {
            _context = context;
        }

        [HttpGet("notfound")]
        public ActionResult GetNotFoundRequest()
        {
            var res = _context.Products.Find(22);
            if(res==null){
                return NotFound(new ApiResponse(404));
            }
            return Ok();
        }

        [HttpGet("servererror")]
        public ActionResult Getservererror()
        {
            var res = _context.Products.Find(22);
            var val = res.ToString();   //will give null ref error
            return Ok();
        }

        [HttpGet("badrequest")]
        public ActionResult Getbadrequest()
        {
            return BadRequest(new ApiResponse(400));
        }

        [HttpGet("badrequest/{id}")]
        public ActionResult Getbadrequest(int id)   //pass string in api param
        {
            return BadRequest();
           // return Ok();  
           //fine even if we return 200 bcoz code doesn't reach here; 
           //response is returned from Program.cs as modified BadRequest as below
           //return new BadRequestObjectResult(errorResponse);
        }
    }
}