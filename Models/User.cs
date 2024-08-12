using System;

namespace sports_management.Models
{
    public class User
    {
        public int Id { get; set; }
        public required string UserName { get; set; }
        public required string Password { get; set; }
        public required string PhoneNumber { get; set; }
        public required string UserType { get; set; }
        public DateTime RegistrationDate { get; set; }
    }
}
