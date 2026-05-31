using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BikeHaus.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddSaleVersand : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Versand",
                table: "Sales",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<decimal>(
                name: "VersandGebuehr",
                table: "Sales",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Versand",
                table: "Sales");

            migrationBuilder.DropColumn(
                name: "VersandGebuehr",
                table: "Sales");
        }
    }
}
