@echo off
title VYRE Platform Launcher
echo Starting VYRE Cinema Platform...
echo.

:: Check if port 3000 is active
netstat -o -n -a | findstr "3000" >nul
if %ERRORLEVEL% equ 0 (
    echo VYRE server is already running! Opening browser...
    start http://localhost:3000
    exit
)

:: Start dev server in background and launch browser
echo Launching dev server on http://localhost:3000...
start "" /b npm run dev -- --port 3000
timeout /t 3 /nobreak >nul
start http://localhost:3000
echo VYRE is running!
