using System.Linq.Expressions;

namespace Core.Specifications
{
    public class BaseSpecification<T> : ISpecification<T>
    {
        public BaseSpecification()  // when there's no where condition; only include
        {
        }

        public BaseSpecification(Expression<Func<T, bool>> criteria)
        {
            Criteria=criteria;
        }

        public Expression<Func<T, bool>> Criteria {get;} 

        public List<Expression<Func<T, object>>> Includes {get;} = new List<Expression<Func<T, object>>>();

        public Expression<Func<T, object>> OrderBy {get; private set;}

        public Expression<Func<T, object>> OrderByDescending {get; private set;}

        public int Take {get; private set;}

        public int Skip {get; private set;}

        public bool IsPagingEnabled {get; private set;}

        protected void AddIncludes(Expression<Func<T,object>> include){
            Includes.Add(include);
        }

        protected void AddOrderBy(Expression<Func<T,object>> orderByExpression){
            OrderBy=orderByExpression;
        }

        protected void AddOrderByDescending(Expression<Func<T,object>> orderByDExpression){
            OrderByDescending=orderByDExpression;
        }

        protected void AddPaging(int take,int skip){
            Take = take;
            Skip = skip;
            IsPagingEnabled = true;
        }

    }
}