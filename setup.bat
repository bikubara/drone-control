@echo off
REM Quick setup script for Drone Control App on Windows

echo.
echo ========================================
echo Drone Control App - Setup Wizard
echo ========================================
echo.

REM Check for Node.js
echo Checking for Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo ERROR: Node.js is not installed!
    echo.
    echo Please download and install Node.js LTS from:
    echo   https://nodejs.org/
    echo.
    echo Make sure to check "Add to PATH" during installation.
    echo After installation, restart this terminal.
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do (
    echo OK - Node.js %%i found
)
echo.

REM Check for pnpm
echo Checking for pnpm...
pnpm --version >nul 2>&1
if errorlevel 1 (
    echo Not found - installing pnpm globally...
    call npm install -g pnpm
    echo.
)

for /f "tokens=*" %%i in ('pnpm --version') do (
    echo OK - pnpm %%i ready
)
echo.

REM Install dependencies
echo Installing project dependencies...
echo This may take a few minutes on first run...
echo.
call pnpm install

if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo ========================================
echo Setup complete!
echo ========================================
echo.
echo Next steps:
echo   1. Run the build:  .\build.ps1
echo   2. Start frontend: cd src\frontend ^&^& pnpm run dev
echo   3. Open browser:   http://localhost:5173
echo.
pause
