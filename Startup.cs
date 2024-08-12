using Microsoft.AspNetCore.Builder; // 引入 ASP.NET Core 应用程序构建功能的命名空间
using Microsoft.AspNetCore.Hosting; // 引入 ASP.NET Core 主机功能的命名空间
using Microsoft.Extensions.Configuration; // 引入配置功能的命名空间
using Microsoft.Extensions.DependencyInjection; // 引入服务注入功能的命名空间
using Microsoft.Extensions.Hosting; // 引入主机扩展功能的命名空间
using Microsoft.EntityFrameworkCore; // 引入 Entity Framework Core 功能的命名空间
using sports_management.Data; // 引入数据上下文的命名空间
using sports_management.Services; // 引入服务层的命名空间

namespace sports_management
{
    // Startup 类用于配置应用程序的服务和请求处理管道
    public class Startup
    {
        // 构造函数，接受 IConfiguration 类型的参数并初始化 Configuration 属性
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        // 配置属性，用于访问应用程序的配置
        public IConfiguration Configuration { get; }

        // 配置服务容器的方法
        public void ConfigureServices(IServiceCollection services)
        {
            // 配置 Entity Framework Core 使用 SQL Server 数据库
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));

            // 注册 UserService 服务
            services.AddScoped<UserService>();
            // 注册 ReservationService 服务
            services.AddScoped<ReservationService>();

            // 注册控制器服务
            services.AddControllers();
        }

        // 配置 HTTP 请求处理管道的方法
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            // 根据环境配置不同的异常处理
            if (env.IsDevelopment())
            {
                // 在开发环境中使用开发者异常页面
                app.UseDeveloperExceptionPage();
            }
            else
            {
                // 在生产环境中使用通用异常处理页面
                app.UseExceptionHandler("/Home/Error");
                // 启用 HTTP 严格传输安全（HSTS）
                app.UseHsts();
            }

            // 启用 HTTPS 重定向
            app.UseHttpsRedirection();
            // 启用请求路由
            app.UseRouting();
            // 启用授权功能
            app.UseAuthorization();
            // 配置终结点路由
            app.UseEndpoints(endpoints =>
            {
                // 映射控制器终结点
                endpoints.MapControllers();
            });
        }
    }
}
