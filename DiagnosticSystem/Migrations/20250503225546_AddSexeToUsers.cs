using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DiagnosticSystem.Migrations
{
    /// <inheritdoc />
    public partial class AddSexeToUsers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Sexe",
                table: "Users",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Sexe",
                table: "Users");
        }
    }
}
