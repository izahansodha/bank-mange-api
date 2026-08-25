using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace BankApi.Models
{
    [Index(nameof(ReferenceNumber), IsUnique = true)]
    public class Transaction
    {
        public int Id { get; set; }

        public string ReferenceNumber { get; set; } = string.Empty;

        public decimal Amount { get; set; }

        public string Type { get; set; } = string.Empty;

        public string? Description { get; set; }

        public DateTime CreatedAt { get; set; }

        // Account whose transaction history this belongs to
        public int AccountId { get; set; }

        public Account? Account { get; set; }

        // Used for transfers
        public int? SourceAccountId { get; set; }

        public int? DestinationAccountId { get; set; }
    }
}