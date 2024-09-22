using AutoMapper;
using Microsoft.AspNetCore.Identity;
using ReportingApplication.Data;
using ReportingApplication.Interfaces.Services;
using ReportingApplication.Models;

namespace ReportingApplication.Services
{
    public class RoleService : IRoleService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly UserManager<User> _userManager;

        public RoleService(ApplicationDbContext context, IMapper mapper, UserManager<User> userManager)
        {
            this._context = context;
            this._mapper = mapper;
            this._userManager = userManager;
        }

        public async Task<List<string>?> checkRole(string id)
        {
            if (id == null)
            {
                return null;
            }

            User? user = await _userManager.FindByIdAsync(id);

            if (user == null) 
            {
                return null;   
            }

            IList<string> roles = await _userManager.GetRolesAsync(user);

            return roles.ToList();
        }
    }
}
