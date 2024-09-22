using ReportingApplication.Models;
using ReportingApplication.ModelsDTO.Administrator;

namespace ReportingApplication.ModelsDTO.Ticket
{
    public class TicketDTO
    {
        public required string Id { get; set; }
        public required string Created { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public required string Status { get; set; }
        public required bool IsRead { get; set; }
        public required UserDTO user { get; set; } 
        public required List<AttachmentDTO?> Attachments { get; set; }
        public required List<RecipentDTO?> Recipents { get; set; }

    }
}
