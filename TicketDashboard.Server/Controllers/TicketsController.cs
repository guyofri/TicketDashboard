using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;
using TicketDashboard.Application.DTOs;
using TicketDashboard.Application.Interfaces;
using TicketDashboard.Infrastructure.Hubs;

namespace TicketDashboard.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TicketsController : ControllerBase
{
    private readonly ITicketService _ticketService;
    private readonly IHubContext<TicketHub> _hubContext;

    public TicketsController(
        ITicketService ticketService,
        IHubContext<TicketHub> hubContext)
    {
        _ticketService = ticketService;
        _hubContext = hubContext;
    }

    [HttpGet]
    public async Task<ActionResult<PagedResult<TicketDto>>> GetTickets([FromQuery] TicketFilterDto filter)
    {
        var tickets = await _ticketService.GetTicketsAsync(filter);
        return Ok(tickets);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TicketDto>> GetTicket(int id)
    {
        var ticket = await _ticketService.GetTicketByIdAsync(id);
        if (ticket == null)
            return NotFound($"Ticket with ID {id} not found");

        return Ok(ticket);
    }

    [HttpPost]
    public async Task<ActionResult<TicketDto>> CreateTicket([FromBody] CreateTicketDto createTicketDto)
    {
        var userId = GetCurrentUserId();
        var ticket = await _ticketService.CreateTicketAsync(createTicketDto, userId);

        // Notify all connected clients about the new ticket
        await _hubContext.Clients.Group("TicketUpdates").SendAsync("TicketCreated", ticket);

        return CreatedAtAction(nameof(GetTicket), new { id = ticket.Id }, ticket);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<TicketDto>> UpdateTicket(int id, [FromBody] UpdateTicketDto updateTicketDto)
    {
        var ticket = await _ticketService.UpdateTicketAsync(id, updateTicketDto);
        if (ticket == null)
            return NotFound($"Ticket with ID {id} not found");

        // Notify all connected clients about the updated ticket
        await _hubContext.Clients.Group("TicketUpdates").SendAsync("TicketUpdated", ticket);

        return Ok(ticket);
    }

    [HttpDelete("{id}")]
    [Authorize(Policy = "AdminPolicy")]
    public async Task<ActionResult> DeleteTicket(int id)
    {
        var result = await _ticketService.DeleteTicketAsync(id);
        if (!result)
            return NotFound($"Ticket with ID {id} not found");

        // Notify all connected clients about the deleted ticket
        await _hubContext.Clients.Group("TicketUpdates").SendAsync("TicketDeleted", new { ticketId = id });

        return NoContent();
    }

    [HttpGet("{id}/comments")]
    public async Task<ActionResult<IEnumerable<TicketCommentDto>>> GetTicketComments(int id)
    {
        var comments = await _ticketService.GetTicketCommentsAsync(id);
        return Ok(comments);
    }

    [HttpPost("comments")]
    public async Task<ActionResult<TicketCommentDto>> AddComment([FromBody] CreateTicketCommentDto createCommentDto)
    {
        var userId = GetCurrentUserId();
        var comment = await _ticketService.AddCommentAsync(createCommentDto, userId);

        // Notify all connected clients about the new comment
        await _hubContext.Clients.Group("TicketUpdates").SendAsync("CommentAdded", comment);

        return CreatedAtAction(nameof(GetTicketComments), new { id = createCommentDto.TicketId }, comment);
    }

    private int GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (int.TryParse(userIdClaim, out var userId))
            return userId;

        throw new UnauthorizedAccessException("User ID not found in token");
    }
}