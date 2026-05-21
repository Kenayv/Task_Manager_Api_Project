public class TaskItem
{
    public string Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime? Deadline { get; set; }
    public string OwnerId { get; set; } = string.Empty;

    public ICollection<TaskShare> Shares { get; set; } = new List<TaskShare>();
}
