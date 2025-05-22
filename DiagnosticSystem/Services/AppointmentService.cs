using DiagnosticSystem.Data;
using DiagnosticSystem.Entities;
using DiagnosticSystem.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Security.Claims;

namespace DiagnosticSystem.Services
{
    public class AppointmentService : IAppointmentService
    {
        private readonly UserDbContext _context;
        private readonly IEmailService _emailService;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AppointmentService(UserDbContext context, IEmailService emailService, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _emailService = emailService;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<Appointment> CreateAppointmentAsync(AppointmentDto dto)
        {
            // Récupérer l'ID du patient depuis le token JWT
            var patientIdString = _httpContextAccessor.HttpContext.User.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")?.Value;


            // Si l'ID est vide ou invalide, on lance une exception
            if (string.IsNullOrEmpty(patientIdString) || !Guid.TryParse(patientIdString, out var patientId))
            {
                throw new UnauthorizedAccessException("Utilisateur non authentifié.");
            }

            // Vérifie si le médecin est déjà occupé à cette date et heure précise
            bool isTaken = await _context.Appointments.AnyAsync(a =>
                a.DoctorId == dto.DoctorId &&
                a.AppointmentDate.Date == dto.AppointmentDate.Date &&
                a.AppointmentDate.TimeOfDay == dto.AppointmentDate.TimeOfDay);

            if (isTaken)
                throw new Exception("Ce créneau est déjà réservé.");

            // Créer un nouvel objet rendez-vous
            var appointment = new Appointment
            {
                DoctorId = dto.DoctorId,
                PatientId = patientId, // Utiliser l'ID récupéré du token
                AppointmentDate = dto.AppointmentDate
            };

            // Sauvegarder le rendez-vous dans la base de données
            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();

            // Email de confirmation
            var doctor = await _context.Users.FindAsync(dto.DoctorId);
            var patient = await _context.Users.FindAsync(patientId); // Utiliser l'ID patient du token

            var subject = "Confirmation de rendez-vous";
            string formattedAppointmentDate = dto.AppointmentDate.ToString("dddd, dd MMMM yyyy HH:mm");

            // Utiliser les noms des propriétés en minuscule définis dans User
            var body = $"Bonjour {patient?.username},\n\nVotre demande de rendez-vous avec le Dr {doctor?.username} pour le {formattedAppointmentDate} est en attente de confirmation. Vous recevrez une notification une fois qu'elle aura été approuvée.";


            // Si le patient existe, envoyer un e-mail de confirmation
            if (patient != null)
                await _emailService.SendEmailAsync(patient.email, subject, body);

            return appointment;
        }

        public async Task<List<DoctorDto>> GetDoctors()
        {
            return await _context.Users
                              .Where(u => u.role == "medecin")
                              .Select(u => new DoctorDto
                              {
                                  Username = u.username,
                       
                                  Email = u.email,
                                  Specialty = u.Specialty,
                                  PhotoUrl = u.PhotoUrl,
                                  Role = u.role, //
                           
                              })
                              .ToListAsync();
        }

        public async Task<List<Appointment>> GetAllAppointmentsAsync()
        {
            return await _context.Appointments
                .Include(a => a.Doctor)   
                .Include(a => a.Patient)  
                .ToListAsync();
        }
        public async Task ApproveAsync(Guid id)  // Modifie ici pour prendre un Guid
        {
            var appointment = await _context.Appointments
                .Include(a => a.Patient)
                .Include(a => a.Doctor)
                .FirstOrDefaultAsync(a => a.Id == id);  // Compare avec un Guid

            if (appointment == null) throw new Exception("Appointment not found");

            appointment.Status = "Approved";
            await _context.SaveChangesAsync();

            // Envoi d'un e-mail au patient
            var subject = "Votre rendez-vous a été approuvé";
            var formattedDate = appointment.AppointmentDate.ToString("dddd, dd MMMM yyyy HH:mm");
            var body = $"Bonjour {appointment.Patient?.username},\n\n" +
                       $"Votre rendez-vous avec le Dr {appointment.Doctor?.username} le {formattedDate} a été approuvé. Merci d’être à l’heure.";

            if (appointment.Patient != null)
            {
                await _emailService.SendEmailAsync(appointment.Patient.email, subject, body);
            }
        }

        public async Task CancelAsync(Guid id)  // Modifie ici pour prendre un Guid
        {
            var appointment = await _context.Appointments
                .Include(a => a.Patient)
                .Include(a => a.Doctor)
                .FirstOrDefaultAsync(a => a.Id == id);  // Compare avec un Guid

            if (appointment == null) throw new Exception("Appointment not found");

            appointment.Status = "Canceled";
            await _context.SaveChangesAsync();

            // Envoi d'un e-mail au patient
            var subject = "Votre rendez-vous a été annulé";
            var formattedDate = appointment.AppointmentDate.ToString("dddd, dd MMMM yyyy HH:mm");
            var body = $"Bonjour {appointment.Patient?.username},\n\n" +
                       $"Votre rendez-vous avec le Dr {appointment.Doctor?.username} prévu pour le {formattedDate} a été annulé.\nVeuillez prendre un autre rendez-vous si nécessaire.";

            if (appointment.Patient != null)
            {
                await _emailService.SendEmailAsync(appointment.Patient.email, subject, body);
            }
        }

        public async Task<bool> UpdateStatusAsync(Guid id, string status)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null)
                return false;

            appointment.Status = status;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<Appointment>> GetAppointmentsByStatusAsync(string status)
        {
            return await _context.Appointments
                                 .Include(a => a.Patient)
                                 .Include(a => a.Doctor)
                                 .Where(a => a.Status == status)
                                 .ToListAsync();
        }


        public async Task<List<Appointment>> GetAppointmentsByDoctorAndStatusAsync(Guid doctorId, string status)
        {
            return await _context.Appointments
                                 .Include(a => a.Patient)
                                 .Include(a => a.Doctor)
                                 .Where(a => a.DoctorId == doctorId && a.Status.ToLower() == status.ToLower())
                                 .ToListAsync();
        }




    }



}

