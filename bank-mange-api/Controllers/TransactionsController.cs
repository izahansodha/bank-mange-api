using BankApi.data;
using BankApi.Dto.Transaction;
using BankApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BankApi.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class TransactionsController : ControllerBase
{
    private readonly BankContext _context;
    private readonly ITransactionService _transactionService;
    private readonly ICurrentUserService _currentUser;

    public TransactionsController(
        BankContext context,
        ITransactionService transactionService,
        ICurrentUserService currentUser)
    {
        _context = context;
        _transactionService = transactionService;
        _currentUser = currentUser;
    }


    // =====================================================
    // DEPOSIT
    // =====================================================

    [HttpPost("deposit")]
    public async Task<IActionResult> Deposit(
        [FromBody] DepositRequest request)
    {
        var customerId =
            await _currentUser.GetCustomerIdAsync();

        if (customerId == null)
            return Unauthorized("Customer not found.");

        try
        {
            await _transactionService.DepositAsync(
                request,
                customerId.Value);

            return Ok(new
            {
                message = "Deposit successful"
            });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (DbUpdateConcurrencyException)
        {
            return Conflict(
                "Account was modified by another request. Please try again.");
        }
    }


    // =====================================================
    // WITHDRAW
    // =====================================================

    [HttpPost("withdraw")]
    public async Task<IActionResult> Withdraw(
        [FromBody] WithdrawRequest request)
    {
        var customerId =
            await _currentUser.GetCustomerIdAsync();

        if (customerId == null)
            return Unauthorized("Customer not found.");

        try
        {
            await _transactionService.WithdrawAsync(
                request,
                customerId.Value);

            return Ok(new
            {
                message = "Withdrawal successful"
            });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (DbUpdateConcurrencyException)
        {
            return Conflict(
                "Account was modified by another request. Please try again.");
        }
    }


    // =====================================================
    // TRANSFER
    // =====================================================

    [HttpPost("transfer")]
    public async Task<IActionResult> Transfer(
        [FromBody] TransferRequest request)
    {
        var customerId =
            await _currentUser.GetCustomerIdAsync();

        if (customerId == null)
            return Unauthorized("Customer not found.");

        try
        {
            await _transactionService.TransferAsync(
                request,
                customerId.Value);

            return Ok(new
            {
                message = "Transfer successful"
            });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (DbUpdateConcurrencyException)
        {
            return Conflict(
                "Account was modified by another request. Please try again.");
        }
    }


    // =====================================================
    // GET ALL TRANSACTIONS
    // =====================================================

    [HttpGet]
    public async Task<IActionResult> GetTransactions()
    {
        var customerId =
            await _currentUser.GetCustomerIdAsync();

        if (customerId == null)
            return Unauthorized("Customer not found.");

        var transactions = await _context.Transactions
            .AsNoTracking()
            .Where(t =>
                _context.Accounts.Any(a =>
                    a.Id == t.AccountId &&
                    a.CustomerId == customerId.Value))
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync();

        return Ok(transactions);
    }


    // =====================================================
    // GET TRANSACTION BY ID
    // =====================================================

    [HttpGet("{id}")]
    public async Task<IActionResult> GetTransaction(int id)
    {
        var customerId =
            await _currentUser.GetCustomerIdAsync();

        if (customerId == null)
            return Unauthorized("Customer not found.");

        var transaction = await _context.Transactions
            .AsNoTracking()
            .Where(t =>
                t.Id == id &&
                _context.Accounts.Any(a =>
                    a.Id == t.AccountId &&
                    a.CustomerId == customerId.Value))
            .FirstOrDefaultAsync();

        if (transaction == null)
            return NotFound("Transaction not found.");

        return Ok(transaction);
    }


    // =====================================================
    // GET ACCOUNT TRANSACTIONS
    // =====================================================

    [HttpGet("account/{accountId}")]
    public async Task<IActionResult> GetTransactionsByAccount(
        int accountId,
        string? type,
        DateTime? startDate,
        DateTime? endDate,
        string? sort,
        int page = 1,
        int pageSize = 10)
    {
        var customerId =
            await _currentUser.GetCustomerIdAsync();

        if (customerId == null)
            return Unauthorized("Customer not found.");

        var account = await _context.Accounts
            .AsNoTracking()
            .FirstOrDefaultAsync(a =>
                a.Id == accountId &&
                a.CustomerId == customerId.Value);

        if (account == null)
            return NotFound("Account not found.");


        if (page < 1)
            return BadRequest(
                "Page must be greater than 0.");

        if (pageSize < 1 || pageSize > 100)
            return BadRequest(
                "Page size must be between 1 and 100.");


        var query = _context.Transactions
            .AsNoTracking()
            .Where(t => t.AccountId == accountId);


        if (!string.IsNullOrWhiteSpace(type))
        {
            query = query.Where(t =>
                t.Type == type);
        }


        if (startDate.HasValue)
        {
            query = query.Where(t =>
                t.CreatedAt >= startDate.Value);
        }


        if (endDate.HasValue)
        {
            query = query.Where(t =>
                t.CreatedAt <= endDate.Value);
        }


        if (sort == "oldest")
        {
            query = query.OrderBy(t =>
                t.CreatedAt);
        }
        else
        {
            query = query.OrderByDescending(t =>
                t.CreatedAt);
        }


        var totalRecords =
            await query.CountAsync();

        var totalPages =
            (int)Math.Ceiling(
                (double)totalRecords / pageSize);


        var transactions = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();


        return Ok(new
        {
            page,
            pageSize,
            totalPages,
            totalRecords,
            data = transactions
        });
    }


    // =====================================================
    // ACCOUNT SUMMARY
    // =====================================================

    [HttpGet("account/{accountId}/summary")]
    public async Task<IActionResult> GetAccountSummary(
        int accountId)
    {
        var customerId =
            await _currentUser.GetCustomerIdAsync();

        if (customerId == null)
            return Unauthorized("Customer not found.");


        var account = await _context.Accounts
            .AsNoTracking()
            .FirstOrDefaultAsync(a =>
                a.Id == accountId &&
                a.CustomerId == customerId.Value);

        if (account == null)
            return NotFound("Account not found.");


        var totalDeposits =
            await _context.Transactions
                .Where(t =>
                    t.AccountId == accountId &&
                    t.Type == "Deposit")
                .SumAsync(t => t.Amount);


        var totalWithdrawals =
            await _context.Transactions
                .Where(t =>
                    t.AccountId == accountId &&
                    t.Type == "Withdrawal")
                .SumAsync(t => t.Amount);


        var totalTransfersSent =
            await _context.Transactions
                .Where(t =>
                    t.AccountId == accountId &&
                    t.Type == "TransferSent")
                .SumAsync(t => t.Amount);


        var totalTransfersReceived =
            await _context.Transactions
                .Where(t =>
                    t.AccountId == accountId &&
                    t.Type == "TransferReceived")
                .SumAsync(t => t.Amount);


        return Ok(new
        {
            accountId,
            totalDeposits,
            totalWithdrawals,
            totalTransfersSent,
            totalTransfersReceived
        });
    }
}