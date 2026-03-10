import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Slider } from "@/components/ui/slider";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  AlertTriangle,
  Battery,
  BatteryLow,
  BatteryWarning,
  Camera,
  ChevronDown,
  ChevronUp,
  Home,
  PlaneLanding,
  PlaneTakeoff,
  Signal,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { CompassRose } from "./components/CompassRose";
import { DPad } from "./components/DPad";
import { DroneCamera } from "./components/DroneCamera";
import { MissionLog } from "./components/MissionLog";
import {
  useAscend,
  useCaptureSnapshot,
  useDescend,
  useDroneState,
  useEmergencyStop,
  useLand,
  useMissionLog,
  useMoveBackward,
  useMoveForward,
  useMoveLeft,
  useMoveRight,
  useReturnToHome,
  useSetAltitudeLimit,
  useSetFlightMode,
  useSetSpeed,
  useSimulateTick,
  useTakeoff,
} from "./hooks/useQueries";

const queryClient = new QueryClient();

function DroneApp() {
  const { data: state } = useDroneState();
  const { data: log = [] } = useMissionLog();
  const simulateTick = useSimulateTick();

  const takeoff = useTakeoff();
  const land = useLand();
  const emergencyStop = useEmergencyStop();
  const returnToHome = useReturnToHome();
  const moveForward = useMoveForward();
  const moveBackward = useMoveBackward();
  const moveLeft = useMoveLeft();
  const moveRight = useMoveRight();
  const ascend = useAscend();
  const descend = useDescend();
  const setSpeed = useSetSpeed();
  const setAltitudeLimit = useSetAltitudeLimit();
  const setFlightMode = useSetFlightMode();
  const captureSnapshot = useCaptureSnapshot();

  const [showEmergencyDialog, setShowEmergencyDialog] = useState(false);
  const [logOpen, setLogOpen] = useState(true);
  const [altLimitInput, setAltLimitInput] = useState("");

  const simulateTickMutate = simulateTick.mutate;
  useEffect(() => {
    const iv = setInterval(() => simulateTickMutate(), 2000);
    return () => clearInterval(iv);
  }, [simulateTickMutate]);

  const status = state?.status ?? "IDLE";
  const battery = Number(state?.batteryLevel ?? 100);
  const altitude = state?.altitude ?? 0;
  const speed = state?.speed ?? 0;
  const heading = state?.heading ?? 0;
  const signal = Number(state?.signalStrength ?? 100);
  const flightMode = state?.flightMode ?? "MANUAL";
  const pos = state?.position ?? { x: 0, y: 0, z: 0 };
  const altLimit = state?.altitudeLimit ?? 100;

  const canMove = status === "FLYING" || status === "RETURNING";
  const isFlying = canMove;
  const isEmergency = status === "EMERGENCY";

  const statusColor: Record<string, string> = {
    IDLE: "oklch(0.52 0.05 215)",
    FLYING: "oklch(0.72 0.2 145)",
    LANDING: "oklch(0.75 0.16 85)",
    RETURNING: "oklch(0.75 0.16 85)",
    EMERGENCY: "oklch(0.58 0.23 25)",
  };

  const handleTakeoff = useCallback(() => {
    takeoff.mutate(undefined, {
      onSuccess: () => toast.success("Drone takeoff initiated"),
      onError: () => toast.error("Takeoff failed"),
    });
  }, [takeoff]);

  const handleLand = useCallback(() => {
    land.mutate(undefined, {
      onSuccess: () => toast.success("Landing sequence initiated"),
      onError: () => toast.error("Land command failed"),
    });
  }, [land]);

  const handleRTH = () => {
    returnToHome.mutate(undefined, {
      onSuccess: () => toast.success("Return to home initiated"),
      onError: () => toast.error("RTH failed"),
    });
  };

  const handleEmergency = () => {
    emergencyStop.mutate(undefined, {
      onSuccess: () => toast.error("EMERGENCY STOP ACTIVATED"),
      onError: () => toast.error("Emergency stop failed"),
    });
    setShowEmergencyDialog(false);
  };

  const handleSnapshot = () => {
    captureSnapshot.mutate(undefined, {
      onSuccess: () => toast.success("Snapshot captured"),
    });
  };

  const handleFlightMode = (mode: string) => {
    setFlightMode.mutate(mode, {
      onSuccess: () => toast.success(`Flight mode: ${mode}`),
    });
  };

  const handleAltLimit = () => {
    const val = Number.parseFloat(altLimitInput);
    if (!Number.isNaN(val) && val > 0) {
      setAltitudeLimit.mutate(val, {
        onSuccess: () => {
          toast.success(`Altitude limit set to ${val}m`);
          setAltLimitInput("");
        },
      });
    }
  };

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (!canMove) return;
      const dist = 1;
      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          moveForward.mutate(dist);
          break;
        case "ArrowDown":
          e.preventDefault();
          moveBackward.mutate(dist);
          break;
        case "ArrowLeft":
          e.preventDefault();
          moveLeft.mutate(dist);
          break;
        case "ArrowRight":
          e.preventDefault();
          moveRight.mutate(dist);
          break;
        case "w":
        case "W":
          ascend.mutate(dist);
          break;
        case "s":
        case "S":
          descend.mutate(dist);
          break;
      }
    },
    [canMove, moveForward, moveBackward, moveLeft, moveRight, ascend, descend],
  );

  const handleSpaceKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === " ") {
        e.preventDefault();
        if (status === "IDLE") handleTakeoff();
        else if (status === "FLYING") handleLand();
      }
    },
    [status, handleTakeoff, handleLand],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    window.addEventListener("keydown", handleSpaceKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("keydown", handleSpaceKey);
    };
  }, [handleKey, handleSpaceKey]);

  const BatteryIcon =
    battery > 50 ? Battery : battery > 20 ? BatteryWarning : BatteryLow;
  const batteryColor =
    battery > 50
      ? "oklch(0.72 0.2 145)"
      : battery > 20
        ? "oklch(0.75 0.16 85)"
        : "oklch(0.58 0.23 25)";

  const flightModes = ["MANUAL", "STABILIZED", "GPS_HOLD", "FOLLOW_ME"];
  const flightModeLabels: Record<string, string> = {
    MANUAL: "MANUAL",
    STABILIZED: "STBLZD",
    GPS_HOLD: "GPS HLD",
    FOLLOW_ME: "FOLLOW",
  };

  return (
    <div
      className="h-screen w-screen flex flex-col overflow-hidden"
      style={{ background: "oklch(0.08 0.01 240)" }}
    >
      {/* TOP STATUS BAR */}
      <header
        data-ocid="status.section"
        className="hud-panel flex items-center gap-4 px-4 py-2 shrink-0 z-10"
        style={{
          borderBottom: "1px solid var(--hud-border)",
          background: "oklch(0.1 0.015 235)",
        }}
      >
        <div
          className="flex items-center gap-2 border-r pr-4"
          style={{ borderColor: "var(--hud-border)" }}
        >
          <div
            className="w-2 h-2"
            style={{
              background: statusColor[status] ?? "oklch(0.52 0.05 215)",
              clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
            }}
          />
          <span
            className="font-mono text-xs font-bold"
            style={{ color: statusColor[status] ?? "oklch(0.52 0.05 215)" }}
          >
            {status}
          </span>
        </div>

        <div
          className="flex items-center gap-1.5 border-r pr-4"
          style={{ borderColor: "var(--hud-border)" }}
        >
          <BatteryIcon size={14} style={{ color: batteryColor }} />
          <span
            className="font-mono text-xs font-bold"
            style={{ color: batteryColor }}
          >
            {battery}%
          </span>
          <div
            className="w-16 h-1.5 rounded-none overflow-hidden"
            style={{ background: "oklch(0.2 0.02 230)" }}
          >
            <div
              className="h-full transition-all duration-1000"
              style={{ width: `${battery}%`, background: batteryColor }}
            />
          </div>
        </div>

        <div
          className="flex items-center gap-1.5 border-r pr-4"
          style={{ borderColor: "var(--hud-border)" }}
        >
          <Signal size={14} style={{ color: "oklch(0.82 0.16 198)" }} />
          <div className="flex items-end gap-0.5 h-3">
            {[1, 2, 3, 4, 5].map((bar) => (
              <div
                key={bar}
                style={{
                  width: 3,
                  height: bar * 2.5 + 2,
                  background:
                    signal >= bar * 20
                      ? "oklch(0.82 0.16 198)"
                      : "oklch(0.25 0.04 215)",
                }}
              />
            ))}
          </div>
          <span
            className="font-mono text-[10px]"
            style={{ color: "oklch(0.52 0.05 215)" }}
          >
            {signal}%
          </span>
        </div>

        <div
          className="flex items-center gap-2 border-r pr-4"
          style={{ borderColor: "var(--hud-border)" }}
        >
          <span className="hud-label">GPS</span>
          <span
            className="font-mono text-[10px]"
            style={{ color: "oklch(0.72 0.06 210)" }}
          >
            X:{pos.x.toFixed(1)} Y:{pos.y.toFixed(1)} Z:{pos.z.toFixed(1)}
          </span>
        </div>

        <div
          className="flex items-center gap-1.5 border-r pr-4"
          style={{ borderColor: "var(--hud-border)" }}
        >
          <span className="hud-label">ALT</span>
          <span
            className="font-mono text-xs font-bold"
            style={{ color: "oklch(0.82 0.16 198)" }}
          >
            {altitude.toFixed(1)}m
          </span>
        </div>

        <div
          className="flex items-center gap-1.5 border-r pr-4"
          style={{ borderColor: "var(--hud-border)" }}
        >
          <span className="hud-label">SPD</span>
          <span
            className="font-mono text-xs font-bold"
            style={{ color: "oklch(0.82 0.16 198)" }}
          >
            {speed.toFixed(1)} m/s
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="hud-label">MODE</span>
          <span
            className="font-mono text-xs font-bold"
            style={{ color: "oklch(0.75 0.16 85)" }}
          >
            {flightMode}
          </span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <span
            className="font-mono text-[10px] tracking-widest"
            style={{ color: "oklch(0.35 0.06 198)" }}
          >
            GCS v2.4.1 &mdash; DRONE-01
          </span>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main
        className="flex-1 grid overflow-hidden"
        style={{ gridTemplateColumns: "220px 1fr 220px" }}
      >
        {/* LEFT COLUMN */}
        <aside
          className="hud-panel flex flex-col gap-4 p-3 overflow-y-auto"
          style={{ borderRight: "1px solid var(--hud-border)" }}
        >
          <div className="flex flex-col gap-2">
            <div className="hud-label">ALTITUDE CONTROL</div>
            <div className="flex items-center gap-2">
              <div
                className="flex-1 relative h-40 flex items-center justify-center"
                style={{
                  background: "oklch(0.1 0.01 240)",
                  border: "1px solid var(--hud-border)",
                }}
              >
                <div className="w-3 h-full absolute flex flex-col">
                  <div
                    className="absolute bottom-0 left-0 right-0 transition-all duration-1000"
                    style={{
                      height: `${Math.min((altitude / altLimit) * 100, 100)}%`,
                      background:
                        "linear-gradient(to top, oklch(0.82 0.16 198 / 0.6), oklch(0.82 0.16 198 / 0.1))",
                    }}
                  />
                </div>
                <div
                  className="absolute right-2 top-2 font-mono text-[10px]"
                  style={{ color: "oklch(0.45 0.06 198)" }}
                >
                  {altLimit}m
                </div>
                <div
                  className="absolute right-2 bottom-2 font-mono text-[10px]"
                  style={{ color: "oklch(0.45 0.06 198)" }}
                >
                  0m
                </div>
                <div
                  className="absolute right-2 font-mono text-xs font-bold transition-all duration-1000"
                  style={{
                    bottom: `calc(${Math.min((altitude / altLimit) * 100, 95)}% - 8px)`,
                    color: "oklch(0.82 0.16 198)",
                  }}
                >
                  {altitude.toFixed(1)}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  data-ocid="control.ascend.button"
                  onClick={() => ascend.mutate(1)}
                  disabled={!canMove}
                  className="w-9 h-9 flex items-center justify-center border transition-all disabled:opacity-30"
                  style={{
                    background: "oklch(0.17 0.03 230)",
                    borderColor: "oklch(0.35 0.08 198)",
                    color: "oklch(0.82 0.16 198)",
                  }}
                >
                  <ChevronUp size={16} />
                </button>
                <button
                  type="button"
                  data-ocid="control.descend.button"
                  onClick={() => descend.mutate(1)}
                  disabled={!canMove}
                  className="w-9 h-9 flex items-center justify-center border transition-all disabled:opacity-30"
                  style={{
                    background: "oklch(0.17 0.03 230)",
                    borderColor: "oklch(0.35 0.08 198)",
                    color: "oklch(0.82 0.16 198)",
                  }}
                >
                  <ChevronDown size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-center pt-2">
            <CompassRose heading={heading} />
          </div>

          <div className="mt-auto flex flex-col gap-1">
            <div className="hud-label mb-1">KEYBOARD</div>
            {[
              ["↑↓←→", "Move"],
              ["W/S", "Ascend/Descend"],
              ["SPACE", "Takeoff/Land"],
            ].map(([key, action]) => (
              <div key={key} className="flex items-center justify-between">
                <span
                  className="font-mono text-[10px] px-1.5 py-0.5"
                  style={{
                    background: "oklch(0.17 0.02 235)",
                    color: "oklch(0.65 0.1 198)",
                    border: "1px solid oklch(0.3 0.05 198)",
                  }}
                >
                  {key}
                </span>
                <span
                  className="font-mono text-[10px]"
                  style={{ color: "oklch(0.45 0.04 215)" }}
                >
                  {action}
                </span>
              </div>
            ))}
          </div>
        </aside>

        {/* CENTER COLUMN */}
        <div className="flex flex-col overflow-hidden">
          <div
            className="hud-panel flex-1 relative overflow-hidden"
            style={{ borderBottom: "1px solid var(--hud-border)" }}
          >
            <div className="h-full">
              <DroneCamera
                status={status}
                altitude={altitude}
                speed={speed}
                heading={heading}
                battery={battery}
              />
            </div>
          </div>

          <div
            className="hud-panel shrink-0 p-3 flex items-center justify-between gap-4"
            style={{ borderTop: "1px solid var(--hud-border)" }}
          >
            <DPad
              onForward={() => moveForward.mutate(1)}
              onBackward={() => moveBackward.mutate(1)}
              onLeft={() => moveLeft.mutate(1)}
              onRight={() => moveRight.mutate(1)}
              disabled={!canMove}
            />

            <div className="flex flex-col gap-2 flex-1 items-center">
              <div className="flex gap-2 flex-wrap justify-center">
                <button
                  type="button"
                  data-ocid="flight.takeoff.button"
                  onClick={handleTakeoff}
                  disabled={isFlying || isEmergency || takeoff.isPending}
                  className="btn-takeoff px-4 py-2 font-mono text-xs font-bold tracking-widest disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  <PlaneTakeoff size={14} />
                  TAKEOFF
                </button>
                <button
                  type="button"
                  data-ocid="flight.land.button"
                  onClick={handleLand}
                  disabled={!isFlying || land.isPending}
                  className="btn-land px-4 py-2 font-mono text-xs font-bold tracking-widest disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  <PlaneLanding size={14} />
                  LAND
                </button>
                <button
                  type="button"
                  data-ocid="flight.rth.button"
                  onClick={handleRTH}
                  disabled={!isFlying || returnToHome.isPending}
                  className="btn-rth px-4 py-2 font-mono text-xs font-bold tracking-widest disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  <Home size={14} />
                  RTH
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  data-ocid="flight.emergency.button"
                  onClick={() => setShowEmergencyDialog(true)}
                  disabled={isEmergency || emergencyStop.isPending}
                  className="btn-emergency px-6 py-2 font-mono text-sm font-bold tracking-widest disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <AlertTriangle size={16} />
                  EMERGENCY STOP
                </button>
                <button
                  type="button"
                  data-ocid="flight.snapshot.button"
                  onClick={handleSnapshot}
                  disabled={!isFlying || captureSnapshot.isPending}
                  className="px-4 py-2 font-mono text-xs font-bold tracking-widest disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5 border transition-all"
                  style={{
                    background: "oklch(0.17 0.03 230)",
                    borderColor: "oklch(0.35 0.08 198)",
                    color: "oklch(0.82 0.16 198)",
                  }}
                >
                  <Camera size={14} />
                  SNAP
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <aside
          className="hud-panel flex flex-col gap-4 p-3 overflow-y-auto"
          style={{ borderLeft: "1px solid var(--hud-border)" }}
        >
          <div className="flex flex-col gap-3">
            <div className="hud-label">SPEED CONTROL</div>
            <div className="px-1">
              <Slider
                data-ocid="settings.speed.input"
                min={0}
                max={20}
                step={0.5}
                value={[speed]}
                onValueChange={([val]) => setSpeed.mutate(val)}
                className="w-full"
              />
            </div>
            <div className="flex justify-between">
              <span className="hud-label">0 m/s</span>
              <span className="hud-text text-xs font-bold">
                {speed.toFixed(1)} m/s
              </span>
              <span className="hud-label">20 m/s</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="hud-label">ALTITUDE LIMIT</div>
            <div className="flex gap-1">
              <input
                data-ocid="settings.altlimit.input"
                type="number"
                placeholder={`${altLimit}m`}
                value={altLimitInput}
                onChange={(e) => setAltLimitInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAltLimit()}
                className="flex-1 font-mono text-xs px-2 py-1.5 outline-none"
                style={{
                  background: "oklch(0.13 0.01 235)",
                  border: "1px solid oklch(0.35 0.08 198)",
                  color: "oklch(0.82 0.16 198)",
                }}
              />
              <button
                type="button"
                data-ocid="settings.altlimit.submit_button"
                onClick={handleAltLimit}
                className="px-2 py-1.5 font-mono text-[10px] font-bold border transition-all"
                style={{
                  background: "oklch(0.17 0.03 230)",
                  borderColor: "oklch(0.35 0.08 198)",
                  color: "oklch(0.82 0.16 198)",
                }}
              >
                SET
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="hud-label">FLIGHT MODE</div>
            <div className="grid grid-cols-2 gap-1">
              {flightModes.map((mode) => (
                <button
                  type="button"
                  key={mode}
                  data-ocid={`settings.flightmode.${mode.toLowerCase().replace("_", "")}.button`}
                  onClick={() => handleFlightMode(mode)}
                  className="py-2 font-mono text-[10px] font-bold tracking-wide border transition-all"
                  style={{
                    background:
                      flightMode === mode
                        ? "oklch(0.82 0.16 198)"
                        : "oklch(0.13 0.01 235)",
                    borderColor:
                      flightMode === mode
                        ? "oklch(0.82 0.16 198)"
                        : "oklch(0.35 0.08 198)",
                    color:
                      flightMode === mode
                        ? "oklch(0.1 0.01 240)"
                        : "oklch(0.65 0.1 198)",
                    boxShadow:
                      flightMode === mode
                        ? "0 0 12px oklch(0.82 0.16 198 / 0.4)"
                        : "none",
                  }}
                >
                  {flightModeLabels[mode]}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-auto">
            <div className="hud-label">TELEMETRY</div>
            <div
              className="p-2 flex flex-col gap-1"
              style={{
                background: "oklch(0.1 0.01 240)",
                border: "1px solid var(--hud-border)",
              }}
            >
              {[
                ["POS X", `${pos.x.toFixed(2)}m`],
                ["POS Y", `${pos.y.toFixed(2)}m`],
                ["POS Z", `${pos.z.toFixed(2)}m`],
                ["HEADING", `${heading.toFixed(1)}\u00b0`],
                ["ALT LIM", `${altLimit}m`],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between items-center">
                  <span className="hud-label text-[9px]">{label}</span>
                  <span
                    className="font-mono text-[10px]"
                    style={{ color: "oklch(0.72 0.06 210)" }}
                  >
                    {val}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </main>

      <MissionLog
        entries={log}
        isOpen={logOpen}
        onToggle={() => setLogOpen((v) => !v)}
      />

      <AlertDialog
        open={showEmergencyDialog}
        onOpenChange={setShowEmergencyDialog}
      >
        <AlertDialogContent
          data-ocid="emergency.dialog"
          className="border"
          style={{
            background: "oklch(0.12 0.02 235)",
            borderColor: "oklch(0.58 0.23 25)",
            boxShadow: "0 0 40px oklch(0.58 0.23 25 / 0.3)",
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle
              className="font-mono text-lg tracking-widest"
              style={{ color: "oklch(0.58 0.23 25)" }}
            >
              &#9888; EMERGENCY STOP
            </AlertDialogTitle>
            <AlertDialogDescription
              className="font-mono text-sm"
              style={{ color: "oklch(0.72 0.06 210)" }}
            >
              This will immediately halt all motors and drop the drone. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              data-ocid="emergency.cancel_button"
              className="font-mono text-xs tracking-widest border"
              style={{
                background: "oklch(0.17 0.02 235)",
                borderColor: "oklch(0.35 0.06 215)",
                color: "oklch(0.72 0.06 210)",
              }}
            >
              ABORT
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="emergency.confirm_button"
              onClick={handleEmergency}
              className="btn-emergency font-mono text-xs tracking-widest"
            >
              CONFIRM EMERGENCY STOP
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Toaster
        theme="dark"
        toastOptions={{
          style: {
            background: "oklch(0.13 0.015 235)",
            border: "1px solid oklch(0.26 0.06 198 / 0.5)",
            color: "oklch(0.9 0.03 210)",
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "12px",
          },
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DroneApp />
    </QueryClientProvider>
  );
}
