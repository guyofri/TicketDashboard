@echo off
echo Starting Ticket Dashboard Development Environment...
echo.

echo [1/3] Cleaning previous builds...
dotnet clean TicketDashboard.sln

echo.
echo [2/3] Building solution...
dotnet build TicketDashboard.sln

if %ERRORLEVEL% NEQ 0 (
    echo Build failed. Please check the errors above.
    pause
    exit /b 1
)

echo.
echo [3/3] Starting the application...
echo Backend will start at: https://localhost:7154
echo Frontend will start at: http://localhost:5173
echo Swagger documentation: https://localhost:7154/swagger
echo.
echo Press Ctrl+C to stop the servers
echo.

start "Backend Server" cmd /k "dotnet run --project TicketDashboard.Server"
timeout /t 5 /nobreak >nul
start "Frontend Server" cmd /k "cd ticketdashboard.client && npm run dev"

echo.
echo Both servers are starting...
echo Check the opened terminal windows for status.
echo.
pause