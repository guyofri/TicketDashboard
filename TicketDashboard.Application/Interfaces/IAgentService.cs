using TicketDashboard.Application.DTOs;

namespace TicketDashboard.Application.Interfaces;

public interface IAgentService
{
    Task<IEnumerable<AgentDto>> GetAgentsAsync();
    Task<AgentDto?> GetAgentByIdAsync(int id);
    Task<AgentDto> CreateAgentAsync(CreateAgentDto createAgentDto);
}