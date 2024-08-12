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
    public class ReservationController : ControllerBase
    {
        // 定义一个只读的 ReservationService 类型字段，用于处理预订相关操作
        private readonly ReservationService _reservationService;

        // 构造函数，接受一个 ReservationService 类型的参数并初始化 _reservationService 字段
        public ReservationController(ReservationService reservationService)
        {
            _reservationService = reservationService;
        }

        // HttpPost 特性指示此方法处理 HTTP POST 请求
        // "reserve" 是此操作的路由模板
        [HttpPost("reserve")]
        public async Task<IActionResult> Reserve(ReservationDto reservationDto)
        {
            try
            {
                // 调用 ReservationService 的 MakeReservation 方法进行预订
                var reservation = await _reservationService.MakeReservation(reservationDto);
                // 如果预订成功，返回 200 OK 响应，并包含预订对象
                return Ok(reservation);
            }
            catch (Exception ex)
            {
                // 如果发生异常，返回 400 Bad Request 响应，并包含错误信息
                return BadRequest(ex.Message);
            }
        }

        // HttpPost 特性指示此方法处理 HTTP POST 请求
        // "cancel" 是此操作的路由模板
        [HttpPost("cancel")]
        public async Task<IActionResult> Cancel(int reservationId)
        {
            try
            {
                // 调用 ReservationService 的 CancelReservation 方法取消预订
                await _reservationService.CancelReservation(reservationId);
                // 如果取消成功，返回 200 OK 响应，并包含成功消息
                return Ok("Reservation cancelled successfully");
            }
            catch (Exception ex)
            {
                // 如果发生异常，返回 400 Bad Request 响应，并包含错误信息
                return BadRequest(ex.Message);
            }
        }
    }
}
