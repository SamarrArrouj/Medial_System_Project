using DiagnosticSystem.Data;
using DiagnosticSystem.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DiagnosticSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StatisticsController : ControllerBase
    {
        private readonly UserDbContext _context;

        public StatisticsController(UserDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetStatistiques()
        {
            var nbPatients = await _context.Users.CountAsync(u => u.role == "patient");
            var nbMedecins = await _context.Users.CountAsync(u => u.role == "medecin");

            return Ok(new
            {
                patients = nbPatients,
                medecins = nbMedecins
            });
        }

        [HttpGet("journaliere")]
        public IActionResult GetStatsParJour()
        {
            // Date limite : 7 derniers jours
            var startDate = DateTime.Today.AddDays(-6);

            // Récupération des utilisateurs par jour
            var users = _context.Users
                .Where(u => u.DateInscription.Date >= startDate.Date)
                .ToList();

            var grouped = users
                .GroupBy(u => u.DateInscription.Date)
                .OrderBy(g => g.Key)
                .ToDictionary(
                    g => g.Key.ToString("yyyy-MM-dd"),
                    g => new
                    {
                        Patients = g.Count(u => u.role == "patient"),
                        Medecins = g.Count(u => u.role == "medecin")
                    });

            var labels = Enumerable.Range(0, 7)
                .Select(i => DateTime.Today.AddDays(-6 + i).ToString("yyyy-MM-dd"))
                .ToList();

            var patients = labels.Select(label => grouped.ContainsKey(label) ? grouped[label].Patients : 0).ToList();
            var medecins = labels.Select(label => grouped.ContainsKey(label) ? grouped[label].Medecins : 0).ToList();

            var result = new
            {
                labels,
                patients,
                medecins
            };

            return Ok(result);
        }


        [HttpGet("medecins-par-sexe")]
        public IActionResult GetMedecinsParSexe()
        {
            var Medecins = _context.Users.Where(u => u.role == "medecin").ToList();
            var hommes = Medecins.Count(m => m.Sexe == "Homme");
            var femmes = Medecins.Count(m => m.Sexe == "Femme");

            return Ok(new { hommes, femmes });
        }

        [HttpGet("patients-par-sexe")]
        public IActionResult GetPatientsParSexe()
        {
            var Patients = _context.Users.Where(u => u.role == "patient").ToList();
            var hommes = Patients.Count(m => m.Sexe == "Homme");
            var femmes = Patients.Count(m => m.Sexe == "Femme");

            return Ok(new { hommes, femmes });
        }


        [HttpGet("visitors")]
        public IActionResult GetVisitorStats()
        {
            var stats = new List<VisitorStat>
        {
            new VisitorStat { Date = DateTime.Today.AddDays(-6), Views = 50 },
            new VisitorStat { Date = DateTime.Today.AddDays(-5), Views = 75 },
            new VisitorStat { Date = DateTime.Today.AddDays(-4), Views = 40 },
            new VisitorStat { Date = DateTime.Today.AddDays(-3), Views = 90 },
            new VisitorStat { Date = DateTime.Today.AddDays(-2), Views = 60 },
            new VisitorStat { Date = DateTime.Today.AddDays(-1), Views = 80 },
            new VisitorStat { Date = DateTime.Today, Views = 100 },
        };

            return Ok(stats);
        }

        [HttpGet("appointments-total")]
        public async Task<IActionResult> GetTotalAppointments()
        {
            try
            {
                // Compter le nombre total de rendez-vous
                var totalAppointments = await _context.Appointments.CountAsync();

                return Ok(new
                {
                    success = true,
                    totalAppointments
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet("appointments-approved")]
        public async Task<IActionResult> GetApprovedAppointments()
        {
            try
            {
                var totalApproved = await _context.Appointments
                    .CountAsync(a => a.Status == "approved"); 

                return Ok(new
                {
                    success = true,
                    totalApproved
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet("appointments-canceled")]
        public async Task<IActionResult> GetCanceledAppointments()
        {
            try
            {
                var totalCanceled = await _context.Appointments
                    .CountAsync(a => a.Status == "canceled"); 

                return Ok(new
                {
                    success = true,
                    totalCanceled
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }



    }
}

