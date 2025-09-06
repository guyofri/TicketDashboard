#!/bin/bash

echo "Installing MUI dependencies..."

cd ticketdashboard.client

# Remove old dependencies
npm uninstall lucide-react

# Install MUI and related packages
npm install @mui/material@^6.1.9 @mui/icons-material@^6.1.9 @mui/lab@^6.0.0-beta.15 @mui/x-date-pickers@^7.22.2 @emotion/react@^11.13.5 @emotion/styled@^11.13.5 @mui/system@^6.1.9 date-fns@^4.1.0

echo "MUI dependencies installed successfully!"
echo ""
echo "To start the development server:"
echo "1. Start the backend: dotnet run --project ../TicketDashboard.Server"
echo "2. Start the frontend: npm run dev"