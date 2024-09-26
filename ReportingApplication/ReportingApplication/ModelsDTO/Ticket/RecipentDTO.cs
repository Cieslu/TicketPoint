using ReportingApplication.Models;

namespace ReportingApplication.ModelsDTO.Ticket
{
    public class RecipentDTO
    {
        public Guid? Id { get; set; }
        public string? UserId { get; set; }
        public string? RecipentName { get; set; }
    }
}
