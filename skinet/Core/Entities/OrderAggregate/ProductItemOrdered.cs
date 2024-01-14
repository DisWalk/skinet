using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Core.Entities.OrderAggregate
{
    //no id as it is owned by Order
    public class ProductItemOrdered
    {
        //needed for EF migration
        public ProductItemOrdered()
        {
        }

        public ProductItemOrdered(int productId,string productName,string pictureUrl)
        {
            ProductId = productId;
            ProductName = productName;
            PictureUrl = pictureUrl;
        }

        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public string PictureUrl { get; set; }
    }
}