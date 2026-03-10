# Drone Control App

## Current State
New project with no existing code.

## Requested Changes (Diff)

### Add
- Drone dashboard with live status panel (battery, altitude, speed, GPS coordinates, signal strength)
- Flight controls: takeoff, land, return-to-home, emergency stop
- Directional pad for manual flight (forward, backward, left, right, ascend, descend)
- Camera feed placeholder with snapshot capture
- Flight mode selector (Manual, Stabilized, GPS Hold, Follow Me)
- Mission log that records flight events with timestamps
- Drone state management: idle, flying, landing, returning, emergency
- Speed and altitude sliders for pre-flight settings

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Backend: Drone state actor with fields for position, battery, altitude, speed, mode, status, and mission log entries
2. Backend: Methods for takeoff, land, move (direction + distance), set mode, set speed, set altitude limit, emergency stop, return home, capture snapshot, get state, get mission log
3. Backend: Simulated battery drain over time based on flight state
4. Frontend: Full-screen dark cockpit-style dashboard layout
5. Frontend: Status bar at top showing battery, signal, altitude, speed, GPS
6. Frontend: Central camera feed panel with crosshair overlay
7. Frontend: Directional control pad (D-pad style) for movement
8. Frontend: Altitude and throttle controls on the sides
9. Frontend: Bottom panel for flight mode, takeoff/land/RTH/emergency buttons
10. Frontend: Collapsible mission log panel
