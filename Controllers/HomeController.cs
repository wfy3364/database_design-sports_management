using System.Diagnostics; // 引入用于诊断和活动跟踪的命名空间
using Microsoft.AspNetCore.Mvc; // 引入 ASP.NET Core MVC 的命名空间
using sports_management.Models; // 引入自定义模型的命名空间

namespace sports_management.Controllers
{
    // HomeController 类继承自 Controller 类，处理与主页相关的请求
    public class HomeController : Controller
    {
        // 定义一个只读的 ILogger 类型字段，用于记录日志
        private readonly ILogger<HomeController> _logger;

        // 构造函数，接受一个 ILogger 类型的参数并初始化 _logger 字段
        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        // Index 动作方法，处理首页请求并返回视图
        public IActionResult Index()
        {
            return View(); // 返回默认的 Index 视图
        }

        // Privacy 动作方法，处理隐私政策页的请求并返回视图
        public IActionResult Privacy()
        {
            return View(); // 返回默认的 Privacy 视图
        }

        // Error 动作方法，用于处理错误页面的请求
        // ResponseCache 特性用于配置响应缓存策略
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            // 创建一个新的 ErrorViewModel 实例，并设置 RequestId
            // RequestId 是当前请求的唯一标识符，用于跟踪和记录错误
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
