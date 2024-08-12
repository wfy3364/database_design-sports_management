using System;

namespace sports_management.Models
{
    public class Reservation
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int VenueId { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public DateTime ReservationDate { get; set; }
        public required string Status { get; set; }
        public decimal Price { get; set; }

        public required User User { get; set; }
        public required Venue Venue { get; set; }

    }
}
