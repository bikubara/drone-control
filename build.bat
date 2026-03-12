@echo off
REM Windows Batch build script for Drone Control App
setlocal enabledelayedexpansion

cls
echo.
echo ========================================
echo Drone Control App - Windows Build
echo ========================================
echo.

REM Check for Node.js
echo Checking for Node.js...
node --version >nul 2>&1
if !errorlevel! neq 0 (
    echo ERROR: Node.js not found. Install from https://nodejs.org
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do echo OK - Node.js found: %%i

REM Check for pnpm
echo Checking for pnpm...
pnpm --version >nul 2>&1
if !errorlevel! neq 0 (
    echo WARNING: pnpm not found, installing globally...
    call npm install -g pnpm
    if !errorlevel! neq 0 (
        echo ERROR: Failed to install pnpm
        pause
        exit /b 1
    )
)
for /f "tokens=*" %%i in ('pnpm --version') do echo OK - pnpm found: %%i

REM Install dependencies
echo.
echo Installing dependencies...
call pnpm install --prefer-offline --child-concurrency 2 --network-concurrency 6
if !errorlevel! neq 0 (
    echo ERROR: pnpm install failed
    pause
    exit /b 1
)
echo OK - Dependencies installed

REM Build frontend
echo.
echo Building frontend...
call pnpm --filter @caffeine/template-frontend build:skip-bindings
if !errorlevel! neq 0 (
    echo ERROR: Frontend build failed
    pause
    exit /b 1
)
echo OK - Frontend built

REM Image optimization
echo.
echo Running image optimization...
node scripts\prune-unused-images.js 2>nul
node scripts\resize-images.js 2>nul
echo OK - Image optimization complete

REM Create output directories
echo.
echo Setting up output directories...
if not exist "dist\frontend" mkdir dist\frontend
if not exist "dist\backend" mkdir dist\backend

REM Copy frontend
if exist "src\frontend\dist" (
    xcopy "src\frontend\dist\*" "dist\frontend\" /E /I /Y >nul
    echo OK - Frontend assets copied
) else (
    echo WARNING: Frontend dist not found
)

echo.
echo ========================================
echo Build complete!
echo Output directory: dist\
echo ========================================
echo.
pause
