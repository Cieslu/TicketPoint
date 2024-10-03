using ReportingApplication.Models;

namespace ReportingApplication.ModelsDTO.Ticket
{
    public class RecipentDTO(string userId, string recipentName, string recipentColor)
    {
        public string? UserId { get; set; } = userId;
        public string? RecipentName { get; set; } = recipentName;
        public string? RecipentColor { get; set; } = recipentColor;
    }
}
