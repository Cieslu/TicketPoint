using AutoMapper;
using MediBookerAPI.Services;
using Microsoft.AspNetCore.Identity;
using ReportingApplication.Data;
using ReportingApplication.Interfaces.Services;
using ReportingApplication.Models;
using ReportingApplication.ModelsDTO.Login;
using ReportingApplication.ModelsDTO.Token;

namespace ReportingApplication.Services
{
    public class LoginService : ILoginService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly UserManager<User> _userManager;
        private PasswordHasher<User> _hasher;
        private readonly ITokenService _tokenService;

        public LoginService(ApplicationDbContext context, IMapper mapper, UserManager<User> userManager, ITokenService tokenService)
        {
            this._context = context;
            this._mapper = mapper;
            this._userManager = userManager;
            this._hasher = new PasswordHasher<User>();
            this._tokenService = tokenService;
        }

        public async Task<TokenDTO?> Login(LoginRequestDTO loginRequestDTO)
        {
            if (loginRequestDTO.UserName == null || loginRequestDTO.Password == null)
            {
                return null;
            }

            User? user = await _userManager.FindByNameAsync(loginRequestDTO.UserName);

            if(user == null || user.Locked)
            {
                return null;
            }

            bool passwordCompare = await _userManager.CheckPasswordAsync(user, loginRequestDTO.Password);
            //PasswordVerificationResult passwordCompare = _userManager.PasswordHasher.VerifyHashedPassword(user, user.PasswordHash!, loginRequestDTO.Password);

            if (!passwordCompare)
            {
                return null;
            }

            TokenDTO accessToken = new TokenDTO
            {
                AccessToken = await _tokenService.GenerateAccessToken(user.Id)
            };

            //RefreshToken = await _tokenService.GenerateRefreshToken(user.Id);


            return accessToken; 
        }
    }
}
