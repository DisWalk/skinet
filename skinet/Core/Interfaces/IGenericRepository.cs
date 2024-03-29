using Core.Entities;
using Core.Specifications;

namespace Core.Interfaces
{
    public interface IGenericRepository<T> where T: BaseEntity
    {
        Task<T> GetByIdAsync(int id);
        Task<IReadOnlyList<T>> GetAllAsync(); 

        Task<T> GetEntityWithSpec(ISpecification<T> spec);
        //passing specific query

        Task<IReadOnlyList<T>> GetAsync(ISpecification<T> spec);
        //passing query to get list from ToListAsync() function

        Task<int> CountAsync(ISpecification<T> spec);

        //these are not performing db operations
        //just manipulating entity data in memory
        //hence no need of async
        void Add(T entity);
        void Update(T entity);
        void Delete(T entity);
    }
}