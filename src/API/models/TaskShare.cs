public class TaskShare
{
    public int Id { get; set; }
    public int TaskId { get; set; }
    public int SharedUserId { get; set; }
    public TaskPermission Permission { get; set; }
}
