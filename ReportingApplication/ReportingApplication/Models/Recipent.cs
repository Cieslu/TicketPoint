namespace ReportingApplication.Models
{
    public class Recipent(string userId, string recipentName)
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string UserId { get; set; } = userId;
        public string RecipentName { get; set; } = recipentName;
        public List<Ticket> Tickets { get; set; } = new List<Ticket>();
    }
}
