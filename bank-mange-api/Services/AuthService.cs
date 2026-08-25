using BankApi.data;
using BankApi.Dto.Auth;
using BankApi.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace BankApi.Services;

public class AuthService : IAuthServices
{
    private readonly BankContext _context;
    private readonly IConfiguration _configuration;
    private readonly PasswordHasher<User> _passwordHasher;

    public AuthService(
            BankContext context,
        IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
        _passwordHasher = new PasswordHasher<User>();
    }
    public async Task<AuthResponse?> LoginAsync(
    LoginRequest request)
{
    var user = await _context.Users.FirstOrDefaultAsync(x => x.Email == request.Email);

    if (user == null)
        return null;

    var result = _passwordHasher.VerifyHashedPassword(
        user,
        user.PasswordHash,
        request.Password
    );

    if (result == PasswordVerificationResult.Failed)
        return null;

    var token = GenerateToken(user);

    return new AuthResponse
    {
        Token = token,
        UserId = user.Id,
        FullName = user.FullName,
        Email = user.Email,
        Role = user.Role
    };
}
    public async Task<AuthResponse> RegisterAsync(
    RegisterRequest request)
{
    var existingUser = await _context.Users
        .FirstOrDefaultAsync(x => x.Email == request.Email);

    if (existingUser != null)
        throw new Exception("Email already registered.");

    var user = new User
    {
        Id = Guid.NewGuid(),
        FullName = request.FullName,
        Email = request.Email,
        Role = "Customer"
    };

    user.PasswordHash = _passwordHasher.HashPassword(
        user,
        request.Password
    );

    _context.Users.Add(user);

    await _context.SaveChangesAsync();

    var token = GenerateToken(user);

    return new AuthResponse
    {
        Token = token,
        UserId = user.Id,
        FullName = user.FullName,
        Email = user.Email,
        Role = user.Role
    };
}
private string GenerateToken(User user)
{
    var claims = new[]
    {
        new Claim(
            ClaimTypes.NameIdentifier,
            user.Id.ToString()
        ),

        new Claim(
            ClaimTypes.Email,
            user.Email
        ),

        new Claim(
            ClaimTypes.Name,
            user.FullName
        ),

        new Claim(
            ClaimTypes.Role,
            user.Role
        )
    };

    var key = new SymmetricSecurityKey(
        Encoding.UTF8.GetBytes(
            _configuration["Jwt:Key"]!
        )
    );

    var credentials = new SigningCredentials(
        key,
        SecurityAlgorithms.HmacSha256
    );

    var token = new JwtSecurityToken(
        issuer: _configuration["Jwt:Issuer"],
        audience: _configuration["Jwt:Audience"],
        claims: claims,
        expires: DateTime.UtcNow.AddMinutes(
            int.Parse(
                _configuration["Jwt:ExpiryMinutes"]!
            )
        ),
        signingCredentials: credentials
    );

    return new JwtSecurityTokenHandler().WriteToken(token);
}
}