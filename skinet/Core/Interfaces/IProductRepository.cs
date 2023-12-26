using Core.Entities;

namespace Core.Interfaces
{
    public interface IProductRepository
    {
        Task<IReadOnlyList<Product>> GetAllProducts();
        Task<Product> GetProduct(int id);

        Task<IReadOnlyList<ProductBrand>> GetAllBands();

        Task<IReadOnlyList<ProductType>> GetAllTypes();
         
        
    }
}