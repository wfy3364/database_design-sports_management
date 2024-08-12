using sports_management.Data; // 引入数据上下文的命名空间
using sports_management.DTOs; // 引入数据传输对象（DTOs）的命名空间
using sports_management.Models; // 引入自定义模型的命名空间
using System; // 引入系统命名空间，用于访问基本的 .NET 类型和功能
using System.Threading.Tasks; // 引入用于异步编程的命名空间

namespace sports_management.Services
{
    // ReservationService 类提供了处理预订相关业务逻辑的方法
    public class ReservationService
    {
        // 定义一个只读的 ApplicationDbContext 类型字段，用于与数据库进行交互
        private readonly ApplicationDbContext _context;

        // 构造函数，接受一个 ApplicationDbContext 类型的参数并初始化 _context 字段
        public ReservationService(ApplicationDbContext context)
        {
            _context = context;
        }

        // 异步方法，用于创建预订
        public async Task<Reservation> MakeReservation(ReservationDto reservationDto)
        {
            // 查找指定 ID 的场馆
            var venue = await _context.Venues.FindAsync(reservationDto.VenueId);
            if (venue == null) throw new Exception("Venue not found");

            // 查找指定 ID 的用户
            var user = await _context.Users.FindAsync(reservationDto.UserId);
            if (user == null) throw new Exception("User not found");

            // 计算预订时长（以小时为单位）
            var durationInHours = (decimal)((reservationDto.EndTime - reservationDto.StartTime).TotalHours);
            // 计算预订价格
            var price = durationInHours * venue.PricePerHour;

            // 创建新的 Reservation 实例并设置其属性
            var reservation = new Reservation
            {
                UserId = reservationDto.UserId,
                VenueId = reservationDto.VenueId,
                StartTime = reservationDto.StartTime,
                EndTime = reservationDto.EndTime,
                ReservationDate = DateTime.Now,
                Status = "Active",
                Price = price,
                User = user,  // 设置关联的 User 实体
                Venue = venue  // 设置关联的 Venue 实体
            };

            // 将新的预订添加到数据库上下文中
            _context.Reservations.Add(reservation);
            // 保存更改到数据库
            await _context.SaveChangesAsync();

            // 返回创建的预订对象
            return reservation;
        }

        // 异步方法，用于取消预订
        public async Task CancelReservation(int reservationId)
        {
            // 查找指定 ID 的预订
            var reservation = await _context.Reservations.FindAsync(reservationId);
            if (reservation == null) throw new Exception("Reservation not found");

            // 修改预订状态为 "Cancelled"
            reservation.Status = "Cancelled";
            // 保存更改到数据库
            await _context.SaveChangesAsync();
        }
    }
}
