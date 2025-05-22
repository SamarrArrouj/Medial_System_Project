using DiagnosticSystem.Entities;
using DiagnosticSystem.Models;

namespace DiagnosticSystem.Services
{
    public interface IAppointmentService
    {
        Task<Appointment> CreateAppointmentAsync(AppointmentDto dto);

        Task<List<DoctorDto>> GetDoctors();
        Task<List<Appointment>> GetAllAppointmentsAsync();
        Task ApproveAsync(Guid id);
        Task CancelAsync(Guid id);
        Task<bool> UpdateStatusAsync(Guid id, string status);
        Task<List<Appointment>> GetAppointmentsByStatusAsync(string status);
        Task<List<Appointment>> GetAppointmentsByDoctorAndStatusAsync(Guid doctorId, string status);
    }
}
