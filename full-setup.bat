@echo off
REM Complete setup and build for Drone Control App
setlocal enabledelayedexpansion

set "NODEJS_PATH=C:\Program Files\nodejs"
set "PATH=%NODEJS_PATH%;%PATH%"

echo.
echo ==========================================
echo Drone Control App - Full Setup & Build
echo ==========================================
echo.

REM Verify Node.js
echo Checking Node.js...
"%NODEJS_PATH%\node.exe" --version
if !errorlevel! neq 0 (
    echo ERROR: Node.js not found at %NODEJS_PATH%
    pause
    exit /b 1
)

REM Verify npm
echo Checking npm...
"%NODEJS_PATH%\npm.cmd" --version

REM Install pnpm (if needed)
echo.
echo Checking pnpm...
"%NODEJS_PATH%\npm.cmd" list -g pnpm >nul 2>&1
if !errorlevel! neq 0 (
    echo Installing pnpm globally...
    "%NODEJS_PATH%\npm.cmd" install -g pnpm --legacy-peer-deps
)

REM Navigate to project
cd /d c:\Users\thinkpad\Desktop\CODE\drone-control

REM Clean node_modules if exists
if exist node_modules (
    echo Cleaning old node_modules...
    rmdir /s /q node_modules
)

REM Install dependencies with npm
echo.
echo ==========================================
echo Installing project dependencies...
echo ==========================================
echo.

"%NODEJS_PATH%\npm.cmd" install --legacy-peer-deps

if !errorlevel! neq 0 (
    echo ERROR: npm install failed
    pause
    exit /b 1
)

REM Build frontend
echo.
echo ==========================================
echo Building frontend...
echo ==========================================
echo.

cd src\frontend
if exist node_modules (
    rmdir /s /q node_modules
)

"%NODEJS_PATH%\npm.cmd" install --legacy-peer-deps

if !errorlevel! neq 0 (
    echo ERROR: Frontend npm install failed
    pause
    exit /b 1
)

"%NODEJS_PATH%\npm.cmd" run build:skip-bindings

if !errorlevel! neq 0 (
    echo ERROR: Frontend build failed
    pause
    exit /b 1
)

REM Copy output
cd ..\..
if exist dist (
    rmdir /s /q dist
)
mkdir dist\frontend
mkdir dist\backend

if exist src\frontend\dist (
    xcopy src\frontend\dist dist\frontend\ /E /I /Y
)

echo.
echo ==========================================
echo SUCCESS! Build Complete
echo ==========================================
echo.
echo Output: dist\
echo.
echo Next: Start dev server
echo   cd src\frontend
echo   npm run dev
echo.
pause
