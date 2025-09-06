#!/usr/bin/env pwsh

Write-Host "Starting Ticket Dashboard Development Environment..." -ForegroundColor Green
Write-Host

Write-Host "[1/3] Cleaning previous builds..." -ForegroundColor Yellow
dotnet clean TicketDashboard.sln

Write-Host
Write-Host "[2/3] Building solution..." -ForegroundColor Yellow
dotnet build TicketDashboard.sln

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed. Please check the errors above." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host
Write-Host "[3/3] Starting the application..." -ForegroundColor Yellow
Write-Host "Backend will start at: https://localhost:7154" -ForegroundColor Cyan
Write-Host "Frontend will start at: http://localhost:5173" -ForegroundColor Cyan
Write-Host "Swagger documentation: https://localhost:7154/swagger" -ForegroundColor Cyan
Write-Host
Write-Host "Press Ctrl+C to stop the servers" -ForegroundColor Yellow
Write-Host

# Start backend in new window
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "dotnet run --project TicketDashboard.Server" -WindowStyle Normal

# Wait a bit for backend to start
Start-Sleep -Seconds 5

# Start frontend in new window
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd ticketdashboard.client; npm run dev" -WindowStyle Normal

Write-Host
Write-Host "Both servers are starting..." -ForegroundColor Green
Write-Host "Check the opened terminal windows for status." -ForegroundColor Green
Write-Host

Read-Host "Press Enter to exit this window"