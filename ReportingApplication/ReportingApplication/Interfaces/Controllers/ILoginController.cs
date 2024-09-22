using Microsoft.AspNetCore.Mvc;
using ReportingApplication.ModelsDTO.Login;
using ReportingApplication.ModelsDTO.Token;

namespace ReportingApplication.Interfaces.Controllers
{
    public interface ILoginController
    {
        public Task<ActionResult> Login(LoginRequestDTO loginRequestDTO);
    }
}
