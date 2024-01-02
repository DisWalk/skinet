using Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace Core.Specifications
{
    public class SpecificationEvaluator<TEntity> where TEntity: BaseEntity
    {
        //creating final query with where and include to send in DB
        public static IQueryable<TEntity> GetQuery(IQueryable<TEntity> inputQuery, ISpecification<TEntity> spec){
            var query = inputQuery; 

            if(spec.Criteria!=null){
                query = query.Where(spec.Criteria);
            }

            if(spec.OrderBy!=null){
                query = query.OrderBy(spec.OrderBy);
            }

             if(spec.OrderByDescending!=null){
                query = query.OrderByDescending(spec.OrderByDescending);
            }

            if(spec.IsPagingEnabled){   //paging after getting required result
                query = query.Skip(spec.Skip).Take(spec.Take);
            }

            query= spec.Includes.Aggregate(
                query, (latestquery,includethis) => latestquery.Include(includethis)
            );

            return query;
        }
        
    }
}