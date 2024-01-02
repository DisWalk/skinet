using System.Linq.Expressions;

namespace Core.Specifications
{
    public interface ISpecification<T>
    {
        Expression<Func<T,bool>> Criteria {get;}    //where condition
        List<Expression<Func<T,object>>> Includes {get;}    //include for navigation

        Expression<Func<T,object>> OrderBy {get;}    

        Expression<Func<T,object>> OrderByDescending {get;}    

        int Take { get; }
        int Skip{ get; }

        bool IsPagingEnabled{ get; }

    }
}