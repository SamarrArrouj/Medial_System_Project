using DiagnosticSystem.Entities;
using Microsoft.EntityFrameworkCore;

namespace DiagnosticSystem.Data
{
    public class UserDbContext : DbContext
    {
        public UserDbContext(DbContextOptions<UserDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<Profil> Profils { get; set; }
       

        
    }
}
