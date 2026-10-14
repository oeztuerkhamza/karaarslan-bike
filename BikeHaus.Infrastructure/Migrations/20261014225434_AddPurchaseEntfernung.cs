using BikeHaus.Infrastructure.Data;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BikeHaus.Infrastructure.Migrations
{
    [DbContext(typeof(BikeHausDbContext))]
    [Migration("20261014225434_AddPurchaseEntfernung")]
    public partial class AddPurchaseEntfernung : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "EntfernungKm",
                table: "Purchases",
                type: "decimal(18,1)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EntfernungKm",
                table: "Purchases");
        }
    }
}
