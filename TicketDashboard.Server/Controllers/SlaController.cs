using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TicketDashboard.Application.DTOs;
using TicketDashboard.Application.Interfaces;

namespace TicketDashboard.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SlaController : ControllerBase
{
    private readonly ISlaService _slaService;

    public SlaController(ISlaService slaService)
    {
        _slaService = slaService;
    }

    /// <summary>
    /// Get all active SLAs
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<SlaDto>>> GetSlas()
    {
        var slas = await _slaService.GetAllSlasAsync();
        return Ok(slas);
    }

    /// <summary>
    /// Get SLA by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<SlaDto>> GetSla(int id)
    {
        var sla = await _slaService.GetSlaByIdAsync(id);
        if (sla == null)
            return NotFound($"SLA with ID {id} not found");

        return Ok(sla);
    }

    /// <summary>
    /// Create a new SLA
    /// </summary>
    [HttpPost]
    [Authorize(Policy = "AdminPolicy")]
    public async Task<ActionResult<SlaDto>> CreateSla([FromBody] CreateSlaDto createSlaDto)
    {
        var sla = await _slaService.CreateSlaAsync(createSlaDto);
        return CreatedAtAction(nameof(GetSla), new { id = sla.Id }, sla);
    }

    /// <summary>
    /// Update an existing SLA
    /// </summary>
    [HttpPut("{id}")]
    [Authorize(Policy = "AdminPolicy")]
    public async Task<ActionResult<SlaDto>> UpdateSla(int id, [FromBody] CreateSlaDto updateSlaDto)
    {
        var sla = await _slaService.UpdateSlaAsync(id, updateSlaDto);
        if (sla == null)
            return NotFound($"SLA with ID {id} not found");

        return Ok(sla);
    }

    /// <summary>
    /// Delete an SLA
    /// </summary>
    [HttpDelete("{id}")]
    [Authorize(Policy = "AdminPolicy")]
    public async Task<ActionResult> DeleteSla(int id)
    {
        var result = await _slaService.DeleteSlaAsync(id);
        if (!result)
            return NotFound($"SLA with ID {id} not found");

        return NoContent();
    }

    /// <summary>
    /// Get SLA violations
    /// </summary>
    [HttpGet("violations")]
    public async Task<ActionResult<IEnumerable<SlaViolationDto>>> GetViolations(
        [FromQuery] int? ticketId = null,
        [FromQuery] bool includeResolved = true)
    {
        var violations = await _slaService.GetSlaViolationsAsync(ticketId, includeResolved);
        return Ok(violations);
    }

    /// <summary>
    /// Check and create SLA violations for a ticket
    /// </summary>
    [HttpPost("violations/check/{ticketId}")]
    [Authorize(Policy = "AgentPolicy")]
    public async Task<ActionResult> CheckSlaViolations(int ticketId)
    {
        await _slaService.CheckAndCreateSlaViolationsAsync(ticketId);
        return Ok();
    }
}