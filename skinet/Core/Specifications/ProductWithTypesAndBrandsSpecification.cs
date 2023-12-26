using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Core.Entities;

namespace Core.Specifications
{
    public class ProductWithTypesAndBrandsSpecification : BaseSpecification<Product>
    {
        public ProductWithTypesAndBrandsSpecification()
        {
            AddIncludes(p => p.ProductType);
            AddIncludes(p => p.ProductBrand);

            // Includes.Add(p => p.ProductType);
            // Includes.Add(p => p.ProductBrand);
        }

        public ProductWithTypesAndBrandsSpecification(int id) : base(p => p.Id==id)
        {
            AddIncludes(p => p.ProductType);
            AddIncludes(p => p.ProductBrand);
        }
    }
}