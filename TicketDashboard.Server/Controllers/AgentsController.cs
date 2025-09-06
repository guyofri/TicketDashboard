using Microsoft.AspNetCore.Mvc;
using TicketDashboard.Application.DTOs;
using TicketDashboard.Application.Interfaces;

namespace TicketDashboard.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AgentsController : ControllerBase
{
    private readonly IAgentService _agentService;

    public AgentsController(IAgentService agentService)
    {
        _agentService = agentService;
    }

    /// <summary>
    /// Get all active agents
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<AgentDto>>> GetAgents()
    {
        var agents = await _agentService.GetAgentsAsync();
        return Ok(agents);
    }

    /// <summary>
    /// Get a specific agent by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<AgentDto>> GetAgent(int id)
    {
        var agent = await _agentService.GetAgentByIdAsync(id);
        if (agent == null)
            return NotFound($"Agent with ID {id} not found");

        return Ok(agent);
    }

    /// <summary>
    /// Create a new agent
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<AgentDto>> CreateAgent([FromBody] CreateAgentDto createAgentDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var agent = await _agentService.CreateAgentAsync(createAgentDto);
        return CreatedAtAction(nameof(GetAgent), new { id = agent.Id }, agent);
    }
}