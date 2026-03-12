# Drone Control App - Windows Setup Guide

## Prerequisites

### 1. Install Node.js & npm
The project requires Node.js (which includes npm).

**Option A: Direct Download**
- Visit https://nodejs.org
- Download LTS version (recommended)
- Run installer and follow prompts
- Verify installation: Open PowerShell and run `node --version`

**Option B: Windows Package Manager (winget)**
```powershell
winget install OpenJS.NodeJS.LTS
```

**Option C: Chocolatey**
```powershell
choco install nodejs-lts
```

### 2. Install pnpm (Package Manager)
```powershell
npm install -g pnpm
pnpm --version
```

### 3. Install DFINITY SDK (Optional - for Motoko backend compilation)
For full backend builds, install dfx:
```powershell
npm install -g dfx@latest
```

## Building the App

### Quick Build (Frontend + Assets)
```powershell
# Using PowerShell script:
.\build.ps1

# Or using batch file (Windows Command Prompt):
build.bat
```

### Full Build (with Motoko backend - requires dfx)
```powershell
dfx build
```

### Development Build
```powershell
cd src\frontend
pnpm install
pnpm run dev
```

## Project Structure
- `src/backend/` - Motoko smart contract code
- `src/frontend/` - React + TypeScript frontend
- `scripts/` - Image optimization scripts
- `build.ps1` - PowerShell build script (recommended)
- `build.bat` - Batch file alternative

## Troubleshooting

### "pnpm: The term is not recognized"
Install pnpm globally:
```powershell
npm install -g pnpm
```

### "Node.js: The term is not recognized"
Node.js is not in PATH. Reinstall from https://nodejs.org with "Add to PATH" option checked.

### Build fails in frontend
```powershell
cd src\frontend
pnpm install --force
pnpm run build:skip-bindings
```

### Clear cache and rebuild
```powershell
pnpm store prune
pnpm install
pnpm run build
```

## Next Steps
1. Run the build: `.\build.ps1`
2. Navigate to frontend: `cd src\frontend`
3. Run dev server: `pnpm run dev`
4. Open browser to http://localhost:5173
