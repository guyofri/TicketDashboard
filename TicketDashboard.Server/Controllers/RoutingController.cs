using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TicketDashboard.Application.DTOs;
using TicketDashboard.Application.Interfaces;

namespace TicketDashboard.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class RoutingController : ControllerBase
{
    private readonly ITicketRoutingService _routingService;

    public RoutingController(ITicketRoutingService routingService)
    {
        _routingService = routingService;
    }

    /// <summary>
    /// Get all routing rules
    /// </summary>
    [HttpGet("rules")]
    [Authorize(Policy = "AgentPolicy")]
    public async Task<ActionResult<IEnumerable<RoutingRuleDto>>> GetRules()
    {
        var rules = await _routingService.GetAllRulesAsync();
        return Ok(rules);
    }

    /// <summary>
    /// Get routing rule by ID
    /// </summary>
    [HttpGet("rules/{id}")]
    [Authorize(Policy = "AgentPolicy")]
    public async Task<ActionResult<RoutingRuleDto>> GetRule(int id)
    {
        var rule = await _routingService.GetRuleByIdAsync(id);
        if (rule == null)
            return NotFound($"Routing rule with ID {id} not found");

        return Ok(rule);
    }

    /// <summary>
    /// Create a new routing rule
    /// </summary>
    [HttpPost("rules")]
    [Authorize(Policy = "AdminPolicy")]
    public async Task<ActionResult<RoutingRuleDto>> CreateRule([FromBody] CreateRoutingRuleDto createRuleDto)
    {
        var rule = await _routingService.CreateRuleAsync(createRuleDto);
        return CreatedAtAction(nameof(GetRule), new { id = rule.Id }, rule);
    }

    /// <summary>
    /// Update an existing routing rule
    /// </summary>
    [HttpPut("rules/{id}")]
    [Authorize(Policy = "AdminPolicy")]
    public async Task<ActionResult<RoutingRuleDto>> UpdateRule(int id, [FromBody] CreateRoutingRuleDto updateRuleDto)
    {
        var rule = await _routingService.UpdateRuleAsync(id, updateRuleDto);
        if (rule == null)
            return NotFound($"Routing rule with ID {id} not found");

        return Ok(rule);
    }

    /// <summary>
    /// Delete a routing rule
    /// </summary>
    [HttpDelete("rules/{id}")]
    [Authorize(Policy = "AdminPolicy")]
    public async Task<ActionResult> DeleteRule(int id)
    {
        var result = await _routingService.DeleteRuleAsync(id);
        if (!result)
            return NotFound($"Routing rule with ID {id} not found");

        return NoContent();
    }

    /// <summary>
    /// Process routing for a specific ticket
    /// </summary>
    [HttpPost("process/{ticketId}")]
    [Authorize(Policy = "AgentPolicy")]
    public async Task<ActionResult> ProcessTicketRouting(int ticketId)
    {
        var applied = await _routingService.ProcessTicketRoutingAsync(ticketId);
        return Ok(new { applied, ticketId });
    }

    /// <summary>
    /// Get routing logs
    /// </summary>
    [HttpGet("logs")]
    [Authorize(Policy = "AgentPolicy")]
    public async Task<ActionResult<IEnumerable<RoutingLogDto>>> GetLogs([FromQuery] int? ticketId = null)
    {
        var logs = await _routingService.GetRoutingLogsAsync(ticketId);
        return Ok(logs);
    }
}