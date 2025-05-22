using System.ComponentModel.DataAnnotations;

namespace DiagnosticSystem.Models
{
    public class UserDto
    {
        [Required(ErrorMessage = "Username est requis.")]
        public String username { get; set; }= string.Empty;

        [Required(ErrorMessage = "Le mot de passe est requis.")]
        [MinLength(6, ErrorMessage = "Le mot de passe doit contenir au moins 6 caractères.")]
        [RegularExpression(@"^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$",
            ErrorMessage = "Le mot de passe doit contenir au moins une lettre majuscule, un chiffre et un caractère spécial (@$!%*?&).")]
        public String password { get; set; } = string.Empty;

        [Required(ErrorMessage = "L'email est requis.")]
        [EmailAddress(ErrorMessage = "L'adresse email n'est pas valide.")]
        public String email { get; set; } = string.Empty;
    }
}
