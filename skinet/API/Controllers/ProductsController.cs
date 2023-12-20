using Core.Entities;
using Core.Interfaces;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        public IProductRepository _repo { get; }
        public ProductsController(IProductRepository repo)
        {
            _repo = repo;
        }

        [HttpGet] 
        public  async Task<ActionResult<IReadOnlyList<Product>>> GetAllProducts(){
            return Ok(await _repo.GetAllProducts()); 
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id){
            return Ok(await _repo.GetProduct(id));    
        }

        
        [HttpGet("brands")] 
        public  async Task<ActionResult<IReadOnlyList<Product>>> GetAllBands(){
            return Ok(await _repo.GetAllBands()); 
        }

        [HttpGet("types")] 
        public  async Task<ActionResult<IReadOnlyList<Product>>> GetAllTypes(){
            return Ok(await _repo.GetAllTypes()); 
        }

    }
}