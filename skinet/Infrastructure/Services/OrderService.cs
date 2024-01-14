using Core.Entities;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Core.Specifications;

namespace Infrastructure.Services
{
    public class OrderService : IOrderService
    {
        private readonly IBasketRepository _basketRepo;
        private readonly IUnitOfWork _unitOfWork;

        public OrderService(IBasketRepository basketRepo,IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
            _basketRepo = basketRepo;
        }

        public async Task<Order> CreateOrderAsync(string buyerEmail, int deliveryMethodId, string basketId, Address shippingAddress)
        {
            //get basket from repo
            var basket = await _basketRepo.GetBasketAsync(basketId);

            //we dont trust the basket items
            //we will verify the prices from backend
            //as client could send lower prices
            //we cant create order from .client basket without verifying
            //get items from product repo
            var items = new List<OrderItem>();
            foreach (var item in basket.Items)
            {
                //get details of item in basket from db
                var productItem = await _unitOfWork.Repository<Product>().GetByIdAsync(item.Id);
                //this is a snapshot of product details
                var itemOrdered = new ProductItemOrdered(productItem.Id, productItem.Name, productItem.PictureUrl);
                //for our order - we pass item details from db, price also from db. we are not taking price from basket as we can't trust client
                //only quantity and product id we take from client as we can trust them from those
                var orderItem = new OrderItem(itemOrdered, productItem.Price, item.Quantity);
                items.Add(orderItem);
            }

            //get delivery method from repo as client will send Id only
            var deliveryMethod = await _unitOfWork.Repository<DeliveryMethod>().GetByIdAsync(deliveryMethodId);

            //calc subtotal
            var subtotal = items.Sum(item => item.Price * item.Quantity);

            //create order
            var order = new Order(items, buyerEmail, shippingAddress, deliveryMethod, subtotal);
            _unitOfWork.Repository<Order>().Add(order);

            //save it to db
            var result = await _unitOfWork.Complete();
            //if this fails, 

            if(result<=0){  //i.e. number of changes 0 i.e. nothing saved to db
                return null;
            }
            //result - 2 ; order and order item

            //if order saved, delete basket
            //like cart is empty after we place order in amazon
            await _basketRepo.DeleteBasketAsync(basketId);

            //return order to client
            return order;
        }

        public async Task<IReadOnlyList<DeliveryMethod>> GetDeliveryMethodsAsync()
        {
            return await _unitOfWork.Repository<DeliveryMethod>().GetAllAsync();
        }

        public async Task<Order> GetOrderByIdAsync(int id, string buyerEmail)
        {
            var spec = new OrdersWithItemsAndOrderingSpecification(id, buyerEmail);
            return await _unitOfWork.Repository<Order>().GetEntityWithSpec(spec);
        }

        public async Task<IReadOnlyList<Order>> GetOrdersForUserAsync(string buyerEmail)
        {
            var spec = new OrdersWithItemsAndOrderingSpecification(buyerEmail);
            return await _unitOfWork.Repository<Order>().GetAsync(spec);
        }
    }
}