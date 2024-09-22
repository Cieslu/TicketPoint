using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ReportingApplication.Interfaces.Controllers;
using ReportingApplication.Interfaces.Services;
using ReportingApplication.Models;
using ReportingApplication.ModelsDTO.Administrator;

namespace ReportingApplication.Controllers
{
    [Route("api/administrator/[controller]")]
    [ApiController]
    [Authorize(Roles = "Administrator")]
    public class UserManagementController : ControllerBase, IUserManagementController
    {
        private readonly IUserManagementService _userManagementService;

        public UserManagementController(IUserManagementService userManagementService)
        {
            _userManagementService = userManagementService;
        }

        [HttpPost("addUser")]
        public async Task<ActionResult> addUser(NewUserDTO newUserDTO)
        {
            UserDTO? result = await _userManagementService.addUser(newUserDTO);

            if (result == null)
            {
                return BadRequest();
            }

            return Ok(result);
        }

        [HttpPut("editUser")]
        public async Task<ActionResult> editUser(EditUserDTO editUserDTO)
        {
            bool result = await _userManagementService.editUser(editUserDTO);

            if (result == false)
            {
                return BadRequest();
            }

            return Ok();
        }

        [HttpGet("showUsers")]
        public async Task<ActionResult<List<UserDTO>>> showUsers()
        {
            List<UserDTO> usersDTO = await _userManagementService.showUsers();

            return usersDTO;
        }

        [HttpDelete("deleteUser/{userId}")]
        public async Task<ActionResult> deleteUser(string userId)
        {
            bool result = await _userManagementService.deleteUser(userId);

            if (result == false)
            {
                return BadRequest();
            }

            return Ok();
        }

        [HttpGet("lockOrUnlockUser/{userId}")]
        public async Task<ActionResult> lockOrUnlockUser(string userId)
        {
            bool result = await _userManagementService.lockOrUnlockUser(userId);

            if (result == false)
            {
                return BadRequest();
            }

            return Ok();
        }

        [HttpGet("editPassword")]
        public async Task<ActionResult> editPassword(ChangePasswordDTO changePasswordDTO)
        {
            bool result = await _userManagementService.editPassword(changePasswordDTO);

            if (result == false)
            {
                return BadRequest();
            }

            return Ok();
        }
    }
}
