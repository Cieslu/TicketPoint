using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using ReportingApplication.Data;
using ReportingApplication.Interfaces.Services;
using ReportingApplication.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace MediBookerAPI.Services
{
    public class TokenService : ITokenService
    {
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _context;
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public TokenService(IConfiguration configuration, ApplicationDbContext context, UserManager<User> userManager, RoleManager<IdentityRole> roleManager)
        {
            _configuration = configuration;
            _context = context;
            _userManager = userManager;
            _roleManager = roleManager;
        }

        public async Task<string> GenerateAccessToken(string userId)
        {
            DateTimeOffset expiry = DateTimeOffset.Now.AddMinutes(30);
            IEnumerable<Claim> userClaims = await GetClaimsForUser(userId);
            return CreateToken(expiry, userClaims);
        }

     /*   public async Task<string> GenerateRefreshToken(string userId)
        {
            var expiry = DateTimeOffset.Now.AddDays(30);
            IEnumerable<Claim> userClaims = await GetClaimsForUser(userId);
            return CreateToken(expiry, userClaims);
        }*/

        public string CreateToken(DateTimeOffset expiryDate, IEnumerable<Claim> claims)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["TokenSettings:TokenKey"]!));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var securityToken = new JwtSecurityToken(
                claims: claims,
                notBefore: DateTime.Now,
                expires: expiryDate.DateTime,
                audience: _configuration["TokenSettings:Audience"],
                issuer: _configuration["TokenSettings:Issuer"],
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(securityToken);
        }

        private async Task<IEnumerable<Claim>> GetClaimsForUser(string userId)
        {
            User? user = _userManager.FindByIdAsync(userId).Result;
            if (user != null)
            {
                var claims = new List<Claim>();
                claims.Add(new Claim("name", user.FirstName));
                claims.Add(new Claim("id", userId.ToString()));

                ICollection<string> roles = await _userManager.GetRolesAsync(user);
                claims.Add(new Claim("role", roles.First()));
                return claims;
            }
            else
            {
                return null;
            }
        }
    }
}