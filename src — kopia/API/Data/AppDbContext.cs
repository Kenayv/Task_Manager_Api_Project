using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions options)
        : base(options) { }

    public DbSet<UserAccount> UserAccounts { get; set; }
    public DbSet<TaskItem> Tasks { get; set; }
    public DbSet<TaskShare> TaskShares { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder
            .Entity<TaskShare>()
            .HasOne(ts => ts.Task)
            .WithMany(t => t.Shares)
            .HasForeignKey(ts => ts.TaskId);

        modelBuilder
            .Entity<TaskShare>()
            .HasIndex(ts => new { ts.TaskId, ts.SharedUserId })
            .IsUnique();

        _ = modelBuilder
            .Entity<UserAccount>()
            .HasData([
                new UserAccount
                {
                    Id = 1,
                    UserName = "admin",
                    Password = PasswordHashHandler.HashPassword("admin123"),
                },
            ]);
        _ = modelBuilder
            .Entity<TaskItem>()
            .HasData([
                new TaskItem
                {
                    Id = 6,
                    Title = "taki tam task",
                    OwnerId = "1",
                },
                new TaskItem
                {
                    Id = 4,
                    Title = "yet another task for user1",
                    OwnerId = "1",
                },
                new TaskItem
                {
                    Id = 1,
                    Title = "A taks that IS INVISIBLE for user1",
                    OwnerId = "2",
                },
            ]);
    }
}
