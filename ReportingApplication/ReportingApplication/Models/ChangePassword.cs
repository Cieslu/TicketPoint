namespace ReportingApplication.Models
{
    public class ChangePassword
    {
        public required string UserId { get; set; }
        public required string Password1 { get; set; }
        public required string Password2 { get; set; }
    }
}
