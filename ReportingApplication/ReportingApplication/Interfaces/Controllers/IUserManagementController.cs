using Microsoft.AspNetCore.Mvc;
using ReportingApplication.ModelsDTO.Administrator;

namespace ReportingApplication.Interfaces.Controllers
{
    public interface IUserManagementController
    {
        public Task<ActionResult> addUser(NewUserDTO newUserDTO);
        public Task<ActionResult> editUser(EditUserDTO userDTO);
        public Task<ActionResult<List<UserDTO>>> showUsers();
        public Task<ActionResult> deleteUser(string userId);
        public Task<ActionResult> lockOrUnlockUser(string userId);
        public Task<ActionResult> editPassword(ChangePasswordDTO changePasswordDTO);
    }
}
