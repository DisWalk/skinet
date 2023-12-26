using System.Linq.Expressions;

namespace Core.Specifications
{
    public interface ISpecification<T>
    {
        Expression<Func<T,bool>> Criteria {get;}    //where condition
        List<Expression<Func<T,object>>> Includes {get;}    //include for navigation
    }
}