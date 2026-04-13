using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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
}
