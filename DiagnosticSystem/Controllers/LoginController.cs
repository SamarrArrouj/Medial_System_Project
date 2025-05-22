using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using DiagnosticSystem.Data;
using DiagnosticSystem.Entities;

namespace DiagnosticSystem.Controllers
{
    public class LoginController : Controller
    {
        private readonly UserDbContext _context;

        public LoginController(UserDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Login()
        {
            var redirectUrl = Url.Action(nameof(GoogleResponse), "Login");
            var properties = new AuthenticationProperties { RedirectUri = redirectUrl };
            return Challenge(properties, GoogleDefaults.AuthenticationScheme);
        }

        public async Task<IActionResult> GoogleResponse()
        {
            var result = await HttpContext.AuthenticateAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            if (!result.Succeeded)
                return RedirectToAction(nameof(Index));

            // 1️⃣ Extraire les informations de l'utilisateur connecté
            var claims = result.Principal.Identities.FirstOrDefault()?.Claims;
            var email = claims?.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            var username = claims?.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;

            if (string.IsNullOrEmpty(email))
                return RedirectToAction(nameof(Index));

            // 2️⃣ Vérifier si l'utilisateur existe déjà dans la base
            var existingUser = _context.Users.FirstOrDefault(u => u.email == email);
            if (existingUser == null)
            {
                // 3️⃣ Ajouter le nouvel utilisateur à la base
                var newUser = new User
                {
                    username = username,
                    email = email
                   
                };

                _context.Users.Add(newUser);
                await _context.SaveChangesAsync();
            }

            // 4️⃣ Rediriger vers la page d'accueil après l'inscription
            return RedirectToAction("Index", "Home");
        }

        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return RedirectToAction(nameof(Index));
        }

      
    }
}
