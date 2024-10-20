﻿using AutoMapper;
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
                            string folderName = "TicketPoint";
                            string extension = Path.GetExtension(formFile.FileName);
                            if (extension != ".pdf" && extension != ".doc" && extension != ".docx" && extension != ".png" && extension != ".jpg" && extension != ".jpeg" && extension != ".txt")
                            {
                                return null;
                            }

                            string filePath = @$"C:\{folderName}\{ticket.Id}";

                            if (!Directory.Exists(filePath))
                            {
                                Directory.CreateDirectory(filePath);
                            }

                            filePath = @$"C:\{folderName}\{ticket.Id}\{formFile.FileName}";
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
                addedTicketDTO.User = userDTO;
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

        public async Task<List<TicketDTO>> showTickets(bool isClosed)
        {
            try
            {
                List<Ticket> tickets = new();

                if (isClosed == false)
                {
                    tickets = await _context.Tickets
                        .Where(t => t.isFinished == false)
                        .Include(t => t.User)
                        .Include(t => t.TicketRecipents)
                            .ThenInclude(tr => tr.Recipent)
                        .AsNoTracking()
                        .AsSplitQuery()
                        .ToListAsync();
                }
                else
                {
                    tickets = await _context.Tickets
                      .Where(t => t.isFinished == true)
                      .Include(t => t.User)
                      .Include(t => t.TicketRecipents)
                          .ThenInclude(tr => tr.Recipent)
                      .AsNoTracking()
                      .AsSplitQuery()
                      .ToListAsync();
                }

                List<TicketDTO> ticketsDTO = _mapper.Map<List<TicketDTO>>(tickets);

                tickets.ForEach(ticket =>
                {
                    ticket.TicketRecipents.ForEach(tr =>
                    {
                        ticketsDTO.Find(x => x.Id == ticket.Id)!.Recipents.Add(new RecipentDTO(tr.Recipent.Id, $"{tr.Recipent.LastName}{tr.Recipent.FirstName.Remove(1)}", tr.Recipent.AdminColor!));//Tutaj dodane są dodawani odbiorcy do listy, która znajduje się w ticketDTO
                    });
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
                    .Include(t => t.Attachments)
                    .Include(t => t.User)
                    .Include(t => t.TicketRecipents)
                        .ThenInclude(tr => tr.Recipent)
                    .AsSplitQuery()
                    .SingleOrDefaultAsync(x => x.Id == ticketId);

                if (!ticket!.IsRead)
                {
                    ticket.IsRead = true;//Zmieniono na true, gdyż ticket został odczytany
                    await _context.SaveChangesAsync();
                }

                TicketDTO ticketDTO = _mapper.Map<TicketDTO>(ticket);
    
                ticket.TicketRecipents.ForEach(tr =>
                {
                    ticketDTO.Recipents.Add(new RecipentDTO(tr.Recipent.Id, $"{tr.Recipent.LastName}{tr.Recipent.FirstName.Remove(1)}", tr.Recipent.AdminColor!));//Tutaj dodane są dodawani odbiorcy do listy, która znajduje się w ticketDTO
                });

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

                return quantity > 0 ? true : false;

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

        public async Task<bool> takeTicket(Guid ticketId, string userId)
        {
            try
            {
                TicketRecipent? tr = await _context.TicketRecipents.FindAsync(ticketId, userId);

                if(tr is not null)
                {
                    await _context.TicketRecipents
                        .Where(tr => tr.TicketId == ticketId && tr.UserId == userId)
                        .ExecuteDeleteAsync();

                    return true;
                }

                await _context.TicketRecipents.AddAsync(new TicketRecipent(ticketId, userId));
                await _context.SaveChangesAsync();

                return true;
            }
            catch (Exception e)
            {
                throw new Exception($"Error from takeTicket in TicketService, message: {e}");
            }
        }

        public async Task<bool> closeOrOpenTicket(Guid ticketId)
        {
            try
            {
                await _context.Tickets
                    .Where(t => t.Id == ticketId)
                    .ExecuteUpdateAsync(x => x.SetProperty(t => t.isFinished, t => t.isFinished ? false : true));

                return true;
            }
            catch (Exception e)
            {
                throw new Exception($"Error from finishTicket in TicketService, message: {e}");
            }
        }   
    }
}
