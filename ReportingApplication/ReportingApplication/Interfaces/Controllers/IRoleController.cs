using Microsoft.AspNetCore.Mvc;

namespace ReportingApplication.Interfaces.Controllers
{
    public interface IRoleController
    {
        public Task<ActionResult> Role(string id); 
    }
}
