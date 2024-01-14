using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;

namespace Core.Interfaces
{
    public interface IUnitOfWork: IDisposable
    {
        //Dipose = when we finish our transaction, it will dispose our context 

        IGenericRepository<TEntity> Repository<TEntity>() where TEntity : BaseEntity;

        Task<int> Complete();
        //returns number of changes to db
        //EF will track all the changes to the entities
        //we'll pass it to Complete which will save all changes in db and return number of changes
    }
}