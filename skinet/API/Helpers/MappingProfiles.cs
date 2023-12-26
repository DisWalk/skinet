using API.DTO;
using AutoMapper;
using Core.Entities;

namespace API.Helpers
{
    public class MappingProfiles: Profile
    {
        public MappingProfiles()
        {
            CreateMap<Product,ProductToReturnDTO>()
            .ForMember(p => p.ProductBrand, o => o.MapFrom(b => b.ProductBrand.Name))
            .ForMember(p => p.ProductType, o => o.MapFrom(b => b.ProductType.Name))
            .ForMember(p => p.PictureUrl, o => o.MapFrom<ProductUrlResolver>());
        }

    }
}