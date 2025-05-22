using DiagnosticSystem.Data;
using DiagnosticSystem.Entities;
using DiagnosticSystem.Models;
using Microsoft.EntityFrameworkCore;

namespace DiagnosticSystem.Services
{
    public class SymptomService : ISymptomService
    {
        private readonly ApplicationDbContext _appDbContext;
        private readonly UserDbContext _userDbContext;

        public SymptomService(ApplicationDbContext appDbContext, UserDbContext userDbContext)
        {
            _appDbContext = appDbContext;
            _userDbContext = userDbContext;
        }

        public async Task<Symptom> AddSymptomAsync(SymptomDto dto, Guid patientId)
        {
            // Optionnel: vérifier que patient existe dans UserDbContext
            var patientExists = await _userDbContext.Users.AnyAsync(u => u.id == patientId);
            if (!patientExists)
                throw new Exception("Patient introuvable");

            var symptom = new Symptom
            {
                Age = dto.Age,
                Gender = dto.Gender,
                DateOfAppearance = dto.DateOfAppearance,
                Occupation = dto.Occupation,
                GrowingStress = dto.GrowingStress,
                ChangesHabits = dto.ChangesHabits,
                WeightChange = dto.WeightChange,
                MoodChange = dto.MoodChange,
                MentalHealthHistory = dto.MentalHealthHistory,
                WorkInterest = dto.WorkInterest,
                SocialWeakness = dto.SocialWeakness,
                PatientId = patientId
                // Ne pas assigner Patient (problème cross-DbContext)
            };

            _appDbContext.Symptoms.Add(symptom);
            await _appDbContext.SaveChangesAsync();

            return symptom;
        }
    }
    }