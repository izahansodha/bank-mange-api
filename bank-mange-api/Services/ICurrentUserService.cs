namespace BankApi.Services;

public interface ICurrentUserService
{
    Guid? GetUserId();

    Task<int?> GetCustomerIdAsync();
}
