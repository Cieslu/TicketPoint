using Microsoft.AspNetCore.Mvc;
using ReportingApplication.ModelsDTO.Ticket;

namespace ReportingApplication.Interfaces.Controllers
{
    public interface ITicketManagementController
    {
        public Task<ActionResult> addTicket(NewTicketDTO newTicketDTO);
        public Task<ActionResult<List<TicketDTO>>> showTickets();
        public Task<ActionResult<TicketDTO>> showTicket(Guid ticketId);
        public Task<ActionResult<bool>> doesUserHaveAnyTickets(string userId);
        public Task<ActionResult> downloadAttachment(Guid ticketId, int attachmentId);
        public Task<ActionResult<bool>> isRead(Guid ticketId);
        public Task<ActionResult<bool>> takeTicket(string userId, Guid ticketId);

    }
}
