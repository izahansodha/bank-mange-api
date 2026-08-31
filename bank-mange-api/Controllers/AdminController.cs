using BankApi.data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BankApi.Controllers;

[Authorize(Roles = "Admin")]
[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly BankContext _context;

    public AdminController(BankContext context)
    {
        _context = context;
    }

    // =====================================================
    // GET ALL USERS
    // =====================================================

    [HttpGet("users")]
    public async Task<IActionResult> GetUsers()
    {
        var users = await _context.Users
            .AsNoTracking()
            .Select(u => new
            {
                userId = u.Id,
                fullName = u.FullName,
                email = u.Email,
                role = u.Role,
                createdAt = u.CreatedAt
            })
            .OrderByDescending(u => u.createdAt)
            .ToListAsync();

        return Ok(users);
    }


    // =====================================================
    // GET USER BY ID
    // =====================================================

    [HttpGet("users/{id}")]
    public async Task<IActionResult> GetUser(Guid id)
    {
        var user = await _context.Users
            .AsNoTracking()
            .Where(u => u.Id == id)
            .Select(u => new
            {
                userId = u.Id,
                fullName = u.FullName,
                email = u.Email,
                role = u.Role,
                createdAt = u.CreatedAt
            })
            .FirstOrDefaultAsync();

        if (user == null)
            return NotFound("User not found.");

        return Ok(user);
    }


    // =====================================================
    // ADMIN SUMMARY
    // =====================================================

    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary()
    {
        var totalUsers =
            await _context.Users.CountAsync();

        var totalCustomers =
            await _context.Users
                .CountAsync(u => u.Role == "Customer");

        var totalAdmins =
            await _context.Users
                .CountAsync(u => u.Role == "Admin");

        var totalAccounts =
            await _context.Accounts.CountAsync();

        var totalTransactions =
            await _context.Transactions.CountAsync();

        return Ok(new
        {
            totalUsers,
            totalCustomers,
            totalAdmins,
            totalAccounts,
            totalTransactions
        });
    }


    // =====================================================
    // GET ALL ACCOUNTS
    // =====================================================

    [HttpGet("accounts")]
    public async Task<IActionResult> GetAccounts()
    {
        var accounts = await _context.Accounts
            .AsNoTracking()
            .Select(a => new
            {
                id = a.Id,
                accountNumber = a.AccountNumber,
                accountType = a.AccountType,
                balance = a.Balance,
                status = a.Status,
                createdAt = a.CreatedAt,

                customerId = a.CustomerId,

                customerName = _context.Customers
                    .Where(c => c.Id == a.CustomerId)
                    .Join(
                        _context.Users,
                        c => c.UserId,
                        u => u.Id,
                        (c, u) => u.FullName
                    )
                    .FirstOrDefault(),

                customerEmail = _context.Customers
                    .Where(c => c.Id == a.CustomerId)
                    .Join(
                        _context.Users,
                        c => c.UserId,
                        u => u.Id,
                        (c, u) => u.Email
                    )
                    .FirstOrDefault()
            })
            .OrderByDescending(a => a.createdAt)
            .ToListAsync();

        return Ok(accounts);
    }


    // =====================================================
    // GET ACCOUNT BY ID
    // =====================================================
    // =====================================================
// GET ALL TRANSACTIONS - ADMIN
// =====================================================

[HttpGet("transactions")]
public async Task<IActionResult> GetTransactions()
{
    var transactions = await _context.Transactions
        .AsNoTracking()
        .OrderByDescending(t => t.CreatedAt)
        .Select(t => new
        {
            id = t.Id,
            accountId = t.AccountId,
            type = t.Type,
            amount = t.Amount,
            createdAt = t.CreatedAt
        })
        .ToListAsync();

    return Ok(transactions);
}


// =====================================================
// GET TRANSACTION BY ID - ADMIN
// =====================================================

[HttpGet("transactions/{id}")]
public async Task<IActionResult> GetTransaction(int id)
{
    var transaction = await _context.Transactions
        .AsNoTracking()
        .Where(t => t.Id == id)
        .Select(t => new
        {
            id = t.Id,
            accountId = t.AccountId,
            type = t.Type,
            amount = t.Amount,
            createdAt = t.CreatedAt
        })
        .FirstOrDefaultAsync();

    if (transaction == null)
        return NotFound("Transaction not found.");

    return Ok(transaction);
}

    [HttpGet("accounts/{id}")]
    public async Task<IActionResult> GetAccount(int id)
    {
        var account = await _context.Accounts
            .AsNoTracking()
            .Where(a => a.Id == id)
            .Select(a => new
            {
                id = a.Id,
                accountNumber = a.AccountNumber,
                accountType = a.AccountType,
                balance = a.Balance,
                status = a.Status,
                createdAt = a.CreatedAt,

                customerId = a.CustomerId,

                customerName = _context.Customers
                    .Where(c => c.Id == a.CustomerId)
                    .Join(
                        _context.Users,
                        c => c.UserId,
                        u => u.Id,
                        (c, u) => u.FullName
                    )
                    .FirstOrDefault(),

                customerEmail = _context.Customers
                    .Where(c => c.Id == a.CustomerId)
                    .Join(
                        _context.Users,
                        c => c.UserId,
                        u => u.Id,
                        (c, u) => u.Email
                    )
                    .FirstOrDefault()
            })
            .FirstOrDefaultAsync();

        if (account == null)
            return NotFound("Account not found.");

        return Ok(account);
    }
}