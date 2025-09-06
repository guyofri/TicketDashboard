@echo off
echo =====================================
echo FORCE VISUAL STUDIO PROJECT REFRESH
echo =====================================
echo.

echo [1/6] Closing any Visual Studio processes...
taskkill /f /im "devenv.exe" 2>nul
taskkill /f /im "MSBuild.exe" 2>nul
timeout /t 2 >nul

echo.
echo [2/6] Cleaning solution...
dotnet clean

echo.
echo [3/6] Removing all bin and obj folders...
for /d /r . %%d in (bin,obj) do @if exist "%%d" rd /s /q "%%d"

echo.
echo [4/6] Restoring packages...
dotnet restore

echo.
echo [5/6] Building solution...
dotnet build

echo.
echo [6/6] Verification - Listing actual .cs files...
echo.
echo Domain Layer Files:
dir /s /b TicketDashboard.Domain\*.cs
echo.
echo Application Layer Files:
dir /s /b TicketDashboard.Application\*.cs
echo.
echo Infrastructure Layer Files:
dir /s /b TicketDashboard.Infrastructure\*.cs

echo.
echo =====================================
echo MANUAL STEPS FOR VISUAL STUDIO:
echo =====================================
echo 1. Open Visual Studio as Administrator
echo 2. Open TicketDashboard.sln
echo 3. Go to Tools ^> Options ^> Projects and Solutions ^> General
echo 4. Check "Show all files" option
echo 5. In Solution Explorer, click "Show All Files" button
echo 6. Right-click each class library project
echo 7. Select "Reload Project"
echo 8. Build ^> Clean Solution
echo 9. Build ^> Rebuild Solution
echo.
echo If files still don't appear:
echo 10. Close Visual Studio
echo 11. Delete .vs folder in solution directory
echo 12. Reopen Visual Studio and solution
echo.
pause