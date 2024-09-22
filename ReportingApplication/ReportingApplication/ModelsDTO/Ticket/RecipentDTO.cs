using ReportingApplication.Models;

namespace ReportingApplication.ModelsDTO.Ticket
{
    public class RecipentDTO(string name)
    {
        public int? Id { get; set; }
        public string? Name { get; set; } = name;
    }
}
