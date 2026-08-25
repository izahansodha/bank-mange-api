using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BankApi.Models;
using BankApi.data;
using Microsoft.AspNetCore.Authorization;

namespace BankApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AccountsController : ControllerBase
{
    private readonly BankContext _context;
    public AccountsController(BankContext context)
    {
        _context = context;
    }
    [HttpGet]
    public async Task<IActionResult> GetAccounts()
    {
        var accounts = await _context.Accounts.ToListAsync();
        return Ok(accounts);
    }
    [Authorize(Roles = "Admin")]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetAccount(int id)
    {
        var account = await _context.Accounts.FirstOrDefaultAsync(a => a.Id == id);
        if (account == null)
        {
            return NotFound("Account not found");
        }
        return Ok(account);
    }
    [HttpPost]
    public async Task<IActionResult> CreateAccount(Account account)
    {
        var customer = await  _context.Customers.FirstOrDefaultAsync(c => c.Id == account.CustomerId);
        if(customer == null)
        {
            return NotFound("Customer not found");
        }
        var lastAccount = await _context.Accounts.OrderByDescending(a => a.Id).FirstOrDefaultAsync();
        long nextAccountNumber;
        if (lastAccount == null)
        {
            nextAccountNumber = 100000001;
        }
        else
        {
            nextAccountNumber = long.Parse(lastAccount.AccountNumber) + 1;
        }
        account.AccountNumber = nextAccountNumber.ToString();
        account.Balance = 0;
        account.CreatedAt = DateTime.UtcNow;
        _context.Accounts.Add(account);
        await _context.SaveChangesAsync();
        return Ok(new
        {
            message = "Account created successfully",
            account = account
        });
    }
    [HttpGet("Customer/{customerId}")]
    public async Task<IActionResult> GetAccountsByCustomer(int customerId)
    {
        var accounts = await _context.Accounts.Where(a => a.CustomerId == customerId).ToListAsync();
        return Ok(accounts);
    }
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateAccountType(int id, string accountType)
    {
        var account = await _context.Accounts.FirstOrDefaultAsync(a => a.Id == id);
        if(account == null)
        {
            return NotFound("Account not found");
        }
        if(accountType != "Savings" && accountType != "Current"){
            return BadRequest("Account type must be Savings or Current");
        }
        if(string.IsNullOrWhiteSpace(accountType)){
            return BadRequest("Account type is required");
        }
        if(accountType.Length > 10){
            return BadRequest("Account type must be less than 10 characters");
        }
        if(account.AccountType == accountType)
        {
            return BadRequest("Account type already exists");
        }
        else
        {
            account.AccountType = accountType;
        }
        await _context.SaveChangesAsync();
        return Ok(new
        {
            message = "Account type updated successfully",
            account = account
        });
    }
    [HttpPut("{id}/close")]
    public async Task<IActionResult> CloseAccount(int id)
    {
        var account = await _context.Accounts.FirstOrDefaultAsync(a => a.Id == id);
        if(account == null)
        {
            return NotFound("Account not found");
        }
        if(account.Status == "Closed"){
            return BadRequest("Account already closed");
        }
        if(account.Balance > 0){
            return BadRequest("Account has balance it should be zero");
        }
        account.Status = "Closed";
        await _context.SaveChangesAsync();
        return Ok(new
        {
            message = "Account closed successfully",
            account = account
        });
    }
}