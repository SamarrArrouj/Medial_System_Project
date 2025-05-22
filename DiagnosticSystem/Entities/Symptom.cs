using System;

namespace DiagnosticSystem.Entities
{
    public enum ResponseOption
    {
        Yes,
        No,
        Maybe
    }

    public class Symptom
    {
        public Guid Id { get; set; } = Guid.NewGuid();

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

        public Guid PatientId { get; set; }
        public User Patient { get; set; } = null!;



    }
}
