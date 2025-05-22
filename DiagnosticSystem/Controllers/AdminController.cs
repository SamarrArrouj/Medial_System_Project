using DiagnosticSystem.Models;
using DiagnosticSystem.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.IO;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System;

namespace DiagnosticSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly IUserService _userService;

        public AdminController(IUserService userService)
        {
            _userService = userService;
        }


        [HttpPost("add-doctor")]
        public async Task<IActionResult> AddDoctor([FromForm] AddDoctorDto dto, [FromForm] IFormFile photo)
        {
            try
            {
                // Vérifier si un fichier est bien envoyé
                if (photo == null || photo.Length == 0)
                {
                    return BadRequest(new { error = "Aucune photo n'a été envoyée." });
                }

                // Créer le dossier de téléchargement s'il n'existe pas
                var uploadDir = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "photos");

                // Crée le dossier si il n'existe pas
                if (!Directory.Exists(uploadDir))
                {
                    Directory.CreateDirectory(uploadDir);
                }

                // Générer un nom unique pour la photo
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(photo.FileName);
                var filePath = Path.Combine(uploadDir, fileName);

                // Sauvegarder le fichier
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await photo.CopyToAsync(stream);
                }
                var relativePhotoUrl = "/uploads/photos/" + fileName;
                // Ajouter le médecin avec les autres données
                var newDoctor = await _userService.AddDoctorAsync(dto, filePath);

                return Ok(new
                {
                    success = true,
                    message = $"Le Dr {newDoctor.username} a été ajouté avec succès !",
                    doctor = newDoctor
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }


        [HttpGet("all-doctors")]
        public async Task<IActionResult> GetAllDoctors()
        {
            try
            {
                var doctors = await _userService.GetAllDoctorsAsync();

                // Vous pouvez ici modifier les données pour vous assurer que le chemin de la photo est relatif
                foreach (var doctor in doctors)
                {
                    doctor.PhotoUrl = "/uploads/photos/" + Path.GetFileName(doctor.PhotoUrl); // Modifier le chemin
                }

                return Ok(doctors);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }


        [HttpGet("doctor/{id}")]
        public async Task<IActionResult> GetDoctorById(Guid id)
        {
            try
            {
                var doctor = await _userService.GetDoctorByIdAsync(id);

                if (doctor == null)
                {
                    return NotFound(new { error = "Médecin non trouvé." });
                }

                // Ajouter un log pour vérifier que le médecin est bien trouvé
                Console.WriteLine($"Doctor found: {doctor.username}");

                doctor.PhotoUrl = "/uploads/photos/" + Path.GetFileName(doctor.PhotoUrl);

                return Ok(doctor); // Renvoie le médecin trouvé avec un statut 200 OK
            }
            catch (Exception ex)
            {
                // Si une exception se produit, renvoyer l'erreur avec un statut BadRequest
                return BadRequest(new { error = ex.Message });
            }
        }


        [HttpGet("all-patients")]
        public async Task<IActionResult> GetAllPatients()
        {
            try
            {
                var patients = await _userService.GetAllPatientsAsync();


                return Ok(patients);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }




    }
}