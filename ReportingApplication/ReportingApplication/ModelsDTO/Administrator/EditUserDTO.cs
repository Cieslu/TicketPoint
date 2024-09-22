namespace ReportingApplication.ModelsDTO.Administrator
{
    public class EditUserDTO
    {
        public required string Id { get; set; } = string.Empty;
        public required string FirstName { get; set; } = string.Empty;
        public required string LastName { get; set; } = string.Empty;
        public required string UserName { get; set; } = string.Empty;
        public required string Email { get; set; } = string.Empty;
        public required string Branch { get; set; } = string.Empty;
        public required string Signature { get; set; } = string.Empty;
        public required bool IsAdministrator { get; set; } = false;
    }
}
