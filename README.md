# Drone Control App

A full-stack drone controller application with:
- **Frontend**: React + TypeScript cockpit-style UI
- **Backend**: Motoko smart contract for drone state management

## Setup & Build

### Prerequisites

You need **Node.js 16+** installed. If not installed:

1. **Download Node.js LTS** from https://nodejs.org/
2. **Run the installer** and check "Add to PATH" during setup
3. **Restart your terminal**
4. **Verify installation**:
   ```powershell
   node -v
   npm -v
   ```

### Installation

```powershell
# Navigate to project
cd drone-control

# Install pnpm (package manager)
npm install -g pnpm

# Install dependencies
pnpm install

# Build everything
.\build.ps1
```

### Development

**Run frontend dev server:**
```powershell
cd src/frontend
pnpm run dev
```
Then open http://localhost:5173 in your browser.

**Run type checking:**
```powershell
pnpm typecheck
```

### Full Build

For complete build including the Motoko backend, install **dfx**:
```powershell
npm install -g dfx
dfx build
```

## Project Structure

- `src/backend/main.mo` - Motoko canister for drone control
- `src/frontend/` - React frontend with:
  - `src/App.tsx` - Main cockpit UI
  - `src/components/` - Reusable drone controls
  - `src/hooks/` - React Query data fetching

## Features

- Drone state management (position, battery, altitude, speed)
- Flight controls: takeoff, land, return-to-home, emergency stop
- Directional controls with D-pad and keyboard arrows
- Battery/signal monitoring
- Flight mode selector
- Mission log with timestamps
- Real-time state simulation

## Controls

**Keyboard:**
- Arrow keys - Move (forward/backward/left/right)
- W/S - Ascend/descend  
- Space - Takeoff/land
- Numpad or D-pad - Manual flight

**Mouse:**
- Click flight mode buttons
- Adjust altitude/throttle sliders
