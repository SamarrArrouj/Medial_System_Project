using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using DiagnosticSystem.Data;
using DiagnosticSystem.Entities;
using DiagnosticSystem.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace DiagnosticSystem.Services
{
    public class AuthService(UserDbContext context, IConfiguration configuration, IEmailService emailService) : IAuthService

    {
        private readonly IEmailService _emailService;


        public async Task<TokenResponseDto?> LoginAsync(LoginDto request)
        {
            var user = await context.Users.FirstOrDefaultAsync(u => u.email == request.email);
            if (user is null)
            {
                return null;
            }
            if (new PasswordHasher<User>().VerifyHashedPassword(user, user.passwordHash, request.password)
                == PasswordVerificationResult.Failed)
            {
                return null;
            }

            return await CreateTokenResponse(user); ;
        }

        private async Task<TokenResponseDto> CreateTokenResponse(User user)
        {
            return new TokenResponseDto
            {
                AccessToken = CreateToken(user),
                RefreshToken = await GenerateAndSaveRefreshTokenAsync(user),
                Role = user.role
            };
        }

        public async Task<TokenResponseDto?> RefreshTokensAsync(RefreshTokenRequestDto request)
        {
            var user = await ValidateRefreshTokenAsync(request.UserId, request.RefreshToken);
            if (user is null)
            {
                return null;
            }
            return await CreateTokenResponse(user);
        }

        private async Task<User?> ValidateRefreshTokenAsync(Guid userId, string refreshToken)
        {
            var user = await context.Users.FindAsync(userId);
            if (user is null || user.RefreshToken != refreshToken
                || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
            {
                return null;
            }

            return user;
        }

        private string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }

        private async Task<string> GenerateAndSaveRefreshTokenAsync(User user)
        {
            var refreshToken = GenerateRefreshToken();
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
            await context.SaveChangesAsync();
            return refreshToken;
        }


        private string CreateToken(User user)
        {
            var claims = new List<Claim>
    {
        new Claim(ClaimTypes.Name, user.username),
        new Claim(ClaimTypes.NameIdentifier, user.id.ToString()),
        new Claim(ClaimTypes.Role, user.role)
    };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(configuration["Authentication:Jwt:Secret"]!));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);

            var token = new JwtSecurityToken(
                issuer: configuration["Authentication:Jwt:Issuer"],
                audience: configuration["Authentication:Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }


        public async Task<User?> RegisterAsync(UserDto request)
        {
            // Vérification si l'utilisateur existe déjà avec le même email ou username
            if (await context.Users.AnyAsync(u => u.username == request.username || u.email == request.email))
            {
                // Vous pouvez renvoyer un message d'erreur plus spécifique ici
                return null;
            }

            // Création du nouvel utilisateur
            var user = new User
            {
                username = request.username,
                email = request.email,
                role = "patient",
                // Hachage du mot de passe
                passwordHash = new PasswordHasher<User>().HashPassword(new User(), request.password)
            };

            using (var transaction = await context.Database.BeginTransactionAsync())
            {
                try
                {
                    // Ajout de l'utilisateur dans la base de données
                    context.Users.Add(user);
                    await context.SaveChangesAsync();

                    // Création automatique d'un profil lié à l'utilisateur
                    var profile = new Profil
                    {
                        UserId = user.id,
                        FullName = request.username ?? "", // Nom complet initialisé avec le nom d'utilisateur
                        CreatedAt = DateTime.UtcNow,
                    };

                    // Ajout du profil dans la base de données
                    context.Profils.Add(profile);
                    await context.SaveChangesAsync();

                    // Validation de la transaction
                    await transaction.CommitAsync();

                    // Retour de l'utilisateur créé (sans mot de passe)
                    return user;
                }
                catch (Exception ex)
                {
                    // En cas d'erreur, rollback de la transaction
                    await transaction.RollbackAsync();
                    // Vous pouvez loguer l'erreur ici
                    throw new Exception("Erreur lors de l'enregistrement de l'utilisateur", ex);
                }
            }
        }





        public async Task<bool> ForgotPasswordAsync(string email)
        {
            var user = await context.Users.FirstOrDefaultAsync(u => u.email == email);
            if (user is null)
            {
                return false;
            }

            // Générer un token sécurisé (valable pour 1 heure)
            var token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));

            // Sauvegarder le token et son expiration
            user.ResetPasswordToken = token;
            user.ResetPasswordExpiry = DateTime.UtcNow.AddHours(1);
            await context.SaveChangesAsync();

            // Envoyer l'email avec le lien de réinitialisation
            string resetLink = $"http://localhost:4200/reset-password?token={Uri.EscapeDataString(token)}&email={email}";

            await emailService.SendEmailAsync(email, "Réinitialisation de mot de passe",
                $"Cliquez sur ce lien pour réinitialiser votre mot de passe : {resetLink}");

            return true;
        }

        public async Task<bool> ResetPasswordAsync(string email, string token, string newPassword)
        {
            try
            {
                var user = await context.Users.FirstOrDefaultAsync(u => u.email == email);

                if (user is null)
                {
                    Console.WriteLine("Utilisateur non trouvé.");
                    return false;
                }

                string decodedToken = HttpUtility.UrlDecode(token);

                Console.WriteLine($"Token reçu après décodage : {decodedToken}");
                Console.WriteLine($"Token en base : {user.ResetPasswordToken}");
                Console.WriteLine($"Date expiration stockée : {user.ResetPasswordExpiry}");
                Console.WriteLine($"Date actuelle UTC : {DateTime.UtcNow}");

                if (string.IsNullOrEmpty(user.ResetPasswordToken) || user.ResetPasswordToken != decodedToken)
                {
                    Console.WriteLine("Token incorrect.");
                    return false;
                }

                if (user.ResetPasswordExpiry == null || user.ResetPasswordExpiry < DateTime.UtcNow)
                {
                    Console.WriteLine("Token expiré.");
                    return false;
                }

                user.passwordHash = new PasswordHasher<User>().HashPassword(user, newPassword);
                user.ResetPasswordToken = null;
                user.ResetPasswordExpiry = null;

                await context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erreur : {ex.Message}");
                return false;
            }

        }






    }
}