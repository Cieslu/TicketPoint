using ReportingApplication.Models;
using ReportingApplication.ModelsDTO.Administrator;

namespace ReportingApplication.Interfaces.Services
{
    public interface IUserManagementService
    {
        public Task<UserDTO?> addUser(NewUserDTO newUserDTO);
        public Task<bool> editUser(EditUserDTO userDTO);
        public Task<List<UserDTO>> showUsers();
        public Task<bool> deleteUser(string userId);
        public Task<bool> lockOrUnlockUser(string userId);
        public Task<bool> editPassword(ChangePasswordDTO changePasswordDTO);
    }
}
