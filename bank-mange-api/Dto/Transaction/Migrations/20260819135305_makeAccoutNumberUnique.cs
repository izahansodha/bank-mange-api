using Microsoft.EntityFrameworkCore.Migrations;
using BankApi.Dto.Transaction.Migrations;

#nullable disable

namespace BankApi.Dto.Transaction.Migrations
{
    /// <inheritdoc />
    public partial class makeAccoutNumberUnique : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Accounts_AccountNumber",
                table: "Accounts",
                column: "AccountNumber",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Accounts_AccountNumber",
                table: "Accounts");
        }
    }
}
