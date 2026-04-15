using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class TaskController : ControllerBase
{
    private readonly AppDbContext _dbContext;

    public TaskController(AppDbContext context)
    {
        _dbContext = context;
    }

    [HttpPost]
    public async Task<ActionResult> CreateTask(CreateTaskRequest request)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (userId == null)
        {
            return Unauthorized();
        }

        var task = new TaskItem() { Title = request.Title, UserId = int.Parse(userId) };

        _dbContext.Tasks.Add(task);
        await _dbContext.SaveChangesAsync();

        return Ok(task);
    }

    [HttpGet]
    public async Task<ActionResult> GetUserTasks()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (userId == null)
        {
            return Unauthorized();
        }

        var tasks = await _dbContext.Tasks.Where(t => t.UserId == int.Parse(userId)).ToListAsync();

        return Ok(tasks);
    }
}
