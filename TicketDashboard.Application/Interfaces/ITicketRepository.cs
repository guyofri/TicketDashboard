using TicketDashboard.Domain.Entities;

namespace TicketDashboard.Application.Interfaces;

public interface ITicketRepository
{
    Task<IQueryable<Ticket>> GetTicketsQueryAsync();
    Task<Ticket?> GetByIdAsync(int id);
    Task<Ticket> CreateAsync(Ticket ticket);
    Task<Ticket?> UpdateAsync(Ticket ticket);
    Task<bool> DeleteAsync(int id);
    Task<IEnumerable<TicketComment>> GetCommentsAsync(int ticketId);
    Task<TicketComment> AddCommentAsync(TicketComment comment);
}