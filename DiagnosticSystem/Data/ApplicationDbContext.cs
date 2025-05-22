using DiagnosticSystem.Entities;
using Microsoft.EntityFrameworkCore;

namespace DiagnosticSystem.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }
       
        public DbSet<ContactFormModel> ContactMessages { get; set; }
        public DbSet<VisitorStat> VisitorStats { get; set; }
        public DbSet<Symptom> Symptoms { get; set; }
    }
}
