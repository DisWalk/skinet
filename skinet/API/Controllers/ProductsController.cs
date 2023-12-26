using API.DTO;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly IGenericRepository<Product> _prod;
        private readonly IGenericRepository<ProductBrand> _brand;
        private readonly IGenericRepository<ProductType> _type;
        private readonly IMapper _mapper;
        public ProductsController(IGenericRepository<Product> prod,IGenericRepository<ProductBrand> brand,IGenericRepository<ProductType> type,IMapper mapper)
        {
            _mapper = mapper;
            _type = type;
            _brand = brand;
            _prod = prod;
        }

        [HttpGet] 
        // public async Task<ActionResult<IReadOnlyList<Product>>> GetAllProducts(){
        //     // return Ok(await _prod.GetAllAsync()); 
        //     // BaseSpecification<Product> p = new BaseSpecification<Product>(null);
        //     // p.Includes.Add(p => p.ProductBrand);
        //     // p.Includes.Add(p => p.ProductType);
        //     // return Ok(await  _prod.GetAsync(p)); 

        //     var p = new ProductWithTypesAndBrandsSpecification();
        //     return Ok(await _prod.GetAsync(p)); //taking specification as parameter  
        // }

        public async Task<ActionResult<IReadOnlyList<ProductToReturnDTO>>> GetAllProducts(){
            // return Ok(await _prod.GetAllAsync()); 
            // BaseSpecification<Product> p = new BaseSpecification<Product>(null);
            // p.Includes.Add(p => p.ProductBrand);
            // p.Includes.Add(p => p.ProductType);
            // return Ok(await  _prod.GetAsync(p)); 

            var p = new ProductWithTypesAndBrandsSpecification();
            var res = await _prod.GetAsync(p);
            // return res.Select(result => new ProductToReturnDTO{
            //         Id=result.Id,
            //         Name=result.Name,
            //         Description=result.Description,
            //         Price=result.Price,
            //         PictureUrl=result.PictureUrl,
            //         ProductType=result.ProductType.Name,
            //         ProductBrand=result.ProductBrand.Name
            // }).ToList();//taking specification as parameter  

            //return Ok(res.Select(result => _mapper.Map<Product,ProductToReturnDTO>(result)).ToList());
            return Ok(_mapper.Map<IReadOnlyList<Product>,IReadOnlyList<ProductToReturnDTO>>(res));
        }

        [HttpGet("{id}")]
        // public async Task<ActionResult<Product>> GetProduct(int id){
        //     // return Ok(await _prod.GetByIdAsync(id));    
        //     var p = new ProductWithTypesAndBrandsSpecification(id); //this will contain where condition in criteria and list of all includes
        //     return Ok(await _prod.GetEntityWithSpec(p));
        // }

        public async Task<ActionResult<ProductToReturnDTO>> GetProduct(int id){
            // return Ok(await _prod.GetByIdAsync(id));    
            var p = new ProductWithTypesAndBrandsSpecification(id); //this will contain where condition in criteria and list of all includes
            var result = await _prod.GetEntityWithSpec(p);
            // return new ProductToReturnDTO{  //returning flattened object
            //         Id=result.Id,
            //         Name=result.Name,
            //         Description=result.Description,
            //         Price=result.Price,
            //         PictureUrl=result.PictureUrl,
            //         ProductType=result.ProductType.Name,
            //         ProductBrand=result.ProductBrand.Name,
            // };
            return _mapper.Map<Product,ProductToReturnDTO>(result);        
        }
        
        [HttpGet("brands")] 
        public  async Task<ActionResult<IReadOnlyList<Product>>> GetAllBands(){
            return Ok(await _brand.GetAllAsync()); 
        }

        [HttpGet("types")] 
        public  async Task<ActionResult<IReadOnlyList<Product>>> GetAllTypes(){
            return Ok(await _type.GetAllAsync()); 
        }

    }
}