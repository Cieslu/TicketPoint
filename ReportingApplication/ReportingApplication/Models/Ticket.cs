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
        public string Status { get; set; } = "Oczekiwanie";
        public bool IsRead { get; set; } = false;
        public List<Attachment> Attachments { get; set; } = new List<Attachment>();
        public List<Recipent> Recipents { get; set; } = new List<Recipent>();
    }
}
