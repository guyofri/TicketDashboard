using TicketDashboard.Application.DTOs;

namespace TicketDashboard.Application.Interfaces;

public interface IAuthService
{
    Task<AuthResultDto> LoginAsync(LoginDto loginDto);
    Task<AuthResultDto> RegisterAsync(RegisterDto registerDto);
    Task<bool> ValidateUserAsync(string username, string password);
    Task<UserDto?> GetCurrentUserAsync(string username);
}