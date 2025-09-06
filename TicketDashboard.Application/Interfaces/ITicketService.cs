using TicketDashboard.Application.DTOs;

namespace TicketDashboard.Application.Interfaces;

public interface ITicketService
{
    Task<PagedResult<TicketDto>> GetTicketsAsync(TicketFilterDto filter);
    Task<TicketDto?> GetTicketByIdAsync(int id);
    Task<TicketDto> CreateTicketAsync(CreateTicketDto createTicketDto, int userId);
    Task<TicketDto?> UpdateTicketAsync(int id, UpdateTicketDto updateTicketDto);
    Task<bool> DeleteTicketAsync(int id);
    Task<IEnumerable<TicketCommentDto>> GetTicketCommentsAsync(int ticketId);
    Task<TicketCommentDto> AddCommentAsync(CreateTicketCommentDto createCommentDto, int userId);
}