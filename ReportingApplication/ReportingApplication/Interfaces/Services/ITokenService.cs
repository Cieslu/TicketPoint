using System.Security.Claims;

namespace ReportingApplication.Interfaces.Services
{
    public interface ITokenService
    {
        public Task<string> GenerateAccessToken(string userId);
       // public Task<string> GenerateRefreshToken(string userId);
        public string CreateToken(DateTimeOffset expiryDate, IEnumerable<Claim> claims);
    }
}
