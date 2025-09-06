using TicketDashboard.Domain.Entities;

namespace TicketDashboard.Application.Interfaces;

public interface ITokenService
{
    string GenerateJwtToken(User user);
    string GenerateRefreshToken();
    bool ValidateJwtToken(string token);
}