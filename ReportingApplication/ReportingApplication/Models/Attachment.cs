namespace ReportingApplication.Models
{
    public class Attachment(string fileName, string filePath, Guid ticketId)
    {
        public int Id { get; set; }
        public string FileName { get; set; } = fileName;
        public string FilePath { get; set; } = filePath;
        public Guid TicketId { get; set; } = ticketId;
        public Ticket ticket { get; set; } = null!;
    }
}
