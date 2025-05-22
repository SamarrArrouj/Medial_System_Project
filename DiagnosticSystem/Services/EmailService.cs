using System.Net.Mail;
using System.Net;

namespace DiagnosticSystem.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration configuration;

        public EmailService(IConfiguration configuration)
        {
            this.configuration = configuration;
        }

        public async Task SendEmailAsync(string to, string subject, string body)
        {
            // Vérifier que les paramètres SMTP ne sont pas null
            string smtpHost = configuration["EmailConfiguration:Host"];
            string smtpPortStr = configuration["EmailConfiguration:Port"];
            string smtpUsername = configuration["EmailConfiguration:Username"];
            string smtpPassword = configuration["EmailConfiguration:Password"];
            string smtpFrom = configuration["EmailConfiguration:From"];


            if (string.IsNullOrEmpty(smtpHost) || string.IsNullOrEmpty(smtpPortStr) ||
                string.IsNullOrEmpty(smtpUsername) || string.IsNullOrEmpty(smtpPassword) ||
                string.IsNullOrEmpty(smtpFrom))
            {
                throw new ArgumentNullException("Une ou plusieurs valeurs SMTP sont nulles ou manquantes dans la configuration.");
            }

            if (!int.TryParse(smtpPortStr, out int smtpPort))
            {
                throw new FormatException("Le port SMTP est invalide.");
            }

            var smtpClient = new SmtpClient(smtpHost)
            {
                Port = smtpPort,
                Credentials = new NetworkCredential(smtpUsername, smtpPassword),
                EnableSsl = true,
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(smtpFrom),
                Subject = subject,
                Body = body,
                IsBodyHtml = true,
            };
            mailMessage.To.Add(to);

            await smtpClient.SendMailAsync(mailMessage);
        }

    }
}
