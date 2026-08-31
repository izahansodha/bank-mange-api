using BankApi.data;
using BankApi.Dto.Account;
using BankApi.Models;
using Microsoft.EntityFrameworkCore;

namespace BankApi.Services;

public class AccountService : IAccountService
{
    private readonly BankContext _context;

    public AccountService(BankContext context)
    {
        _context = context;
    }


    // =====================================================
    // GET ONE ACCOUNT
    // =====================================================

    public async Task<AccountResponse?> GetAccountAsync(
        int accountId,
        int customerId)
    {
        var account = await _context.Accounts
            .AsNoTracking()
            .FirstOrDefaultAsync(x =>
                x.Id == accountId &&
                x.CustomerId == customerId);

        if (account == null)
            return null;

        return MapToResponse(account);
    }


    // =====================================================
    // GET MY ACCOUNTS
    // =====================================================

    public async Task<List<AccountResponse>> GetMyAccountsAsync(
        int customerId)
    {
        return await _context.Accounts
            .AsNoTracking()
            .Where(x => x.CustomerId == customerId)
            .Select(x => new AccountResponse
            {
                Id = x.Id,
                AccountNumber = x.AccountNumber,
                Balance = x.Balance,
                AccountType = x.AccountType,
                Status = x.Status,
                CreatedAt = x.CreatedAt
            })
            .ToListAsync();
    }


    // =====================================================
    // CREATE ACCOUNT
    // =====================================================

    public async Task<AccountResponse> CreateAccountAsync(
        int customerId,
        string accountType)
    {
        if (string.IsNullOrWhiteSpace(accountType))
            throw new InvalidOperationException(
                "Account type is required.");

        if (accountType != "Savings" &&
            accountType != "Current")
        {
            throw new InvalidOperationException(
                "Account type must be Savings or Current.");
        }


        var customerExists = await _context.Customers
            .AnyAsync(x => x.Id == customerId);

        if (!customerExists)
            throw new InvalidOperationException(
                "Customer not found.");


        var lastAccount = await _context.Accounts
            .OrderByDescending(x => x.Id)
            .FirstOrDefaultAsync();


        long nextAccountNumber;

        if (lastAccount == null)
        {
            nextAccountNumber = 100000001;
        }
        else
        {
            if (!long.TryParse(
                    lastAccount.AccountNumber,
                    out var lastNumber))
            {
                throw new InvalidOperationException(
                    "Invalid account number.");
            }

            nextAccountNumber = lastNumber + 1;
        }


        var account = new Account
        {
            AccountNumber = nextAccountNumber.ToString(),
            Balance = 0,
            AccountType = accountType,
            CustomerId = customerId,
            CreatedAt = DateTime.UtcNow,
            Status = "Active"
        };


        _context.Accounts.Add(account);

        await _context.SaveChangesAsync();

        return MapToResponse(account);
    }


    // =====================================================
    // UPDATE ACCOUNT TYPE
    // =====================================================

    public async Task<AccountResponse?> UpdateAccountTypeAsync(
        int accountId,
        int customerId,
        string accountType)
    {
        if (string.IsNullOrWhiteSpace(accountType))
            throw new InvalidOperationException(
                "Account type is required.");

        if (accountType != "Savings" &&
            accountType != "Current")
        {
            throw new InvalidOperationException(
                "Account type must be Savings or Current.");
        }

        if (accountType.Length > 10)
            throw new InvalidOperationException(
                "Account type must be less than 10 characters.");


        var account = await _context.Accounts
            .FirstOrDefaultAsync(x =>
                x.Id == accountId &&
                x.CustomerId == customerId);

        if (account == null)
            return null;


        if (account.Status == "Closed")
            throw new InvalidOperationException(
                "Closed account cannot be modified.");


        if (account.AccountType == accountType)
            throw new InvalidOperationException(
                "Account type already exists.");


        account.AccountType = accountType;

        await _context.SaveChangesAsync();

        return MapToResponse(account);
    }


    // =====================================================
    // CLOSE ACCOUNT
    // =====================================================

    public async Task<AccountResponse?> CloseAccountAsync(
        int accountId,
        int customerId)
    {
        var account = await _context.Accounts
            .FirstOrDefaultAsync(x =>
                x.Id == accountId &&
                x.CustomerId == customerId);

        if (account == null)
            return null;


        if (account.Status == "Closed")
            throw new InvalidOperationException(
                "Account already closed.");


        if (account.Balance > 0)
            throw new InvalidOperationException(
                "Account balance must be zero before closing.");


        account.Status = "Closed";

        await _context.SaveChangesAsync();

        return MapToResponse(account);
    }


    // =====================================================
    // MAP ACCOUNT → DTO
    // =====================================================

    private static AccountResponse MapToResponse(
        Account account)
    {
        return new AccountResponse
        {
            Id = account.Id,
            AccountNumber = account.AccountNumber,
            Balance = account.Balance,
            AccountType = account.AccountType,
            Status = account.Status,
            CreatedAt = account.CreatedAt
        };
    }
}