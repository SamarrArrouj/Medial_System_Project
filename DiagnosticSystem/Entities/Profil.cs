namespace DiagnosticSystem.Entities
{
    public class Profil
    {
        public int Id { get; set; }
        public Guid UserId { get; set; }
        public string? FullName { get; set; }
        public DateTime CreatedAt { get; set; }
        public User User { get; set; } = null!;
    }
}
