using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ReportingApplication.Interfaces.Controllers;
using ReportingApplication.Interfaces.Services;

namespace ReportingApplication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoleController : ControllerBase, IRoleController
    {
        private readonly IRoleService _roleService;

        public RoleController(IRoleService roleService)
        {
            this._roleService = roleService;
        }

        [HttpGet("role/{id}")]
        public async Task<ActionResult> Role(string id)
        {
            List<string>? roles = await _roleService.checkRole(id);
            return Ok(roles);
        }
    }
}
