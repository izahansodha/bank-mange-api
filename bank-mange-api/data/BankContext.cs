using BankApi.Models;
using Microsoft.EntityFrameworkCore;

namespace BankApi.data
{
    public class BankContext : DbContext
    {
        public BankContext(DbContextOptions<BankContext> options) : base(options) { }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Account> Accounts { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<User> Users {get;set;}
         protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Account>().Property(a => a.Version).IsConcurrencyToken();
        modelBuilder.Entity<Account>().HasIndex(a => a.AccountNumber).IsUnique();
        modelBuilder.Entity<Transaction>().HasIndex(t => new { t.AccountId, t.CreatedAt });
        modelBuilder.Entity<Customer>()
    .HasOne(c => c.User)
    .WithMany()
    .HasForeignKey(c => c.UserId)
    .OnDelete(DeleteBehavior.Cascade);
        }
    }
   
}