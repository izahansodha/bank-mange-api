using BankApi.data;
using BankApi.Dto.AI;
using BankApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using BankApi.Dto.Transaction;

namespace BankApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AIController : ControllerBase
{
    private readonly IAIService _aiService;
    private readonly BankContext _context;
    private readonly ITransactionService _transactionService;
private readonly AIPendingTransferService _pendingTransferService;

    public AIController(
    IAIService aiService,
    BankContext context,
    ITransactionService transactionService,
    AIPendingTransferService pendingTransferService)
{
    _aiService = aiService;
    _context = context;
    _transactionService = transactionService;
    _pendingTransferService = pendingTransferService;
}

    [Authorize]
    [HttpPost("chat")]
    public async Task<IActionResult> Chat(
        ChatRequest request)
    {
        // Get GUID from JWT
        var userIdClaim =
            User.FindFirstValue(
                ClaimTypes.NameIdentifier
            );

        if (!Guid.TryParse(
                userIdClaim,
                out var userId))
        {
            return Unauthorized(
                "Invalid user ID."
            );
        }

        // Find customer using UserId
        var customer =
            await _context.Customers
                .FirstOrDefaultAsync(
                    c => c.UserId == userId
                );

        if (customer == null)
        {
            return NotFound(
                "Customer not found."
            );
        }

        // Use the integer Customer.Id
        var response =
            await _aiService.ChatAsync(
                request,
                customer.Id
            );

        return Ok(response);
    }
   [Authorize]
[HttpPost("transfer/confirm/{confirmationId}")]
public async Task<IActionResult> ConfirmTransfer(
    Guid confirmationId)
{
    // =============================================
    // GET LOGGED-IN USER
    // =============================================

    var userIdClaim =
        User.FindFirstValue(
            ClaimTypes.NameIdentifier
        );

    if (!Guid.TryParse(
            userIdClaim,
            out var userId))
    {
        return Unauthorized(new
        {
            message = "Invalid user identity."
        });
    }

    // =============================================
    // FIND CUSTOMER
    // =============================================

    var customer =
        await _context.Customers
            .FirstOrDefaultAsync(
                c => c.UserId == userId
            );

    if (customer == null)
    {
        return NotFound(new
        {
            message = "Customer not found."
        });
    }

    // =============================================
    // GET PENDING TRANSFER
    // =============================================

    var transfer =
        _pendingTransferService
            .GetTransfer(confirmationId);

        if (transfer == null)
        {
            return BadRequest(new
            {
                success = false,
                message =
                    "This transfer has already been completed, cancelled, or expired."
            });
        }

    // =============================================
    // CREATE NORMAL TRANSFER REQUEST
    // =============================================
    if (transfer.SourceAccountId ==
    transfer.DestinationAccountId)
{
    return BadRequest(new
    {
        success = false,
        message =
            "Source and destination accounts must be different."
    });
}

    var request = new TransferRequest
    {
        FromAccountId =
            transfer.SourceAccountId,

        ToAccountId =
            transfer.DestinationAccountId,

        Amount =
            transfer.Amount
    };

    try
    {
        // =============================================
        // EXECUTE EXISTING BANK TRANSFER
        // =============================================

        await _transactionService.TransferAsync(
            request,
            customer.Id
        );

        // =============================================
        // REMOVE PENDING TRANSFER
        // =============================================

        _pendingTransferService
            .RemoveTransfer(confirmationId);

        return Ok(new
        {
            success = true,

            message =
                "Transfer completed successfully.",

            confirmationId =
                confirmationId,

            amount =
                transfer.Amount
        });
    }
    catch (InvalidOperationException ex)
    {
        return BadRequest(new
        {
            success = false,
            message = ex.Message
        });
    }
    catch (Exception ex)
    {
        Console.WriteLine(
            "AI TRANSFER ERROR"
        );

        Console.WriteLine(
            ex.ToString()
        );

        return StatusCode(
            500,
            new
            {
                success = false,
                message =
                    "Unable to complete the transfer."
            }
        );
    }
}
}