namespace ReportingApplication.Models
{
    public class Recipent(Guid ticketId, string userId)
    {
        public int Id { get; set; }
        public Guid TicketId { get; set; } = ticketId;
        public string UserId { get; set; } = userId;
        public Ticket ticket { get; set; } = null!;
    }
}
