using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReportingApplication.Data;
using ReportingApplication.Interfaces.Services;
using ReportingApplication.Models;
using ReportingApplication.ModelsDTO.Administrator;
using ReportingApplication.ModelsDTO.Ticket;

namespace ReportingApplication.Services
{
    public class TicketManagementService : ITicketManagementService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly UserManager<User> _userManager;

        public TicketManagementService(ApplicationDbContext context, IMapper mapper, UserManager<User> userManager)
        {
            _context = context;
            _mapper = mapper;
            _userManager = userManager;
        }

        public async Task<TicketDTO?> addTicket(NewTicketDTO newTicketDTO)
        {
            try
            {
                if (newTicketDTO == null)
                {
                    return null;
                }

                User? user = await _userManager.FindByIdAsync(newTicketDTO.UserId);//Sprawdzenie, czy użytkownik o takim id istnieje w bazie danych

                if (user == null)
                {
                    return null;
                }

                Ticket ticket = _mapper.Map<Ticket>(newTicketDTO);

                if (newTicketDTO.Files.Count() != 0)
                {
                    foreach (FormFile? formFile in newTicketDTO.Files)
                    {
                        if (formFile?.Length > 0)
                        {
                            string extension = Path.GetExtension(formFile.FileName);
                            if (extension != ".pdf" && extension != ".doc" && extension != ".docx" && extension != ".png" && extension != ".jpg" && extension != ".jpeg" && extension != ".txt")
                            {
                                return null;
                            }

                            string filePath = @$"C:\Ticket App\{ticket.Id}";

                            if (!Directory.Exists(filePath))
                            {
                                Directory.CreateDirectory(filePath);
                            }



                            filePath = @$"C:\Korner Report\{ticket.Id}\{formFile.FileName}";
                            using (FileStream stream = File.Create(filePath))
                            {
                                await formFile.CopyToAsync(stream);
                            }

                            Attachment attachment = new Attachment(formFile.FileName, filePath, ticket.Id);
                            await _context.AddAsync(attachment);
                        }
                    }
                }

                await _context.AddAsync(ticket);//Ticket jest doodawny do bazy po sprawdzeniu typów załączników, ponieważ gdy rozszerzenia będą nieodpowiednie, to API zwróci błąd
                await _context.SaveChangesAsync();

                Ticket? addedTicket = await _context.Tickets.FindAsync(ticket.Id);

                if (addedTicket == null)
                {
                    return null;
                }

                TicketDTO addedTicketDTO = _mapper.Map<TicketDTO>(addedTicket);
                UserDTO userDTO = _mapper.Map<UserDTO>(user);
                addedTicketDTO.user = userDTO;
                addedTicket.Attachments.ForEach(attachment =>
                {
                    addedTicketDTO.Attachments.Add(_mapper.Map<AttachmentDTO>(attachment));
                });

                return addedTicketDTO;
            }
            catch (Exception e)
            {
                throw new Exception($"Error from addTicket in TicketService, message: {e}");
            }
        }

        public async Task<List<TicketDTO>> showTickets()
        {
            try
            {
                List<Ticket> tickets = await _context.Tickets.ToListAsync();

                List<TicketDTO> ticketsDTO = _mapper.Map<List<TicketDTO>>(tickets);

                tickets.ForEach(ticket =>
                {
                    User? user = _context.Users.Find(ticket.UserId);

                    if (user is not null)
                    {
                        ticketsDTO.Find(x => x.Id == ticket.Id.ToString())!.user = _mapper.Map<UserDTO>(user);
                        /*TicketDTO ticketDTO = ticketsDTO.Find(x => x.Id == ticket.Id.ToString())!;

                        ticketDTO.user = _mapper.Map<UserDTO>(user);*/
/*
                        if(ticket.Recipents.Count() != 0)
                        {
                            ticketDTO.Recipents.Add(new RecipentDTO($"{user.FirstName} {user.LastName}"));
                        }*/
                    }
                });

                return ticketsDTO;
            }
            catch (Exception e)
            {
                throw new Exception($"Error from showTickets in TicketService, message: {e}");
            }
        }

        public async Task<TicketDTO?> showTicket(Guid ticketId)
        {
            try
            {
                Ticket? ticket = await _context.Tickets
                    .Include(x => x.Attachments)
                    .AsSplitQuery()
                    .FirstOrDefaultAsync(x => x.Id == ticketId);


                if (ticket is null)
                {
                    return null;
                }

                if (!ticket.IsRead)
                {
                    ticket.IsRead = true;//Zmieniono na true, gdyż ticket został odczytany
                    await _context.SaveChangesAsync();
                }

                TicketDTO ticketDTO = _mapper.Map<TicketDTO>(ticket);

                User? user = _context.Users.Find(ticket.UserId);

                if (user is not null)
                {
                    ticketDTO.user = _mapper.Map<UserDTO>(user);
                }

                return ticketDTO;
            }
            catch (Exception e)
            {
                throw new Exception($"Error from showTicket in TicketService, message: {e}");
            }
        }

        public async Task<bool> doesUserHaveAnyTickets(string userId)
        {
            try
            {
                int quantity = await _context.Tickets.Where(x => x.UserId == userId).CountAsync();

                return quantity > 0 ? false : true;

            }
            catch (Exception e)
            {
                throw new Exception($"Error from doesUserHaveAnyTickets in TicketService, message: {e}");
            }
        }

        public async Task<(byte[], string)?> downloadAttachment(Guid ticketId, int attachmentId)
        {
            try
            {
                string? attachPath = await _context.Attachments.Where(x => x.TicketId == ticketId && x.Id == attachmentId).Select(x => x.FilePath).FirstOrDefaultAsync();
                string? attachName = await _context.Attachments.Where(x => x.TicketId == ticketId && x.Id == attachmentId).Select(x => x.FileName).FirstOrDefaultAsync();

                if (attachPath is null || attachName is null)
                {
                    return null;
                }

                byte[] attachment = await File.ReadAllBytesAsync(attachPath);

                return (attachment, attachName);
            }
            catch (Exception e)
            {
                throw new Exception($"Error from downloadAttachment in TicketService, message: {e}");
            }
        }

        public async Task<bool> isRead(Guid ticketId)
        {
            try
            {
                Ticket? ticket = await _context.Tickets.FindAsync(ticketId);

                if (ticket is null)
                {
                    return false;
                }

                ticket.IsRead = ticket.IsRead ? false : true;

                await _context.SaveChangesAsync();

                return true;
            }
            catch (Exception e)
            {
                throw new Exception($"Error from isRead in TicketService, message: {e}");
            }
        }

       /* public async Task<bool> takeTicket(Guid ticketId, string userId)
        {
            try
            {
                Ticket? ticket = await _context.Tickets.FindAsync(ticketId);

                if (ticket is null)
                {
                    return false;
                }

                User? user = await _context.Users.FindAsync(userId);

                if (ticket is null)
                {
                    return false;
                }

                Recipent recipent = new Recipent(ticketId, userId);

                await _context.Recipents.AddAsync(recipent);
                await _context.SaveChangesAsync();

                return true;
            }
            catch (Exception e)
            {
                throw new Exception($"Error from isRead in TicketService, message: {e}");
            }
        }*/
    }
}
