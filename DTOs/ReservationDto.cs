namespace sports_management.DTOs
{
    public class ReservationDto
    {
        public int UserId { get; set; }
        public int VenueId { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
    }
}
