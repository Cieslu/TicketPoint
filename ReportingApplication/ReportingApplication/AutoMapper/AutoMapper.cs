using AutoMapper;
using ReportingApplication.Models;
using ReportingApplication.ModelsDTO.Administrator;
using ReportingApplication.ModelsDTO.Ticket;

namespace ReportingApplication.AutoMapper
{
    public class AutoMapper : Profile
    {
        public AutoMapper()
        {
            CreateMap<UserDTO, User>();
            CreateMap<EditUserDTO, User>();
            CreateMap<NewUserDTO, User>();//addUser(NewUserDTO newUserDTO)
            CreateMap<User, UserDTO>();//showUsers()
            CreateMap<User, UserDTO>();//showUsers()
            CreateMap<ChangePasswordDTO, ChangePassword>();
            CreateMap<NewTicketDTO, Ticket>();
            CreateMap<Ticket, NewTicketDTO>();
            CreateMap<Ticket, TicketDTO>();
            CreateMap<Attachment, AttachmentDTO>();
            CreateMap<Recipent, RecipentDTO>();
            CreateMap<RecipentDTO, Recipent>();
        }
    }
}
