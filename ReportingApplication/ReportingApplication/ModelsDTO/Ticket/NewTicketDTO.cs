namespace ReportingApplication.ModelsDTO.Ticket
{
    public class NewTicketDTO
    {
        //public required string TicketId { get; set; }
        public required string UserId { get; set; }
        //public required string Created { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public List<IFormFile?> Files { get; set; } = new List<IFormFile?>();
        //public List<string?> FilesPaths { get; set; } = new List<string?>();
    }
}
