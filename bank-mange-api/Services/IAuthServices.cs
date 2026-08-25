using BankApi.Dto.Auth;

namespace BankApi.Services;

public interface IAuthServices
{
    Task<AuthResponse> RegisterAsync(RegisterRequest request);

    Task<AuthResponse?> LoginAsync(LoginRequest request);
}