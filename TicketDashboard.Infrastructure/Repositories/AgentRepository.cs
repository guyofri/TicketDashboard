using Microsoft.EntityFrameworkCore;
using TicketDashboard.Application.Interfaces;
using TicketDashboard.Domain.Entities;
using TicketDashboard.Infrastructure.Data;

namespace TicketDashboard.Infrastructure.Repositories;

public class AgentRepository : IAgentRepository
{
    private readonly TicketDbContext _context;

    public AgentRepository(TicketDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<User>> GetAgentsAsync()
    {
        return await _context.Users
            .Where(u => u.Role == "Agent" || u.Role == "Admin")
            .Where(u => u.IsActive)
            .ToListAsync();
    }

    public async Task<User?> GetAgentByIdAsync(int id)
    {
        return await _context.Users
            .Where(u => u.Id == id && (u.Role == "Agent" || u.Role == "Admin"))
            .FirstOrDefaultAsync();
    }

    public async Task<User> CreateAgentAsync(User user)
    {
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return user;
    }
}