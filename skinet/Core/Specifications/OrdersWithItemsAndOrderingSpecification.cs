using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Core.Entities.OrderAggregate;

namespace Core.Specifications
{
    public class OrdersWithItemsAndOrderingSpecification : BaseSpecification<Order>
    {
        //getting list of orders for a User
        public OrdersWithItemsAndOrderingSpecification(string email): base(o => o.BuyerEmail == email)
        {
            AddIncludes(o => o.OrderItems);
            AddIncludes(o => o.DeliveryMethod);
            AddOrderByDescending(o => o.OrderDate);
        }

        //getting a particular order
        public OrdersWithItemsAndOrderingSpecification(int id,string email) : base(o => o.Id==id && o.BuyerEmail == email)
        {
            AddIncludes(o => o.OrderItems);
            AddIncludes(o => o.DeliveryMethod);
        }
    }
}