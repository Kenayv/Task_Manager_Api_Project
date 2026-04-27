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

        var task = new TaskItem
        {
            Title = request.Title,
            Description = request.Description,
            Deadline = request.Deadline,
            OwnerId = userId,
        };

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

        var tasks = await _dbContext.Tasks.Where(t => t.OwnerId == userId).ToListAsync();

        return Ok(tasks);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateTask(int id, UpdateTaskRequest request)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (userId == null)
        {
            return Unauthorized();
        }

        var task = await _dbContext.Tasks.FirstOrDefaultAsync(t => t.Id == id);

        if (task == null)
        {
            return NotFound();
        }
        if (task.OwnerId != userId)
        {
            return Forbid();
        }

        if (request.Title != null)
        {
            task.Title = request.Title;
        }
        if (request.Description != null)
        {
            task.Description = request.Description;
        }
        if (request.Deadline != null)
        {
            task.Deadline = request.Deadline;
        }

        _dbContext.Tasks.Update(task);

        await _dbContext.SaveChangesAsync();

        return Ok(task);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteTask(int id)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (userId == null)
        {
            return Unauthorized();
        }

        var task = await _dbContext.Tasks.FirstOrDefaultAsync(t => t.Id == id);

        if (task == null)
        {
            return NotFound();
        }
        if (task.OwnerId != userId)
        {
            return Forbid();
        }
        _dbContext.Tasks.Remove(task);

        await _dbContext.SaveChangesAsync();

        return NoContent();
    }
}
