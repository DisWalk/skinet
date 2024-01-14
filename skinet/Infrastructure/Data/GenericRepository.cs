using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure
{
    public class GenericRepository<T> : IGenericRepository<T> where T: BaseEntity
    {
        private readonly StoreContext _context;
        public GenericRepository(StoreContext context)  //this context will be the Shared context from UnitOfWork
        {
            _context = context;
        }

        public async Task<IReadOnlyList<T>> GetAllAsync()
        {
            return await _context.Set<T>().ToListAsync();
        }
        
        public async Task<T> GetByIdAsync(int id)
        {
            return await _context.Set<T>().FindAsync(id);
        }

        public async Task<IReadOnlyList<T>> GetAsync(ISpecification<T> spec)
        {
            return await GenerateQuery(spec).ToListAsync();
        }

        public async Task<T> GetEntityWithSpec(ISpecification<T> spec)
        {
           return await GenerateQuery(spec).FirstOrDefaultAsync();
        }

        public async Task<int> CountAsync(ISpecification<T> spec)
        {
            return await GenerateQuery(spec).CountAsync();
        }

        private IQueryable<T> GenerateQuery(ISpecification<T> spec){
            
            return SpecificationEvaluator<T>.GetQuery(_context.Set<T>().AsQueryable(),spec);
        }

        public void Add(T entity)
        {
            _context.Set<T>().Add(entity);
        }

        public void Update(T entity)
        {
            _context.Set<T>().Attach(entity);
            _context.Entry(entity).State = EntityState.Modified;
            //bcoz it is being tracked and will be added to the list of changes to be done in db at SaveChanges func
        }

        public void Delete(T entity)
        {
            _context.Set<T>().Remove(entity);
        }
    }
}