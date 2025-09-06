using AutoMapper;
using TicketDashboard.Application.DTOs;
using TicketDashboard.Application.Interfaces;
using TicketDashboard.Domain.Entities;
using Microsoft.AspNetCore.Identity;

namespace TicketDashboard.Infrastructure.Services;

public class AgentService : IAgentService
{
    private readonly IAgentRepository _agentRepository;
    private readonly IMapper _mapper;
    private readonly IPasswordHasher<User> _passwordHasher;

    public AgentService(
        IAgentRepository agentRepository,
        IMapper mapper,
        IPasswordHasher<User> passwordHasher)
    {
        _agentRepository = agentRepository;
        _mapper = mapper;
        _passwordHasher = passwordHasher;
    }

    public async Task<IEnumerable<AgentDto>> GetAgentsAsync()
    {
        var agents = await _agentRepository.GetAgentsAsync();
        return _mapper.Map<IEnumerable<AgentDto>>(agents);
    }

    public async Task<AgentDto?> GetAgentByIdAsync(int id)
    {
        var agent = await _agentRepository.GetAgentByIdAsync(id);
        return agent != null ? _mapper.Map<AgentDto>(agent) : null;
    }

    public async Task<AgentDto> CreateAgentAsync(CreateAgentDto createAgentDto)
    {
        var user = _mapper.Map<User>(createAgentDto);
        user.Role = "Agent";
        user.IsActive = true;
        user.CreatedAt = DateTime.UtcNow;
        user.PasswordHash = _passwordHasher.HashPassword(user, createAgentDto.Password);

        var createdAgent = await _agentRepository.CreateAgentAsync(user);
        return _mapper.Map<AgentDto>(createdAgent);
    }
}