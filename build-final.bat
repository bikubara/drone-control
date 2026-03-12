@echo off
REM Complete setup and build with correct paths

set "NODEJS_PATH=C:\Program Files\nodejs"
set "PNPM_CMD=C:\Users\thinkpad\AppData\Roaming\npm\pnpm.cmd"

echo.
echo ==========================================
echo Drone Control App - Setup and Build
echo ==========================================
echo.

REM Verify Node
echo Checking Node.js...
"%NODEJS_PATH%\node.exe" --version || (
    echo ERROR: Node.js not found
    pause
    exit /b 1
)

REM Verify npm
echo Checking npm...
"%NODEJS_PATH%\npm.cmd" --version

REM Verify pnpm
echo Checking pnpm...
if not exist "%PNPM_CMD%" (
    echo Installing pnpm globally...
    "%NODEJS_PATH%\npm.cmd" install -g pnpm
)

REM Navigate to project
cd /d c:\Users\thinkpad\Desktop\CODE\drone-control

REM Clean old builds
echo.
echo Cleaning old builds...
if exist node_modules rmdir /s /q node_modules
if exist dist rmdir /s /q dist
if exist src\frontend\node_modules rmdir /s /q src\frontend\node_modules
if exist src\frontend\dist rmdir /s /q src\frontend\dist

REM Install dependencies
echo.
echo ==========================================
echo Installing dependencies...
echo ==========================================
echo.

"%PNPM_CMD%" install --prefer-offline
if !errorlevel! neq 0 (
    echo ERROR: pnpm install failed
    pause
    exit /b 1
)

REM Build frontend
echo.
echo ==========================================
echo Building frontend...
echo ==========================================
echo.

"%PNPM_CMD%" --filter '@caffeine/template-frontend' build:skip-bindings
if !errorlevel! neq 0 (
    echo ERROR: Frontend build failed
    pause
    exit /b 1
)

REM Copy output
echo.
echo Creating output directories...
mkdir dist\frontend 2>nul
mkdir dist\backend 2>nul

if exist src\frontend\dist (
    echo Copying frontend assets...
    xcopy src\frontend\dist dist\frontend\ /E /I /Y >nul
)

REM Display results
echo.
echo ==========================================
echo SUCCESS! Build Complete
echo ==========================================
echo.
echo Output directory: dist\
echo.
echo To start development:
echo   1. cd src\frontend
echo   2. pnpm run dev
echo   3. Open: http://localhost:5173
echo.
pause
