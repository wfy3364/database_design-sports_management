namespace sports_management.Models
{
    public class Venue
    {
        public int Id { get; set; }
        public required string VenueName { get; set; }
        public required string Location { get; set; }
        public decimal PricePerHour { get; set; }
    }
}
