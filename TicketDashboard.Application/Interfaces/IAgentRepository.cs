using TicketDashboard.Domain.Entities;

namespace TicketDashboard.Application.Interfaces;

public interface IAgentRepository
{
    Task<IEnumerable<User>> GetAgentsAsync();
    Task<User?> GetAgentByIdAsync(int id);
    Task<User> CreateAgentAsync(User user);
}