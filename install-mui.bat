@echo off
echo Installing MUI dependencies...
echo.

cd ticketdashboard.client

echo Removing old dependencies...
call npm uninstall lucide-react

echo Installing MUI and related packages...
call npm install @mui/material@^6.1.9 @mui/icons-material@^6.1.9 @mui/lab@^6.0.0-beta.15 @mui/x-date-pickers@^7.22.2 @emotion/react@^11.13.5 @emotion/styled@^11.13.5 @mui/system@^6.1.9 date-fns@^4.1.0

if %ERRORLEVEL% NEQ 0 (
    echo Failed to install dependencies. Please check the errors above.
    pause
    exit /b 1
)

echo.
echo MUI dependencies installed successfully!
echo.
echo To start the development server:
echo 1. Start the backend: dotnet run --project ../TicketDashboard.Server
echo 2. Start the frontend: npm run dev
echo.
pause