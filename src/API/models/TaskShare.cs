using System.Security.Cryptography.X509Certificates;

public class TaskShare
{
    public int Id { get; set; }
    public int TaskId { get; set; }
    public string SharedUserId { get; set; } = "";
    public TaskPermission Permission { get; set; }

    public TaskItem Task { get; set; } = null!;
}
