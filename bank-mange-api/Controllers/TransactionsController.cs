using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BankApi.Models;
using BankApi.data;

namespace BankApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransactionsController : ControllerBase
    {
        private readonly BankContext _context;
        public TransactionsController(BankContext context)
        {
            _context = context;
        }
       [HttpPost("deposit")]
       public async Task<IActionResult> Deposit(int accountId, decimal amount)
       {
           var account = await _context.Accounts.FirstOrDefaultAsync(a => a.Id == accountId);
           if (account == null)
           {
               return NotFound("Account not found");
           }
            if(account.Status == "Closed")
           {
               return BadRequest("Account is closed");
           }
           if(amount <= 0)
           {
               return BadRequest("Amount must be greater than 0");
           }
           try{
                account.Balance += amount;
                account.Version = Guid.NewGuid();
            var transaction = new Transaction
           {
            ReferenceNumber = Guid.NewGuid().ToString("N").ToUpper(),
            AccountId = account.Id,
            Amount = amount,
            Type = "Deposit",
            CreatedAt = DateTime.UtcNow,
            Description = "Money Deposit Successful",
           };
           _context.Transactions.Add(transaction);
           await _context.SaveChangesAsync();
           return Ok(new
           {
               message = "Deposit successful",
               account = account,
               transaction = transaction,
           });
           }
           catch(DbUpdateConcurrencyException)
           {
               return Conflict("Account Was Modifyed By Other Request.Please Try Again Later");
           }
           
           
       }
       [HttpPost("withdraw")]
       public async Task<IActionResult> Withdraw(int accountId, decimal amount)
       {
           var account = await _context.Accounts.FirstOrDefaultAsync(a => a.Id == accountId);
           if (account == null)
           {
               return NotFound("Account not found");
           }
            if(account.Status == "Closed")
           {
               return BadRequest("Account is closed");
           }
           if (amount <= 0)
{
    return BadRequest("Amount must be greater than 0");
}
           if (account.Balance < amount)
           {
               return BadRequest("Insufficient balance");
           }
           
           try{
            account.Balance -= amount;
            account.Version = Guid.NewGuid();
            var transaction = new Transaction
           {
            ReferenceNumber = Guid.NewGuid().ToString("N").ToUpper(),
            AccountId = account.Id,
            Amount = amount,
            Type = "Withdrawal",
            CreatedAt = DateTime.UtcNow,
            Description = "Money Withdraw Successful"
           };
           _context.Transactions.Add(transaction);
           await _context.SaveChangesAsync();
           return Ok(new
           {
               message = "Withdrawal successful",
               account = account,
               transaction = transaction,
           });
           }
           catch(DbUpdateConcurrencyException)
           {
               return Conflict("Account Was Modifyed By Other Request.Please Try Again Later");
           }
       }
    [HttpGet]
    public async Task<IActionResult> GetTransactions()
    {
        var transactions = await _context.Transactions.ToListAsync();
        return Ok(transactions);
    }
    [HttpGet("{id}")]
    public async Task<IActionResult> GetTransaction(int id)
    {
        var transaction = await _context.Transactions.FirstOrDefaultAsync(t => t.Id == id);
        if (transaction == null)
        {
            return NotFound("Transaction not found");
        }
        return Ok(transaction);
    }
    [HttpGet("account/{accountId}")]
    public async Task<IActionResult> GetTransactionsByAccount(int accountId,string? type,DateTime? startDate,DateTime? endDate,string? sort,int page=1,int pageSize=10)
    {   var account = await _context.Accounts.FirstOrDefaultAsync(a => a.Id == accountId);
        if (account == null)
        {
            return NotFound("Account not found");
        }
        if(page < 1){
            return BadRequest("Page must be greater than 0");
        }
        if(pageSize < 1 || pageSize > 100){
            return BadRequest("Page size must be between 1 and 100");
        }
        var query = _context.Transactions.Where(t => t.AccountId == accountId);
        if (!string.IsNullOrWhiteSpace(type)){
            query = query.Where(t => t.Type == type);
        }
        if(startDate.HasValue){
            query = query.Where(t => t.CreatedAt >= startDate);
        }
        if(endDate.HasValue){
            query = query.Where(t => t.CreatedAt <= endDate);
        }
        if(sort == "oldest"){
            query = query.OrderBy(t => t.CreatedAt);
        }
        else{
            query = query.OrderByDescending(t => t.CreatedAt);
        }
        var totalRecords = await query.CountAsync();
        var totalPages = (int)Math.Ceiling((double)totalRecords / pageSize);
        var skip = (page - 1) * pageSize;
        var transactions = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
        return Ok(new
        {
            page,
            pageSize,
            totalPages,
            totalRecords,
            data = transactions,
        });
    }
   [HttpPost("transfer")]
public async Task<IActionResult> Transfer(
    int sourceAccountId,
    int destinationAccountId,
    decimal amount)
{
    // Find source account
    
    var sourceAccount = await _context.Accounts
        .FirstOrDefaultAsync(a => a.Id == sourceAccountId);

    // Find destination account
    var destinationAccount = await _context.Accounts
        .FirstOrDefaultAsync(a => a.Id == destinationAccountId);

    // Check source account
    if (sourceAccount == null)
    {
        return NotFound("Source Account not found");
    }

    // Check destination account
    if (destinationAccount == null)
    {
        return NotFound("Destination Account not found");
    }

    // Same account check
    if (sourceAccountId == destinationAccountId)
    {
        return BadRequest(
            "Source and destination accounts cannot be the same");
    }

    // Amount check
    if (amount <= 0)
    {
        return BadRequest("Amount must be greater than 0");
    }

    // Source account status
    if (sourceAccount.Status == "Closed")
    {
        return BadRequest("Source Account is closed");
    }

    // Destination account status
    if (destinationAccount.Status == "Closed")
    {
        return BadRequest("Destination Account is closed");
    }

    // Balance check
    if (sourceAccount.Balance < amount)
    {
        return BadRequest("Insufficient balance");
    }

    // Start database transaction
    using var dbTransaction =
        await _context.Database.BeginTransactionAsync();

    try
    {
        // Generate ONE reference number
        // Both Debit and Credit will use this
        var referenceNumber = Guid.NewGuid().ToString("N").ToUpper();

        // Update balances
        sourceAccount.Balance -= amount;
        sourceAccount.Version = Guid.NewGuid();
        destinationAccount.Balance += amount;
        destinationAccount.Version = Guid.NewGuid();

        // Create DEBIT transaction
        var debitTransaction = new Transaction
        {
            ReferenceNumber = referenceNumber,
            AccountId = sourceAccount.Id,
            Amount = amount,
            Type = "TransferSent",
            CreatedAt = DateTime.UtcNow,

            SourceAccountId = sourceAccount.Id,
            DestinationAccountId = destinationAccount.Id,

            Description =
                "Amount transferred to " +
                destinationAccount.AccountNumber
        };

        // Create CREDIT transaction
        var creditTransaction = new Transaction
        {
            ReferenceNumber = referenceNumber,
            AccountId = destinationAccount.Id,
            Amount = amount,
            Type = "TransferReceived",
            CreatedAt = DateTime.UtcNow,

            SourceAccountId = sourceAccount.Id,
            DestinationAccountId = destinationAccount.Id,

            Description =
                "Amount received from " +
                sourceAccount.AccountNumber
        };

        // Add both transactions
        _context.Transactions.Add(debitTransaction);
        _context.Transactions.Add(creditTransaction);

        // Save everything
        await _context.SaveChangesAsync();

        // Everything worked → COMMIT
        await dbTransaction.CommitAsync();

        return Ok(new
        {
            message = "Transfer successful",

            referenceNumber = referenceNumber,

            sourceAccount = sourceAccount,

            destinationAccount = destinationAccount,

            debitTransaction = debitTransaction,

            creditTransaction = creditTransaction
        });
    }
    catch (DbUpdateConcurrencyException)
{
    await dbTransaction.RollbackAsync();

    return Conflict(
        "One of the accounts was modified by another request. Please try again."
    );
}
catch (Exception)
{
    await dbTransaction.RollbackAsync();

    return StatusCode(
        500,
        "Transfer failed. All changes have been rolled back."
    );
}
}
[HttpGet("account/{accountId}/summary")]
public async Task<IActionResult> GetAccountSummary(int accountId)
{
    var account = await _context.Accounts.FirstOrDefaultAsync(a => a.Id == accountId);
    if (account == null)
    {
        return NotFound("Account not found");
    }
    var totalDeposits = await _context.Transactions.Where(t => t.AccountId == accountId && t.Type == "Deposit").SumAsync(t => t.Amount);
    var totalWithdrawals = await _context.Transactions.Where(t => t.AccountId == accountId && t.Type == "Withdrawal").SumAsync(t => t.Amount);
    var totalTransfersSent = await _context.Transactions.Where(t => t.AccountId == accountId && t.Type == "TransferSent").SumAsync(t => t.Amount);
    var totalTransfersReceived = await _context.Transactions.Where(t => t.AccountId == accountId && t.Type == "TransferReceived").SumAsync(t => t.Amount);
    return Ok(new{
        accountId,
        totalDeposits,
        totalWithdrawals,
        totalTransfersSent,
        totalTransfersReceived
    });
    }}
}