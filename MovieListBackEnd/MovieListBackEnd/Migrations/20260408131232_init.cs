using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MovieListBackEnd.Migrations
{
    /// <inheritdoc />
    public partial class init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MovieStatuses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false),
                    Watched = table.Column<bool>(type: "bit", nullable: false),
                    Rating = table.Column<decimal>(type: "decimal(4,2)", precision: 4, scale: 2, nullable: false),
                    Comment = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MovieStatuses", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MovieStatuses");
        }
    }
}
