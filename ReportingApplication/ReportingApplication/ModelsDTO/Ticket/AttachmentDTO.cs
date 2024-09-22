namespace ReportingApplication.ModelsDTO.Ticket
{
    public class AttachmentDTO
    {
        public int? Id { get; set; }
        public string? FileName { get; set; }
        public string? FilePath { get; set; }
        public Guid? TicketId { get; set; }
    }
}
