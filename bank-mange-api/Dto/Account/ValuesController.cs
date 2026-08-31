using Microsoft.AspNetCore.Mvc;

namespace BankApi.Dto.Account;

[ApiController]
[Route("api/[controller]")]
public class ValuesControllerController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok();
    }
}
