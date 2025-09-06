    private static Task<bool> EvaluateCondition(Ticket ticket, RoutingCondition condition)
    {
        var result = condition.Type switch
        {
            RoutingConditionType.ContainsKeyword => 
                ticket.Title.Contains(condition.Value, StringComparison.OrdinalIgnoreCase) ||
                ticket.Description.Contains(condition.Value, StringComparison.OrdinalIgnoreCase),
            
            RoutingConditionType.Priority => 
                ticket.Priority.ToString().Equals(condition.Value, StringComparison.OrdinalIgnoreCase),
            
            RoutingConditionType.CustomerEmail => 
                !string.IsNullOrEmpty(ticket.CustomerEmail) &&
                ticket.CustomerEmail.Contains(condition.Value, StringComparison.OrdinalIgnoreCase),
            
            RoutingConditionType.TimeOfDay => 
                EvaluateTimeOfDayCondition(condition.Value),
            
            RoutingConditionType.DayOfWeek => 
                DateTime.UtcNow.DayOfWeek.ToString().Equals(condition.Value, StringComparison.OrdinalIgnoreCase),
            
            _ => false
        };

        return Task.FromResult(result);
    }