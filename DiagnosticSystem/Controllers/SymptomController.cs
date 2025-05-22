using DiagnosticSystem.Models;
using DiagnosticSystem.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DiagnosticSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "patient")]
    public class SymptomsController : ControllerBase
    {
        private readonly ISymptomService _symptomService;

        public SymptomsController(ISymptomService symptomService)
        {
            _symptomService = symptomService;
        }

        [HttpPost("AddSymptom")]
        public async Task<IActionResult> AddSymptom([FromBody] SymptomDto dto)
        {

            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out Guid patientId))
            {
                return Unauthorized();
            }

            try
            {
                var symptom = await _symptomService.AddSymptomAsync(dto, patientId);
                return CreatedAtAction(nameof(GetSymptomById), new { id = symptom.Id }, symptom);
            }
            catch (Exception ex)
            {
                // Gestion d’erreur simple, à adapter
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetSymptomById(Guid id)
        {
            // Implémentation GET simple ou via service aussi
            // Exemple simplifié ici
            return Ok(); // à compléter selon besoin
        }
    }

}
