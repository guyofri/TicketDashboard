using Microsoft.AspNetCore.SignalR;

namespace TicketDashboard.Infrastructure.Hubs;

public class TicketHub : Hub
{
    public const string HubUrl = "/ticketHub";

    public async Task JoinTicketUpdates()
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, "TicketUpdates");
    }

    public async Task LeaveTicketUpdates()
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, "TicketUpdates");
    }

    public override async Task OnConnectedAsync()
    {
        // Automatically join the TicketUpdates group when connected
        await Groups.AddToGroupAsync(Context.ConnectionId, "TicketUpdates");
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, "TicketUpdates");
        await base.OnDisconnectedAsync(exception);
    }
}