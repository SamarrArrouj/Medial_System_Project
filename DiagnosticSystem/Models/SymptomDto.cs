using DiagnosticSystem.Entities;

namespace DiagnosticSystem.Models
{
    public class SymptomDto
    {
        public int Age { get; set; }
        public string Gender { get; set; } = string.Empty;
        public DateTime DateOfAppearance { get; set; }
        public string Occupation { get; set; } = string.Empty;
        public bool GrowingStress { get; set; }
        public ResponseOption ChangesHabits { get; set; }
        public bool WeightChange { get; set; }
        public ResponseOption MoodChange { get; set; }
        public bool MentalHealthHistory { get; set; }
        public ResponseOption WorkInterest { get; set; }
        public ResponseOption SocialWeakness { get; set; }
    }

}
