namespace sports_management.DTOs
{
    public class UserDto
    {
        public required string UserName { get; set; }
        public required string Password { get; set; }
        public required string PhoneNumber { get; set; }
        public required string UserType { get; set; }
    }
}
