using BankApi.Dto.Auth;
using BankApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace BankApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthServices _authService;

    public AuthController(IAuthServices authService)
    {
        _authService = authService;
    }


    // =====================================================
    // REGISTER
    // =====================================================

    [HttpPost("register")]
    public async Task<IActionResult> Register(
        [FromBody] RegisterRequest request)
    {
        try
        {
            var result = await _authService.RegisterAsync(request);

            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }


    // =====================================================
    // LOGIN
    // =====================================================

    [HttpPost("login")]
    public async Task<IActionResult> Login(
        [FromBody] LoginRequest request)
    {
        var result = await _authService.LoginAsync(request);

        if (result == null)
        {
            return Unauthorized(
                "Invalid email or password.");
        }

        return Ok(result);
    }
}