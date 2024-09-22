﻿namespace ReportingApplication.ModelsDTO.Administrator
{
    public class UserDTO
    {
        public required string Id { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required string UserName { get; set; }
        public required string Email { get; set; }
        public required string Branch { get; set; }
        public required string Signature { get; set; }
        public required bool IsAdministrator { get; set; }
        public required bool Locked { get; set; }
    }
}
