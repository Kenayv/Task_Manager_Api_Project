using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions options)
        : base(options) { }

    public DbSet<UserAccount> UserAccounts { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

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
    }
}
