using ReportingApplication.ModelsDTO.Login;
using ReportingApplication.ModelsDTO.Token;

namespace ReportingApplication.Interfaces.Services
{
    public interface ILoginService
    {
        public Task<TokenDTO?> Login(LoginRequestDTO loginRequestDTO);
    }
}
