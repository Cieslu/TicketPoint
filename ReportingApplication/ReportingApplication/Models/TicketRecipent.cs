namespace ReportingApplication.Models
{
    public class TicketRecipent(Guid ticketId, string userId)
    {
        public Guid TicketId { get; set; } = ticketId;
        public string UserId { get; set; } = userId;

        public Ticket Ticket { get; set; } = null!;
        public User Recipent { get; set; } = null!;
    }
}
