using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace BankApi.Models
{
    [Index(nameof(AccountNumber), IsUnique = true)]
    public class Account
    {
        public int Id { get; set; }
        public string AccountNumber {get;set;} = string.Empty;
        public decimal Balance { get; set; }
        [Required]
        public string AccountType { get; set; } = string.Empty;
        public int CustomerId { get;set;}
        public Guid Version { get;set; } = Guid.NewGuid();
        public DateTime CreatedAt{ get; set;}
        public Customer? Customer {get;set;}
        public string Status { get; set; } = "Active";
    }
}