using System.Text.Json.Serialization;

namespace DiagnosticSystem.Models
{
    public class AppointmentDto
    {
        public Guid DoctorId { get; set; }
        public DateTime AppointmentDate { get; set; }
    }
}
