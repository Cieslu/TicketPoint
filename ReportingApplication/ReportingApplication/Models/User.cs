using Microsoft.AspNetCore.Identity;

namespace ReportingApplication.Models
{
    public class User : IdentityUser
    {
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public override required string UserName { get; set; }
        public required string Branch { get; set; }
        public required string Signature { get; set; }
        public required bool IsAdministrator { get; set; }
        public string? AdminColor { get; set; }
        public required bool Locked { get; set; } = false;
        public List<Ticket> Tickets { get; set; } = new();
        public List<TicketRecipent> TicketRecipents { get; } = new();
    }
}
