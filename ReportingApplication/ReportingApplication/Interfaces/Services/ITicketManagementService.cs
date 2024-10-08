using Microsoft.AspNetCore.Mvc;
using ReportingApplication.ModelsDTO;
using ReportingApplication.ModelsDTO.Ticket;

namespace ReportingApplication.Interfaces.Services
{
    public interface ITicketManagementService
    {
        public Task<TicketDTO?> addTicket(NewTicketDTO newTicektDTO);
        public Task<List<TicketDTO>> showTickets(bool isClosed);
        public Task<TicketDTO?> showTicket(Guid ticketId);
        public Task<bool> doesUserHaveAnyTickets(string userId);
        public Task<(byte[], string)?> downloadAttachment(Guid ticketId, int attachmentId);
        public Task<bool> isRead(Guid ticketId);
        public Task<bool> takeTicket(Guid ticketId, string userId);
        public Task<bool> closeOrOpenTicket(Guid ticketId);
    }
}
