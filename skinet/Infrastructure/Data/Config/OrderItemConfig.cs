using Core.Entities.OrderAggregate;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Config
{
    public class OrderItemConfig : IEntityTypeConfiguration<OrderItem>
    {
        public void Configure(EntityTypeBuilder<OrderItem> builder)
        {
            //this means OrderItem owns one ProductItemOrdered 
            builder.OwnsOne(o => o.ItemOrdered, p =>
            {
                p.WithOwner();
            });

            builder.Property(i => i.Price)
                .HasColumnType("decimal(18,2)");
        }
    }
}