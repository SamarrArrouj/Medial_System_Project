using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DiagnosticSystem.Migrations.ApplicationDb
{
    /// <inheritdoc />
    public partial class AddContactMessagesTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_ContactForms",
                table: "ContactForms");

            migrationBuilder.RenameTable(
                name: "ContactForms",
                newName: "ContactMessages");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ContactMessages",
                table: "ContactMessages",
                column: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_ContactMessages",
                table: "ContactMessages");

            migrationBuilder.RenameTable(
                name: "ContactMessages",
                newName: "ContactForms");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ContactForms",
                table: "ContactForms",
                column: "Id");
        }
    }
}
