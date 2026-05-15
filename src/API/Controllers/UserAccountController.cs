using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class UserAccountController : ControllerBase
{
    private readonly AppDbContext _dbContext;

    public UserAccountController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet] //FIXME: debug
    public async Task<ActionResult> GetUsers()
    {
        var users = await _dbContext.UserAccounts.ToListAsync();

        var result = users.Select(u => new UserDTO { userId = u.Id, userName = u.UserName });

        return Ok(result);
    }

    [HttpGet("search")]
    public async Task<ActionResult> GetUsers([FromQuery] string query)
    {
        var users = await _dbContext
            .UserAccounts.Where(u => u.UserName.Contains(query))
            .ToListAsync();

        var result = users.Select(u => new UserDTO { userId = u.Id, userName = u.UserName });

        return Ok(result);
    }
}
