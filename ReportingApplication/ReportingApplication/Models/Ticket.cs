using ReportingApplication.ModelsDTO.Ticket;

namespace ReportingApplication.Models
{
    public class Ticket
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public required string UserId { get; set; }
        public DateTime Created { get; set; } = DateTime.Now;
        public required string Title { get; set; }
        public required string Description { get; set; }
        public bool isFinished { get; set; } = false;
        public bool IsRead { get; set; } = false;

        public User User { get; set; } = null!;
        public List<Attachment> Attachments { get; } = new();
        public List<TicketRecipent> TicketRecipents { get; } = new();
    }
}
