using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ReportingApplication.Data;
using ReportingApplication.Interfaces.Services;
using ReportingApplication.Models;
using ReportingApplication.ModelsDTO.Administrator;

namespace ReportingApplication.Services
{
    public class UserManagementService : IUserManagementService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly UserManager<User> _userManager;

        public UserManagementService(ApplicationDbContext context, IMapper mapper, UserManager<User> userManager)
        {
            _context = context;
            _mapper = mapper;
            _userManager = userManager;
        }

        public async Task<UserDTO?> addUser(NewUserDTO newUserDTO)
        {
            try
            {
                if (newUserDTO == null)
                {
                    return null;
                }

                User newUser = _mapper.Map<User>(newUserDTO);
                string password = newUserDTO.Password!;

                IdentityResult resultCreate = await _userManager.CreateAsync(newUser, password);

                if (resultCreate.Errors.Count() != 0)
                {
                    return null;
                }

                IdentityResult result;

                if (newUserDTO.IsAdministrator == true)
                {
                    result = await _userManager.AddToRoleAsync(newUser, "Administrator");
                }
                else
                {
                    result = await _userManager.AddToRoleAsync(newUser, "Worker");
                }

                if (result.Errors.Count() != 0)
                {
                    return null;
                }

                User? addedUser = await _userManager.FindByNameAsync(newUser.UserName);

                if (addedUser == null)
                {
                    return null;
                }

                return _mapper.Map<UserDTO>(addedUser);
            }
            catch (Exception e)
            {
                throw new Exception($"Error from addUser in AdministratorService, message: {e}");
            }
        }

        public async Task<bool> editUser(EditUserDTO editUserDTO)
        {
            try
            {
                if (editUserDTO == null)//Sprawdzenie czy odebrany obiekt nie jest null
                {
                    return false;
                }

                User editUser = _mapper.Map<User>(editUserDTO);//Mapowanie DTO na editUser
                User? user = await _userManager.FindByIdAsync(editUserDTO.Id); ; //Wyszukanie użytkownika o podanym id

                if (user == null)//Sprawdzenie czy użytkownik jest w bazie danych
                {
                    return false;
                }

                user.FirstName = editUserDTO.FirstName;
                user.LastName = editUserDTO.LastName;
                user.UserName = editUserDTO.UserName;
                user.Email = editUserDTO.Email;
                user.Branch = editUserDTO.Branch;
                user.Signature = editUserDTO.Signature;
                user.IsAdministrator = editUserDTO.IsAdministrator;
                if (user.IsAdministrator)
                {
                    user.AdminColor = editUserDTO.AdminColor;

                   /* await _context.Recipents
                        .Where(x => x.UserId == user.Id)
                        .ExecuteUpdateAsync(y => y.SetProperty(x => x.RecipentColor, user.AdminColor));*/
                }

                IdentityResult resultCreate = await _userManager.UpdateAsync(user);

                IList<string> role = await _userManager.GetRolesAsync(user);

                if (role[0] == "Worker" && user.IsAdministrator)
                {
                    IdentityResult resultRemove = await _userManager.RemoveFromRoleAsync(user, "Worker");
                    IdentityResult resultAdd = await _userManager.AddToRoleAsync(user, "Administrator");

                    if (resultRemove.Errors.Count() != 0 || resultAdd.Errors.Count() != 0)
                    {
                        return false;
                    }
                }
                else if (role[0] == "Administrator" && !user.IsAdministrator)
                {
                    IdentityResult resultRemove = await _userManager.RemoveFromRoleAsync(user, "Administrator");
                    IdentityResult resultAdd = await _userManager.AddToRoleAsync(user, "Worker");

                    if (resultRemove.Errors.Count() != 0 || resultAdd.Errors.Count() != 0)
                    {
                        return false;
                    }
                }

                if (resultCreate.Errors.Count() != 0)
                {
                    return false;
                }

                return true;
            }
            catch (Exception e)
            {
                throw new Exception($"Error from editUser in AdministratorService, message: {e}");
            }
        }

        public async Task<List<UserDTO>> showUsers()
        {
            try
            {
                List<User> users = await _context.Users.AsNoTracking().ToListAsync();
                List<UserDTO> usersDTO = _mapper.Map<List<UserDTO>>(users);

                return usersDTO;
            }
            catch (Exception e)
            {
                throw new Exception($"Error from showUsers in AdministratorService, message: {e}");
            }
        }

        public async Task<bool> deleteUser(string userId)
        {
            try
            {
                User? user = await _userManager.FindByIdAsync(userId); ; //Wyszukanie użytkownika o podanym id

                if (user == null)
                {
                    return false;
                }

                IdentityResult resultCreate = await _userManager.DeleteAsync(user);

                if (resultCreate.Errors.Count() != 0)
                {
                    return false;
                }

                return true;
            }
            catch (Exception e)
            {
                throw new Exception($"Error from deleteUser in AdministratorService, message: {e}");
            }
        }

        public async Task<bool> lockOrUnlockUser(string userId)
        {
            try
            {
                User? user = await _userManager.FindByIdAsync(userId); ; //Wyszukanie użytkownika o podanym id

                if (user == null)
                {
                    return false;
                }

                user.Locked = user.Locked ? false : true;

                await _context.SaveChangesAsync();

                return true;
            }
            catch (Exception e)
            {
                throw new Exception($"Error from lockOrUnlockUser in AdministratorService, message: {e}");
            }
        }

        public async Task<bool> editPassword(ChangePasswordDTO changePasswordDTO)
        {
            try
            {
                ChangePassword changePassword = _mapper.Map<ChangePassword>(changePasswordDTO);//Mapowanie ChangePasswordDTO na ChangePassword
                User? user = await _userManager.FindByIdAsync(changePassword.UserId); ; //Wyszukanie użytkownika o podanym id

                if (user == null)
                {
                    return false;
                }

                if (changePassword.Password1 == changePassword.Password2)
                {
                    IdentityResult resultRemove = await _userManager.RemovePasswordAsync(user);
                    IdentityResult resultAdd = await _userManager.AddPasswordAsync(user, changePassword.Password1);

                    if (resultRemove.Errors.Count() != 0 || resultAdd.Errors.Count() != 0)
                    {
                        return false;
                    }
                }

                return true;
            }
            catch (Exception e)
            {
                throw new Exception($"Error from editPassword in AdministratorService, message: {e}");
            }
        }
    }
}
