namespace DiagnosticSystem.Models
{
    public class AddDoctorDto
    {
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Specialty { get; set; } = string.Empty;
        public IFormFile? Photo { get; set; }
        public String Sexe { get; set; }

    }
}
