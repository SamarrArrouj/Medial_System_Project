namespace DiagnosticSystem.Entities
{
    public class Appointment
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid DoctorId { get; set; }
        public Guid PatientId { get; set; }
        public DateTime AppointmentDate { get; set; }

        public string Status { get; set; } = "En attente";

        public User Doctor { get; set; } = null!;
        public User Patient { get; set; } = null!;
    }
}
