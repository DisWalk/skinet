using API.DTO;
using API.Errors;
using API.Helpers;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ProductsController : BaseApiController
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
        public async Task<ActionResult<Pagination<ProductToReturnDTO>>> GetAllProducts([FromQuery]ProductSpecParams productParams){
            var spec = new ProductWithTypesAndBrandsSpecification(productParams);

            var countSpec = new ProductWithFiltersForCountSpecification(productParams);

            var totalItems = await _prod.CountAsync(countSpec);

            var products = await _prod.GetAsync(spec);

            var data = _mapper.Map<IReadOnlyList<Product>, IReadOnlyList<ProductToReturnDTO>>(products);

            return Ok(new Pagination<ProductToReturnDTO>(productParams.PageIndex,productParams.PageSize,totalItems,data));
        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse),StatusCodes.Status404NotFound)] //for swagger
        
        public async Task<ActionResult<ProductToReturnDTO>> GetProduct(int id){
            var p = new ProductWithTypesAndBrandsSpecification(id); 
            var result = await _prod.GetEntityWithSpec(p);

            if(result==null) return NotFound(new ApiResponse(404));
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