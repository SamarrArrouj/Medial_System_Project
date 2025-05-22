using DiagnosticSystem.Data;
using DiagnosticSystem.Entities;
using DiagnosticSystem.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Numerics;

namespace DiagnosticSystem.Services
{
    public class UserService : IUserService
    {
        private readonly UserDbContext _context;
        private readonly IEmailService _emailService;

        public UserService(UserDbContext context, IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        public async Task<User> AddDoctorAsync(AddDoctorDto dto, string photoPath)
        {
            // Vérifier si l'email existe déjà dans la base de données
            if (await _context.Users.AnyAsync(u => u.email == dto.Email))
                throw new Exception("Cet email est déjà utilisé.");

            // Générer un mot de passe temporaire
            var tempPassword = GenerateRandomPassword();

            // Créer un objet User pour le médecin
            var doctor = new User
            {
                id = Guid.NewGuid(),
                username = dto.Username,
                email = dto.Email,
                Sexe = dto.Sexe,
                passwordHash = BCrypt.Net.BCrypt.HashPassword(tempPassword),
                role = "medecin",
                Specialty = dto.Specialty,
                PhotoUrl = photoPath  // Assigner le chemin de la photo
            };

            // Ajouter le médecin à la base de données
            _context.Users.Add(doctor);
            await _context.SaveChangesAsync();

            // Envoyer le mot de passe temporaire par email
            await SendPasswordByEmail(doctor.email, tempPassword);

            return doctor;
        }

        public string GenerateRandomPassword(int length = 12)
        {
            const string validChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
            var random = new Random();
            var password = new string(
                Enumerable.Repeat(validChars, length)
                          .Select(s => s[random.Next(s.Length)])
                          .ToArray());
            return password;
        }

        public async Task SendPasswordByEmail(string to, string password)
        {
            var subject = "Votre mot de passe temporaire";
            var body = $"Bonjour,\n\nVotre mot de passe temporaire est : {password}\n\nVeuillez le changer après votre première connexion.";

            try
            {
                // Utilise le service d'envoi d'email injecté
                await _emailService.SendEmailAsync(to, subject, body);
            }
            catch (Exception ex)
            {
                // Log ou gestion des erreurs si l'envoi échoue
                throw new Exception("Une erreur s'est produite lors de l'envoi de l'email : " + ex.Message);
            }
        }
        public async Task<List<User>> GetAllDoctorsAsync()
        {
            return await _context.Users
                                 .Where(u => u.role == "medecin")
                                 .Select(u => new User
                                 {
                                     username = u.username,
                                     Sexe = u.Sexe,
                                     email = u.email,
                                     Specialty = u.Specialty,
                                     PhotoUrl = u.PhotoUrl,
                                     role = u.role, //
                                     id = u.id,     
                                 })
                                 .ToListAsync();
        }


        public async Task<List<User>> GetAllPatientsAsync()
        {
            return await _context.Users
                                 .Where(u => u.role == "patient")
                                 .Select(u => new User
                                 {

                                     username = u.username,
                                     email = u.email,
                                     Sexe = u.Sexe,
                                     Specialty = u.Specialty
                                   
                                 })
                                 .ToListAsync();
        }

        public async Task<User> GetDoctorByIdAsync(Guid id)
        {
            return await _context.Users
                .Where(u => u.role == "medecin" && u.id == id)
                .FirstOrDefaultAsync(); // Assurez-vous que la requête fonctionne bien.
        }


        




    }

}