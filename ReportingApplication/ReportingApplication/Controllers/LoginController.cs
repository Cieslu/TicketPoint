using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ReportingApplication.Interfaces.Controllers;
using ReportingApplication.Interfaces.Services;
using ReportingApplication.ModelsDTO.Login;
using ReportingApplication.ModelsDTO.Token;

namespace ReportingApplication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase, ILoginController
    {
        private readonly ILoginService _loginService;

        public LoginController(ILoginService loginService)
        {
            this._loginService = loginService;
        }

        [HttpPost("login")]
        public async Task<ActionResult> Login(LoginRequestDTO loginRequestDTO)
        {
            TokenDTO? token = await _loginService.Login(loginRequestDTO);

            if(token == null)
            {
                return BadRequest();
            }

            return Ok(token);
        }
    }
}
