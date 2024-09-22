namespace ReportingApplication.ModelsDTO.Administrator
{
    public class ChangePasswordDTO
    {
        public required string UserId { get; set; }
        public required string Password1 { get; set; }
        public required string Password2 { get; set; }
    }
}
