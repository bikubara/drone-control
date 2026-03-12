@echo off
setlocal enabledelayedexpansion

echo.
echo === Drone Control App - Environment Setup ===
echo.

REM Add Node.js to PATH permanently for this session
set "PATH=C:\Program Files\nodejs;%PATH%"

echo Checking Node.js...
node --version
if errorlevel 1 (
    echo ERROR: Node.js not found
    pause
    exit /b 1
)

echo.
echo Checking npm...
npm --version

echo.
echo Installing pnpm globally...
npm install -g pnpm

echo.
echo Checking pnpm...
pnpm --version

echo.
echo ========================================
echo Installing project dependencies...
echo ========================================
echo.

cd /d c:\Users\thinkpad\Desktop\CODE\drone-control
pnpm install

if errorlevel 1 (
    echo.
    echo ERROR: pnpm install failed
    pause
    exit /b 1
)

echo.
echo ========================================
echo Building frontend...
echo ========================================
echo.

pnpm --filter '@caffeine/template-frontend' build:skip-bindings

if errorlevel 1 (
    echo.
    echo ERROR: Frontend build failed
    pause
    exit /b 1
)

echo.
echo ========================================
echo Setup complete!
echo ========================================
echo.
echo Next steps:
echo   1. Start the dev server: cd src\frontend ^& pnpm run dev
echo   2. Open browser: http://localhost:5173
echo.
pause
