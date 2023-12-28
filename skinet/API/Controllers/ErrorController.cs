using API.Errors;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("errors/{code}")]
    [ApiExplorerSettings(IgnoreApi =true)]
    //to resolve errors when we hit
    //https://localhost:5001/swagger/index.html
    //https://localhost:5001/swagger/v1/swagger.json
//     "statusCode": 500,
// "message": "Ambiguous HTTP method for action - API.Controllers.ErrorController.Error (API). Actions require an explicit HttpMethod binding for Swagger/OpenAPI 3.0"
    public class ErrorController: BaseApiController
    {
        public IActionResult Error(int code){
            return new ObjectResult(new ApiResponse(code));
        }
    }
}