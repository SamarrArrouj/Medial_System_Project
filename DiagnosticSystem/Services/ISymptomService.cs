using DiagnosticSystem.Entities;
using DiagnosticSystem.Models;

namespace DiagnosticSystem.Services
{
    public interface ISymptomService
    {
        Task<Symptom> AddSymptomAsync(SymptomDto dto, Guid patientId);
    }
}
