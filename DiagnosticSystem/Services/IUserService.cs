using DiagnosticSystem.Entities;
using DiagnosticSystem.Models;

namespace DiagnosticSystem.Services
{
    public interface IUserService
    {
        Task<User> AddDoctorAsync(AddDoctorDto dto, string photoPath);
        Task<List<User>> GetAllDoctorsAsync();
        Task<User> GetDoctorByIdAsync(Guid id);
        Task<List<User>> GetAllPatientsAsync();




    }
}
