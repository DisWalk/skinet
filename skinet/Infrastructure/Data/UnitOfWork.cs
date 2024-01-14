using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Core.Interfaces;

namespace Infrastructure.Data
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly StoreContext _context;

        private Hashtable _repositories;
        //all repos will be stored in this hashtable
        public UnitOfWork(StoreContext context)
        {
            _context = context;
        }

        public async Task<int> Complete()
        {
            return await _context.SaveChangesAsync();
            //Changes within a Transaction: SaveChangesAsync operates within a transaction by default. This means that all the changes made by the DbContext instance (such as inserts, updates, or deletes) are considered a single unit of work. If any part of this unit of work fails (e.g., due to an exception), the entire transaction is rolled back.
        }

        public void Dispose()
        {
            _context.Dispose();
            //dispose db context
        }

        public IGenericRepository<TEntity> Repository<TEntity>() where TEntity : BaseEntity
        {
            if (_repositories == null) _repositories = new Hashtable();

            var type = typeof(TEntity).Name;    
            //get name of entity ex. Product

            //if hashtable doesnt have repo of the entity
            if(!_repositories.ContainsKey(type)){
                var repoType = typeof(GenericRepository<>);
                var repoInstance = Activator.CreateInstance(repoType.MakeGenericType(typeof(TEntity)), _context);
                //we are creating the repo instance and passing db context from unit of work as parameter
                //so all repo instances will have this shared db context
                _repositories.Add(type, repoInstance);
                //Product, GenericRepository<Product>

            }
            return (IGenericRepository<TEntity>) _repositories[type];
            //typecast - IGenericRepository<Product>
        }
    }
}