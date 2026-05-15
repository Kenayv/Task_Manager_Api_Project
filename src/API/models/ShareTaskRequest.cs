public class ShareTaskRequest
{
    public string TaskId { get; set; }
    public string SharedUserId { get; set; }
    public TaskPermission Permission { get; set; }
}
