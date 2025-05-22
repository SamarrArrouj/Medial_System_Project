using System.Data;
using System.Text.Json.Serialization;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace DiagnosticSystem.Entities
{
    public class User
    {
    
        public Guid id { get; set; } = Guid.NewGuid();
        public string username { get; set; } = string.Empty;
      
        public string email { get; set; } = string.Empty;

        public string passwordHash { get; set; } = string.Empty;
        public string role { get; set; } = "patient";

        public string? RefreshToken { get; set; }

        public DateTime? RefreshTokenExpiryTime { get; set; }
        public string? ResetPasswordToken { get; internal set; } = string.Empty;
        public DateTime? ResetPasswordExpiry { get; internal set; }
        public string? Specialty { get; set; }
        public string? PhotoUrl { get; set; }
        [JsonIgnore]
        public Profil? Profil { get; set; }

        public DateTime DateInscription { get; set; } = DateTime.UtcNow;
        public string? Sexe { get; set; }

       



    }

}
