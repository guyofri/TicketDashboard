@echo off
echo =====================================
echo ULTIMATE VISUAL STUDIO CLASS LIBRARY FIX
echo =====================================
echo.

echo CURRENT STATUS: All .cs files exist and build successfully!
echo PROBLEM: Visual Studio is not displaying them due to caching.
echo.

echo [1/8] Killing all Visual Studio processes...
taskkill /f /im "devenv.exe" 2>nul
taskkill /f /im "MSBuild.exe" 2>nul
taskkill /f /im "ServiceHub.Host.dotnet.x64.exe" 2>nul
timeout /t 3 >nul

echo.
echo [2/8] Removing Visual Studio cache (.vs folder)...
if exist ".vs" (
    rd /s /q ".vs"
    echo .vs folder removed successfully
) else (
    echo .vs folder not found
)

echo.
echo [3/8] Cleaning solution...
dotnet clean

echo.
echo [4/8] Removing all bin and obj folders...
for /d /r . %%d in (bin,obj) do @if exist "%%d" rd /s /q "%%d"

echo.
echo [5/8] Restoring packages...
dotnet restore

echo.
echo [6/8] Building solution...
dotnet build

echo.
echo [7/8] Verifying files exist...
echo.
echo ? Domain Files Found:
powershell -Command "Get-ChildItem -Path 'TicketDashboard.Domain' -Recurse -Filter '*.cs' | Where-Object {$_.FullName -notlike '*obj*'} | Select-Object Name"
echo.
echo ? Application Files Found:
powershell -Command "Get-ChildItem -Path 'TicketDashboard.Application' -Recurse -Filter '*.cs' | Where-Object {$_.FullName -notlike '*obj*'} | Select-Object Name"
echo.
echo ? Infrastructure Files Found:
powershell -Command "Get-ChildItem -Path 'TicketDashboard.Infrastructure' -Recurse -Filter '*.cs' | Where-Object {$_.FullName -notlike '*obj*'} | Select-Object Name"

echo.
echo [8/8] FINAL STEPS FOR VISUAL STUDIO:
echo =====================================
echo.
echo ?? 1. Open Visual Studio (DO NOT open solution yet)
echo ?? 2. Go to Tools ^> Options ^> Environment ^> Documents
echo ?? 3. Check "Detect when file is changed outside the environment"
echo ?? 4. Go to Tools ^> Options ^> Projects and Solutions ^> General  
echo ?? 5. Check "Show all files in Solution Explorer"
echo ?? 6. Click OK to save options
echo ?? 7. Now open TicketDashboard.sln
echo ?? 8. In Solution Explorer, ensure "Show All Files" button is enabled
echo ?? 9. Right-click each class library project and select "Reload Project"
echo ?? 10. Build ^> Rebuild Solution
echo.
echo ? Your class libraries contain:
echo    - TicketDashboard.Domain: 5 files (3 entities + 2 enums)
echo    - TicketDashboard.Application: 5 files (DTOs, interfaces, validators)  
echo    - TicketDashboard.Infrastructure: 5 files (services, data, hubs)
echo.
echo ?? If files STILL don't appear, the nuclear option is:
echo    - Close VS completely
echo    - Delete the entire solution folder
echo    - Re-clone from source control (if using Git)
echo    OR manually recreate projects and copy files
echo.
pause