using Microsoft.EntityFrameworkCore; // 引入 Entity Framework Core 的命名空间
using sports_management.Models; // 引入自定义模型的命名空间

namespace sports_management.Data
{
    // ApplicationDbContext 类继承自 DbContext 类，是 Entity Framework Core 的上下文类
    public class ApplicationDbContext : DbContext
    {
        // 定义 DbSet 属性，用于与数据库中的 User 表进行交互
        public DbSet<User> Users { get; set; }

        // 定义 DbSet 属性，用于与数据库中的 Group 表进行交互
        public DbSet<Group> Groups { get; set; }

        // 定义 DbSet 属性，用于与数据库中的 Reservation 表进行交互
        public DbSet<Reservation> Reservations { get; set; }

        // 定义 DbSet 属性，用于与数据库中的 Venue 表进行交互
        public DbSet<Venue> Venues { get; set; }

        // 构造函数，接受 DbContextOptions 类型的参数并传递给基类 DbContext
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }
    }
}
