namespace ReportingApplication.Interfaces.Services
{
    public interface IRoleService
    {
        public Task<List<string>?> checkRole(string id);
    }
}
