using BankApi.data;
using BankApi.Dto.Transaction;
using BankApi.Models;
using Microsoft.EntityFrameworkCore;

namespace BankApi.Services;

public class TransactionService : ITransactionService
{
    private readonly BankContext _context;

    public TransactionService(BankContext context)
    {
        _context = context;
    }

    // =========================
    // DEPOSIT
    // =========================
    public async Task DepositAsync(
        DepositRequest request,
        int customerId)
    {
        var account = await _context.Accounts
            .FirstOrDefaultAsync(x =>
                x.Id == request.AccountId &&
                x.CustomerId == customerId);

        if (account == null)
            throw new InvalidOperationException(
                "Account not found.");

        if (account.Status != "Active")
            throw new InvalidOperationException(
                "Account is not active.");

        account.Balance += request.Amount;

        var transaction = new BankApi.Models.Transaction
        {
            ReferenceNumber = Guid.NewGuid().ToString(),
            Amount = request.Amount,
            Type = "Deposit",
            Description = "Cash deposit",
            CreatedAt = DateTime.UtcNow,
            AccountId = account.Id
        };

        _context.Transactions.Add(transaction);

        await _context.SaveChangesAsync();
    }


    // =========================
    // WITHDRAW
    // =========================
    public async Task WithdrawAsync(
        WithdrawRequest request,
        int customerId)
    {
        var account = await _context.Accounts
            .FirstOrDefaultAsync(x =>
                x.Id == request.AccountId &&
                x.CustomerId == customerId);

        if (account == null)
            throw new InvalidOperationException(
                "Account not found.");

        if (account.Status != "Active")
            throw new InvalidOperationException(
                "Account is not active.");

        if (account.Balance < request.Amount)
            throw new InvalidOperationException(
                "Insufficient balance.");

        account.Balance -= request.Amount;

        var transaction = new BankApi.Models.Transaction
        {
            ReferenceNumber = Guid.NewGuid().ToString(),
            Amount = request.Amount,
            Type = "Withdrawal",
            Description = "Cash withdrawal",
            CreatedAt = DateTime.UtcNow,
            AccountId = account.Id
        };

        _context.Transactions.Add(transaction);

        await _context.SaveChangesAsync();
    }


    // =========================
    // TRANSFER
    // =========================
    public async Task TransferAsync(
        TransferRequest request,
        int customerId)
    {
// the currently logged-in customer.
        var sourceAccount = await _context.Accounts
            .FirstOrDefaultAsync(x =>
                x.Id == request.FromAccountId &&
                x.CustomerId == customerId);

        if (sourceAccount == null)
            throw new InvalidOperationException(
                "Source account not found.");

        // Find destination account.
        var destinationAccount = await _context.Accounts
            .FirstOrDefaultAsync(x =>
                x.Id == request.ToAccountId);

        if (destinationAccount == null)
            throw new InvalidOperationException(
                "Destination account not found.");

        if (sourceAccount.Status != "Active")
            throw new InvalidOperationException(
                "Source account is not active.");

        if (destinationAccount.Status != "Active")
            throw new InvalidOperationException(
                "Destination account is not active.");

        if (sourceAccount.Balance < request.Amount)
            throw new InvalidOperationException(
                "Insufficient balance.");

        // Move money.
        sourceAccount.Balance -= request.Amount;

        destinationAccount.Balance += request.Amount;

        // One reference number for this transfer.
        var referenceNumber = Guid.NewGuid().ToString();

        // Transaction for source account.
        var sourceTransaction = new Transaction
{
    ReferenceNumber = referenceNumber + "-OUT",
    Amount = request.Amount,
    Type = "TransferSent",
    Description = "Transfer to account " +
                  destinationAccount.AccountNumber,
    CreatedAt = DateTime.UtcNow,
    AccountId = sourceAccount.Id,
    SourceAccountId = sourceAccount.Id,
    DestinationAccountId = destinationAccount.Id
};

        // Transaction for destination account.
        var destinationTransaction = new Transaction
{
    ReferenceNumber = referenceNumber + "-IN",
    Amount = request.Amount,
    Type = "TransferReceived",
    Description = "Transfer from account " +
                  sourceAccount.AccountNumber,
    CreatedAt = DateTime.UtcNow,
    AccountId = destinationAccount.Id,
    SourceAccountId = sourceAccount.Id,
    DestinationAccountId = destinationAccount.Id
};

        _context.Transactions.Add(sourceTransaction);
        _context.Transactions.Add(destinationTransaction);

        await _context.SaveChangesAsync();
    }
}

