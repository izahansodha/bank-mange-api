using BankApi.Dto.Account;

namespace BankApi.Services;

public interface IAccountService
{
    // Get one account belonging to the customer
    Task<AccountResponse?> GetAccountAsync(
        int accountId,
        int customerId);

    // Get all accounts belonging to the customer
    Task<List<AccountResponse>> GetMyAccountsAsync(
        int customerId);

    // Create a new account for a customer
    Task<AccountResponse> CreateAccountAsync(
        int customerId,
        string accountType);

    // Change account type
    Task<AccountResponse?> UpdateAccountTypeAsync(
        int accountId,
        int customerId,
        string accountType);

    // Close account
    Task<AccountResponse?> CloseAccountAsync(
        int accountId,
        int customerId);
}