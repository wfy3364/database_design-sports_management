using Microsoft.AspNetCore.Hosting; // 引入 ASP.NET Core 主机构建功能的命名空间
using Microsoft.Extensions.Hosting; // 引入 .NET Core 主机扩展功能的命名空间

namespace sports_management
{
    // Program 类是应用程序的入口点
    public class Program
    {
        // 主方法，应用程序的执行入口
        public static void Main(string[] args)
        {
            // 创建主机构建器，构建并运行主机
            CreateHostBuilder(args).Build().Run();
        }

        // 创建并配置主机构建器
        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args) // 创建默认的主机构建器
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    // 配置 Web 主机并指定启动类
                    webBuilder.UseStartup<Startup>();
                });
    }
}
