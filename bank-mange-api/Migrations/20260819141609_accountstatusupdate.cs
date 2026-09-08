using Microsoft.EntityFrameworkCore.Migrations;
using BankApi.Dto.Transaction.Migrations;

#nullable disable

namespace BankApi.Dto.Transaction.Migrations
{
    /// <inheritdoc />
    public partial class accountstatusupdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "Accounts",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Status",
                table: "Accounts");
        }
    }
}
