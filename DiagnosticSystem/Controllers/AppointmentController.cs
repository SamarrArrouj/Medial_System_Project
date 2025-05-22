using DiagnosticSystem.Models;
using DiagnosticSystem.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DiagnosticSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AppointmentController : ControllerBase
    {
        private readonly IAppointmentService _appointmentService;
        private readonly IUserService _userService;
        public AppointmentController(IAppointmentService appointmentService,IUserService userService)
        {
            _appointmentService = appointmentService;
            _userService = userService;
        }
        [Authorize()]
        [HttpPost("create")]
        public async Task<IActionResult> CreateAppointment([FromBody] AppointmentDto dto)
        {
            try
            {
                var appointment = await _appointmentService.CreateAppointmentAsync(dto);
                return Ok(new
                {
                    success = true,
                    message = "Rendez-vous créé avec succès",
                    appointment
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    
        [HttpGet("doctors")]
        public async Task<IActionResult> GetDoctors()
        {
            var doctors = await _userService.GetAllDoctorsAsync();
            foreach (var doctor in doctors)
            {
                doctor.PhotoUrl = "/uploads/photos/" + Path.GetFileName(doctor.PhotoUrl); // Modifier le chemin
            }
            return Ok(doctors);
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllAppointments()
        {
            try
            {
                var appointments = await _appointmentService.GetAllAppointmentsAsync();

                return Ok(new
                {
                    success = true,
                    appointments
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPut("approve/{id}")]
        public async Task<IActionResult> Approve(Guid id)
        {
            var result = await _appointmentService.UpdateStatusAsync(id, "approved");
            if (!result)
                return NotFound(new { error = "Appointment not found" });

            return Ok(new { message = "Appointment approved" });
        }

        [HttpPut("cancel/{id}")]
        public async Task<IActionResult> Cancel(Guid id)
        {
            var result = await _appointmentService.UpdateStatusAsync(id, "canceled");
            if (!result)
                return NotFound(new { error = "Appointment not found" });

            return Ok(new { message = "Appointment canceled" });
        }

        [HttpGet("pending")]
        public async Task<IActionResult> GetPendingAppointments()
        {
            try
            {
                var appointments = await _appointmentService.GetAppointmentsByStatusAsync("pending");
                return Ok(appointments);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }


        [Authorize(Roles = "medecin")]
        [HttpGet("approved-by-doctor")]
        public async Task<IActionResult> GetApprovedAppointmentsByDoctor()
        {
            try
            {
                var doctorIdString = User.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")?.Value;

                if (string.IsNullOrEmpty(doctorIdString) || !Guid.TryParse(doctorIdString, out var doctorId))
                {
                    return Unauthorized(new { error = "Médecin non authentifié" });
                }

                var appointments = await _appointmentService.GetAppointmentsByDoctorAndStatusAsync(doctorId, "Approved");

                return Ok(new
                {
                    success = true,
                    appointments
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }



    }
}
