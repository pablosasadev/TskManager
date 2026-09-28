using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TskManager.Api.Data;
using TskManager.Api.Models;

namespace TskManager.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize] // All endpoints require a valid JWT
public class TasksController : ControllerBase
{
    private readonly AppDbContext _context;

    public TasksController(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Reads the authenticated user's id from the JWT claims.
    /// Every query is scoped to this id so users can only access their own tasks.
    /// </summary>
    private int CurrentUserId =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TaskItem>>> GetTasks()
    {
        return await _context.Tasks
            .Where(t => t.UserId == CurrentUserId)
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TaskItem>> GetTask(int id)
    {
        var task = await _context.Tasks
            .FirstOrDefaultAsync(t => t.Id == id && t.UserId == CurrentUserId);

        return task == null ? NotFound() : task;
    }

    [HttpPost]
    public async Task<ActionResult<TaskItem>> CreateTask(TaskItem task)
    {
        task.UserId = CurrentUserId;
        task.CreatedAt = DateTime.UtcNow;

        _context.Tasks.Add(task);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetTask), new { id = task.Id }, task);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTask(int id, TaskItem task)
    {
        if (id != task.Id) return BadRequest();

        var existing = await _context.Tasks
            .FirstOrDefaultAsync(t => t.Id == id && t.UserId == CurrentUserId);

        if (existing == null) return NotFound();

        existing.Title = task.Title;
        existing.Description = task.Description;
        existing.IsCompleted = task.IsCompleted;
        existing.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTask(int id)
    {
        var task = await _context.Tasks
            .FirstOrDefaultAsync(t => t.Id == id && t.UserId == CurrentUserId);

        if (task == null) return NotFound();

        _context.Tasks.Remove(task);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
