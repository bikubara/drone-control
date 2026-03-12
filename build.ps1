param(
    [switch]$SkipBackend = $false
)

$ErrorActionPreference = "Stop"

Write-Host "Building Drone Control App (Windows)" -ForegroundColor Cyan

# Check for Node.js
Write-Host "Checking for Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "Node.js found: $nodeVersion" -ForegroundColor Green
}
catch {
    Write-Host "ERROR: Node.js not found. Install from https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Check for pnpm
Write-Host "Checking for pnpm..." -ForegroundColor Yellow
try {
    $pnpmVersion = pnpm --version
    Write-Host "pnpm found: $pnpmVersion" -ForegroundColor Green
}
catch {
    Write-Host "WARNING: Installing pnpm globally..." -ForegroundColor Yellow
    npm install -g pnpm
}

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
pnpm install --prefer-offline
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: pnpm install failed" -ForegroundColor Red
    exit 1
}
Write-Host "Dependencies installed" -ForegroundColor Green

# Build frontend
Write-Host "Building frontend..." -ForegroundColor Yellow
pnpm --filter '@caffeine/template-frontend' build:skip-bindings
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Frontend build failed" -ForegroundColor Red
    exit 1
}
Write-Host "Frontend built successfully" -ForegroundColor Green

# Create output directories
Write-Host "Creating output directories..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "dist/frontend" | Out-Null
New-Item -ItemType Directory -Force -Path "dist/backend" | Out-Null

# Copy frontend dist
if (Test-Path "src/frontend/dist") {
    Copy-Item -Path "src/frontend/dist/*" -Destination "dist/frontend/" -Recurse -Force
    Write-Host "Frontend assets copied" -ForegroundColor Green
}
else {
    Write-Host "WARNING: Frontend dist not found" -ForegroundColor Yellow
}

Write-Host "Build complete!" -ForegroundColor Green
