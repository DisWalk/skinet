using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Microsoft.EntityFrameworkCore;


namespace Core.Specifications
{
    public class SpecificationEvaluator<TEntity> where TEntity: BaseEntity
    {
        //creating final query with where an include to send in DB
        public static IQueryable<TEntity> GetQuery(IQueryable<TEntity> inputQuery, ISpecification<TEntity> spec){
            var query = inputQuery; //contains all data from Products table

            if(spec.Criteria!=null){
                query = query.Where(spec.Criteria);
            }   //ex. now query has product data for only id=5

            query= spec.Includes.Aggregate(
                query, (latestquery,includethis) => latestquery.Include(includethis)
            );

            return query;
        }
        
    }
}