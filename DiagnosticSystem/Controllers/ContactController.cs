using System.Net.Mail;
using System.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using DiagnosticSystem.Entities;
using DiagnosticSystem.Data;
using System.Threading.Tasks;

namespace DiagnosticSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContactController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _context;

        public ContactController(IConfiguration configuration, ApplicationDbContext context)
        {
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        [HttpPost]
        public async Task<IActionResult> SendEmail(ContactFormModel model)
        {
            if (model == null)
            {
                return BadRequest("Le formulaire est vide.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest("Les données du formulaire sont invalides.");
            }

            var emailConfig = _configuration.GetSection("EmailConfiguration");

            if (emailConfig == null || string.IsNullOrEmpty(emailConfig["Host"]))
            {
                return BadRequest("Erreur : La configuration SMTP est introuvable.");
            }

            try
            {
                // ✅ Envoi de l'e-mail
                var smtpClient = new SmtpClient(emailConfig["Host"])
                {
                    Port = int.Parse(emailConfig["Port"]),
                    Credentials = new NetworkCredential(emailConfig["Username"], emailConfig["Password"]),
                    EnableSsl = true
                };

                var message = new MailMessage
                {
                    From = new MailAddress(emailConfig["From"]),
                    Subject = model.Subject,
                    Body = model.Message,
                    IsBodyHtml = true
                };

                message.To.Add(new MailAddress(model.Email));

                await smtpClient.SendMailAsync(message);

                // ✅ Enregistrement du message dans la base de données
                _context.ContactMessages.Add(new ContactFormModel
                {
                    Name = model.Name,
                    Email = model.Email,
                    Subject = model.Subject,
                    Message = model.Message
                });

                await _context.SaveChangesAsync(); // Sauvegarde dans la base

                return Ok(new { message = "Le message a été envoyé et enregistré avec succès." });

            }
            catch (Exception ex)
            {
                return BadRequest($"Erreur lors de l'envoi du message: {ex.Message}");
            }
        }
    }
}
