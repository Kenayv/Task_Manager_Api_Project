public class TaskDto
{
    public string Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime? Deadline { get; set; }
    public bool IsOwner { get; set; }
    public TaskPermission Permission { get; set; }
}