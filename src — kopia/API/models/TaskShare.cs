public class TaskShare
{
    public string Id { get; set; }
    public string TaskId { get; set; }
    public string SharedUserId { get; set; }
    public TaskPermission Permission { get; set; }
}
