using BankApi.Dto.Account;
using BankApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BankApi.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class AccountsController : ControllerBase
{
    private readonly IAccountService _accountService;
    private readonly ICurrentUserService _currentUser;

    public AccountsController(
        IAccountService accountService,
        ICurrentUserService currentUser)
    {
        _accountService = accountService;
        _currentUser = currentUser;
    }


    // =====================================================
    // GET MY ACCOUNTS
    // =====================================================

    [HttpGet]
    public async Task<IActionResult> GetMyAccounts()
    {
        var customerId =
            await _currentUser.GetCustomerIdAsync();

        if (customerId == null)
            return Unauthorized("Customer not found.");

        var accounts =
            await _accountService.GetMyAccountsAsync(
                customerId.Value);

        return Ok(accounts);
    }


    // =====================================================
    // GET MY ACCOUNT
    // =====================================================

    [HttpGet("{id}")]
    public async Task<IActionResult> GetAccount(int id)
    {
        var customerId =
            await _currentUser.GetCustomerIdAsync();

        if (customerId == null)
            return Unauthorized("Customer not found.");

        var account =
            await _accountService.GetAccountAsync(
                id,
                customerId.Value);

        if (account == null)
            return NotFound("Account not found.");

        return Ok(account);
    }


    // =====================================================
    // CREATE ACCOUNT
    // =====================================================

    [HttpPost]
    public async Task<IActionResult> CreateAccount(
        [FromBody] CreateAccountRequest request)
    {
        var customerId =
            await _currentUser.GetCustomerIdAsync();

        if (customerId == null)
            return Unauthorized("Customer not found.");

        try
        {
            var account =
                await _accountService.CreateAccountAsync(
                    customerId.Value,
                    request.AccountType);

            return Ok(new
            {
                message = "Account created successfully",
                account
            });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }


    // =====================================================
    // UPDATE ACCOUNT TYPE
    // =====================================================

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateAccountType(
        int id,
        [FromBody] UpdateAccountTypeRequest request)
    {
        var customerId =
            await _currentUser.GetCustomerIdAsync();

        if (customerId == null)
            return Unauthorized("Customer not found.");

        try
        {
            var account =
                await _accountService.UpdateAccountTypeAsync(
                    id,
                    customerId.Value,
                    request.AccountType);

            if (account == null)
                return NotFound("Account not found.");

            return Ok(new
            {
                message = "Account type updated successfully",
                account
            });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }


    // =====================================================
    // CLOSE ACCOUNT
    // =====================================================

    [HttpPut("{id}/close")]
    public async Task<IActionResult> CloseAccount(int id)
    {
        var customerId =
            await _currentUser.GetCustomerIdAsync();

        if (customerId == null)
            return Unauthorized("Customer not found.");

        try
        {
            var account =
                await _accountService.CloseAccountAsync(
                    id,
                    customerId.Value);

            if (account == null)
                return NotFound("Account not found.");

            return Ok(new
            {
                message = "Account closed successfully",
                account
            });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }
}
