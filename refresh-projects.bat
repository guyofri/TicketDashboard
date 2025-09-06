@echo off
echo Refreshing Visual Studio project view...
echo.

echo [1/4] Cleaning solution...
dotnet clean

echo.
echo [2/4] Restoring packages...
dotnet restore

echo.
echo [3/4] Building solution...
dotnet build

echo.
echo [4/4] Complete! 
echo.
echo Instructions to refresh Visual Studio:
echo 1. Close Visual Studio completely
echo 2. Reopen TicketDashboard.sln
echo 3. Right-click solution in Solution Explorer
echo 4. Select "Reload Projects"
echo 5. Build -> Rebuild Solution
echo.

echo Class Library Contents Summary:
echo ==============================
echo.
echo TicketDashboard.Domain:
echo   - Entities/ (Agent.cs, Ticket.cs, TicketComment.cs)
echo   - Enums/ (AgentEnums.cs, TicketEnums.cs)
echo.
echo TicketDashboard.Application:
echo   - DTOs/ (AgentDto.cs, TicketDto.cs, TicketCommentDto.cs)
echo   - Interfaces/ (IServices.cs)
echo   - Validators/ (DtoValidators.cs)
echo   - Extensions/ (DependencyInjection.cs)
echo.
echo TicketDashboard.Infrastructure:
echo   - Data/ (TicketDbContext.cs)
echo   - Services/ (AgentService.cs, TicketService.cs)
echo   - Hubs/ (TicketHub.cs)
echo   - Extensions/ (DependencyInjection.cs)
echo.
pause