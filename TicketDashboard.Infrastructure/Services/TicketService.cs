using AutoMapper;
using Microsoft.EntityFrameworkCore;
using TicketDashboard.Application.DTOs;
using TicketDashboard.Application.Interfaces;
using TicketDashboard.Domain.Entities;

namespace TicketDashboard.Infrastructure.Services;

public class TicketService : ITicketService
{
    private readonly ITicketRepository _ticketRepository;
    private readonly IUserRepository _userRepository;
    private readonly IMapper _mapper;

    public TicketService(
        ITicketRepository ticketRepository,
        IUserRepository userRepository,
        IMapper mapper)
    {
        _ticketRepository = ticketRepository;
        _userRepository = userRepository;
        _mapper = mapper;
    }

    public async Task<PagedResult<TicketDto>> GetTicketsAsync(TicketFilterDto filter)
    {
        var query = await _ticketRepository.GetTicketsQueryAsync();

        // Apply filters
        if (filter.Status.HasValue)
            query = query.Where(t => t.Status == filter.Status.Value);

        if (filter.Priority.HasValue)
            query = query.Where(t => t.Priority == filter.Priority.Value);

        if (filter.AssignedToId.HasValue)
            query = query.Where(t => t.AssignedToId == filter.AssignedToId.Value);

        if (!string.IsNullOrWhiteSpace(filter.Search))
        {
            var searchTerm = filter.Search.ToLower();
            query = query.Where(t => 
                t.Title.ToLower().Contains(searchTerm) ||
                t.Description.ToLower().Contains(searchTerm) ||
                t.CreatedBy.FirstName.ToLower().Contains(searchTerm) ||
                t.CreatedBy.LastName.ToLower().Contains(searchTerm));
        }

        // Apply sorting
        if (!string.IsNullOrWhiteSpace(filter.SortBy))
        {
            switch (filter.SortBy.ToLower())
            {
                case "title":
                    query = filter.SortDirection?.ToLower() == "desc" 
                        ? query.OrderByDescending(t => t.Title)
                        : query.OrderBy(t => t.Title);
                    break;
                case "priority":
                    query = filter.SortDirection?.ToLower() == "desc" 
                        ? query.OrderByDescending(t => t.Priority)
                        : query.OrderBy(t => t.Priority);
                    break;
                case "status":
                    query = filter.SortDirection?.ToLower() == "desc" 
                        ? query.OrderByDescending(t => t.Status)
                        : query.OrderBy(t => t.Status);
                    break;
                case "createdat":
                default:
                    query = filter.SortDirection?.ToLower() == "desc" 
                        ? query.OrderByDescending(t => t.CreatedAt)
                        : query.OrderBy(t => t.CreatedAt);
                    break;
            }
        }
        else
        {
            query = query.OrderByDescending(t => t.CreatedAt);
        }

        // Get total count
        var totalCount = await query.CountAsync();

        // Apply pagination
        var page = filter.Page ?? 1;
        var pageSize = filter.PageSize ?? 10;
        var skip = (page - 1) * pageSize;

        var tickets = await query
            .Skip(skip)
            .Take(pageSize)
            .ToListAsync();

        var ticketDtos = _mapper.Map<List<TicketDto>>(tickets);

        return new PagedResult<TicketDto>
        {
            Items = ticketDtos,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize,
            TotalPages = (int)Math.Ceiling((double)totalCount / pageSize)
        };
    }

    public async Task<TicketDto?> GetTicketByIdAsync(int id)
    {
        var ticket = await _ticketRepository.GetByIdAsync(id);
        return ticket != null ? _mapper.Map<TicketDto>(ticket) : null;
    }

    public async Task<TicketDto> CreateTicketAsync(CreateTicketDto createTicketDto, int userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
            throw new ArgumentException("Invalid user ID");

        var ticket = _mapper.Map<Ticket>(createTicketDto);
        ticket.CreatedById = userId;
        ticket.CreatedAt = DateTime.UtcNow;
        ticket.UpdatedAt = DateTime.UtcNow;

        var createdTicket = await _ticketRepository.CreateAsync(ticket);
        return _mapper.Map<TicketDto>(createdTicket);
    }

    public async Task<TicketDto?> UpdateTicketAsync(int id, UpdateTicketDto updateTicketDto)
    {
        var ticket = await _ticketRepository.GetByIdAsync(id);
        if (ticket == null)
            return null;

        _mapper.Map(updateTicketDto, ticket);
        ticket.UpdatedAt = DateTime.UtcNow;

        var updatedTicket = await _ticketRepository.UpdateAsync(ticket);
        return updatedTicket != null ? _mapper.Map<TicketDto>(updatedTicket) : null;
    }

    public async Task<bool> DeleteTicketAsync(int id)
    {
        return await _ticketRepository.DeleteAsync(id);
    }

    public async Task<IEnumerable<TicketCommentDto>> GetTicketCommentsAsync(int ticketId)
    {
        var comments = await _ticketRepository.GetCommentsAsync(ticketId);
        return _mapper.Map<IEnumerable<TicketCommentDto>>(comments);
    }

    public async Task<TicketCommentDto> AddCommentAsync(CreateTicketCommentDto createCommentDto, int userId)
    {
        var comment = _mapper.Map<TicketComment>(createCommentDto);
        comment.AuthorId = userId;
        comment.CreatedAt = DateTime.UtcNow;

        var createdComment = await _ticketRepository.AddCommentAsync(comment);
        return _mapper.Map<TicketCommentDto>(createdComment);
    }
}