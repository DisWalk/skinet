using System.Security.Claims;
using Core.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions
{
    public static class UserManagerExtensions
    {
        //passing param as this means we are adding a new method to the UserManager class
        public static async Task<AppUser> FindUserByClaimsPrincipleWithAddress(this UserManager<AppUser> userManager,ClaimsPrincipal user){
            //ClaimsPrincipal user -> getting user from token in http request
            // aka HttpContext.User?.Claims?
            var email = user.FindFirstValue(ClaimTypes.Email);
            return await userManager.Users.Include(x => x.Address).SingleOrDefaultAsync(x => x.Email == email);
            //Include(x => x.Address)
            //eager loading Address with User

            //return user.Address;
            //Address would be null bcoz FindByEmailAsync will return User only ; not any related entites like Address
            //so we need to eagerly load the Address
        }

        public static async Task<AppUser> FindByEmailFromClaimsPrinciple(this UserManager<AppUser> userManager,ClaimsPrincipal user){
        return await userManager.Users
        .SingleOrDefaultAsync(x => x.Email == user.FindFirstValue(ClaimTypes.Email));
        }
    }
}