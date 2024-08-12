using sports_management.Data; // 引入数据上下文的命名空间
using sports_management.DTOs; // 引入数据传输对象（DTOs）的命名空间
using sports_management.Models; // 引入自定义模型的命名空间
using System; // 引入系统命名空间，用于访问基本的 .NET 类型和功能
using System.Threading.Tasks; // 引入用于异步编程的命名空间

namespace sports_management.Services
{
    // UserService 类提供了处理用户相关业务逻辑的方法
    public class UserService
    {
        // 定义一个只读的 ApplicationDbContext 类型字段，用于与数据库进行交互
        private readonly ApplicationDbContext _context;

        // 构造函数，接受一个 ApplicationDbContext 类型的参数并初始化 _context 字段
        public UserService(ApplicationDbContext context)
        {
            _context = context;
        }

        // 异步方法，用于注册用户
        public async Task RegisterUser(UserDto userDto)
        {
            // 创建新的 User 实例并设置其属性
            var user = new User
            {
                UserName = userDto.UserName, // 设置用户名
                Password = HashPassword(userDto.Password), // 设置加密后的密码
                PhoneNumber = userDto.PhoneNumber, // 设置电话号码
                UserType = userDto.UserType, // 设置用户类型
                RegistrationDate = DateTime.Now, // 设置注册日期为当前时间
            };

            // 将新的用户添加到数据库上下文中
            _context.Users.Add(user);
            // 保存更改到数据库
            await _context.SaveChangesAsync();
        }

        // 私有方法，用于加密密码
        private string HashPassword(string password)
        {
            // 使用 BCrypt 算法加密密码
            return BCrypt.Net.BCrypt.HashPassword(password);
        }
    }
}
