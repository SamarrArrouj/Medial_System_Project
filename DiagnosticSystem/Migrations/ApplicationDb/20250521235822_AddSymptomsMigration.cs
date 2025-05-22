using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DiagnosticSystem.Migrations.ApplicationDb
{
    public partial class AddSymptomsMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Symptoms",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Age = table.Column<int>(nullable: false),
                    Gender = table.Column<string>(nullable: false),
                    DateOfAppearance = table.Column<DateTime>(nullable: false),
                    Occupation = table.Column<string>(nullable: false),
                    GrowingStress = table.Column<bool>(nullable: false),
                    ChangesHabits = table.Column<int>(nullable: false), // enum stockée en int
                    WeightChange = table.Column<bool>(nullable: false),
                    MoodChange = table.Column<int>(nullable: false),    // enum stockée en int
                    MentalHealthHistory = table.Column<bool>(nullable: false),
                    WorkInterest = table.Column<int>(nullable: false),  // enum stockée en int
                    SocialWeakness = table.Column<int>(nullable: false),// enum stockée en int
                    PatientId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Symptoms", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Symptoms_Users_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Symptoms_PatientId",
                table: "Symptoms",
                column: "PatientId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Symptoms");
        }
    }
}
