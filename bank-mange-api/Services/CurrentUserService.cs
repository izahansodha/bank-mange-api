using BankApi.data;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace BankApi.Services;

public class CurrentUserService : ICurrentUserService
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly BankContext _context;

    public CurrentUserService(
        IHttpContextAccessor httpContextAccessor,
        BankContext context)
    {
        _httpContextAccessor = httpContextAccessor;
        _context = context;
    }

    public Guid? GetUserId()
    {
        var userIdString =
            _httpContextAccessor.HttpContext?
                .User
                .FindFirstValue(ClaimTypes.NameIdentifier);

        if (!Guid.TryParse(userIdString, out var userId))
            return null;

        return userId;
    }

    public async Task<int?> GetCustomerIdAsync()
    {
        var userId = GetUserId();

        if (userId == null)
            return null;

        var customerId = await _context.Customers
            .AsNoTracking()
            .Where(c => c.UserId == userId.Value)
            .Select(c => (int?)c.Id)
            .FirstOrDefaultAsync();

        return customerId;
    }
}