using Core.Entities.OrderAggregate;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Config
{
    public class OrderConfig : IEntityTypeConfiguration<Order>
    {
        public void Configure(EntityTypeBuilder<Order> builder)
        {
            //as Adress is an owned property
            builder.OwnsOne(o => o.ShipToAddress, a =>
            {
                a.WithOwner();
            });
            builder.Navigation(a => a.ShipToAddress).IsRequired();
            builder.Property(s => s.OrderStatus)
            .HasConversion(
                o => o.ToString(),  //enum to string
                o => (OrderStatus)Enum.Parse(typeof(OrderStatus), o)
            );
            builder.HasMany(o => o.OrderItems).WithOne().OnDelete(DeleteBehavior.Cascade);
            //when order is deleted, its order items will also be deleted
        }
    }
}