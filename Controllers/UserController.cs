using Microsoft.AspNetCore.Mvc; // 引入 ASP.NET Core MVC 的命名空间
using sports_management.DTOs; // 引入自定义数据传输对象（DTOs）的命名空间
using sports_management.Services; // 引入自定义服务的命名空间
using System; // 引入系统命名空间，用于访问基本的 .NET 类型和功能
using System.Threading.Tasks; // 引入用于异步编程的命名空间

namespace sports_management.Controllers
{
    // ApiController 特性指示此控制器处理 Web API 请求
    // Route 特性指定此控制器的路由前缀
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        // 定义一个只读的 UserService 类型字段，用于处理用户相关操作
        private readonly UserService _userService;

        // 构造函数，接受一个 UserService 类型的参数并初始化 _userService 字段
        public UserController(UserService userService)
        {
            _userService = userService;
        }

        // HttpPost 特性指示此方法处理 HTTP POST 请求
        // "register" 是此操作的路由模板
        [HttpPost("register")]
        public async Task<IActionResult> Register(UserDto userDto)
        {
            try
            {
                // 调用 UserService 的 RegisterUser 方法注册用户
                await _userService.RegisterUser(userDto);
                // 如果注册成功，返回 200 OK 响应，并包含成功消息
                return Ok("User registered successfully");
            }
            catch (Exception ex)
            {
                // 如果发生异常，返回 400 Bad Request 响应，并包含错误信息
                return BadRequest(ex.Message);
            }
        }
    }
}
