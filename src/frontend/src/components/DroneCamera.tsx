interface DroneCameraProps {
  status: string;
  altitude: number;
  speed: number;
  heading: number;
  battery: number;
}

export function DroneCamera({
  status,
  altitude,
  speed,
  heading,
  battery,
}: DroneCameraProps) {
  const isFlying = status === "FLYING" || status === "RETURNING";

  return (
    <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
      <img
        src="/assets/generated/drone-camera-feed.dim_800x450.jpg"
        alt="Drone camera feed"
        className="w-full h-full object-cover"
        style={{ filter: isFlying ? "none" : "brightness(0.3) saturate(0.5)" }}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            "repeating-linear-gradient(0deg, rgba(0,220,255,0.03) 0px, rgba(0,220,255,0.03) 1px, transparent 1px, transparent 4px)",
          pointerEvents: "none",
        }}
      />

      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 56.25"
        preserveAspectRatio="none"
        style={{ pointerEvents: "none" }}
        role="img"
        aria-label="HUD overlay"
      >
        <title>HUD Overlay</title>
        <path
          d="M2,8 L2,2 L10,2"
          stroke="oklch(0.82 0.16 198)"
          strokeWidth="0.4"
          fill="none"
        />
        <path
          d="M90,2 L98,2 L98,8"
          stroke="oklch(0.82 0.16 198)"
          strokeWidth="0.4"
          fill="none"
        />
        <path
          d="M2,48.25 L2,54.25 L10,54.25"
          stroke="oklch(0.82 0.16 198)"
          strokeWidth="0.4"
          fill="none"
        />
        <path
          d="M90,54.25 L98,54.25 L98,48.25"
          stroke="oklch(0.82 0.16 198)"
          strokeWidth="0.4"
          fill="none"
        />
        <line
          x1="50"
          y1="24.125"
          x2="50"
          y2="28.125"
          stroke="oklch(0.82 0.16 198 / 0.6)"
          strokeWidth="0.3"
        />
        <line
          x1="50"
          y1="32.125"
          x2="50"
          y2="36.125"
          stroke="oklch(0.82 0.16 198 / 0.6)"
          strokeWidth="0.3"
        />
        <line
          x1="44"
          y1="28.125"
          x2="48"
          y2="28.125"
          stroke="oklch(0.82 0.16 198 / 0.6)"
          strokeWidth="0.3"
        />
        <line
          x1="52"
          y1="28.125"
          x2="56"
          y2="28.125"
          stroke="oklch(0.82 0.16 198 / 0.6)"
          strokeWidth="0.3"
        />
        <circle
          cx="50"
          cy="28.125"
          r="3"
          stroke="oklch(0.82 0.16 198 / 0.4)"
          strokeWidth="0.3"
          fill="none"
        />
        <circle cx="50" cy="28.125" r="0.5" fill="oklch(0.82 0.16 198 / 0.8)" />
        <line
          x1="33.33"
          y1="2"
          x2="33.33"
          y2="54.25"
          stroke="oklch(0.82 0.16 198 / 0.1)"
          strokeWidth="0.2"
        />
        <line
          x1="66.66"
          y1="2"
          x2="66.66"
          y2="54.25"
          stroke="oklch(0.82 0.16 198 / 0.1)"
          strokeWidth="0.2"
        />
        <line
          x1="2"
          y1="18.75"
          x2="98"
          y2="18.75"
          stroke="oklch(0.82 0.16 198 / 0.1)"
          strokeWidth="0.2"
        />
        <line
          x1="2"
          y1="37.5"
          x2="98"
          y2="37.5"
          stroke="oklch(0.82 0.16 198 / 0.1)"
          strokeWidth="0.2"
        />
      </svg>

      <div
        className="absolute top-2 left-3 flex flex-col gap-0.5"
        style={{ pointerEvents: "none" }}
      >
        <div className="hud-label text-[9px]">ALT</div>
        <div className="hud-text text-sm font-bold">{altitude.toFixed(1)}m</div>
      </div>

      <div
        className="absolute top-2 right-3 flex flex-col items-end gap-0.5"
        style={{ pointerEvents: "none" }}
      >
        <div className="hud-label text-[9px]">SPD</div>
        <div className="hud-text text-sm font-bold">{speed.toFixed(1)} m/s</div>
      </div>

      <div
        className="absolute bottom-2 left-3 flex flex-col gap-0.5"
        style={{ pointerEvents: "none" }}
      >
        <div className="hud-label text-[9px]">HDG</div>
        <div className="hud-text text-sm font-bold">{heading.toFixed(1)}°</div>
      </div>

      <div
        className="absolute bottom-2 right-3 flex flex-col items-end gap-0.5"
        style={{ pointerEvents: "none" }}
      >
        <div className="hud-label text-[9px]">BAT</div>
        <div
          className="text-sm font-bold font-mono"
          style={{
            color:
              battery > 50
                ? "oklch(0.72 0.2 145)"
                : battery > 20
                  ? "oklch(0.75 0.16 85)"
                  : "oklch(0.58 0.23 25)",
          }}
        >
          {battery}%
        </div>
      </div>

      {isFlying && (
        <div
          className="absolute top-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5"
          style={{ pointerEvents: "none" }}
        >
          <div
            className="w-2 h-2 rounded-full rec-indicator"
            style={{ background: "oklch(0.58 0.23 25)" }}
          />
          <span
            className="font-mono text-[10px]"
            style={{ color: "oklch(0.58 0.23 25)" }}
          >
            REC
          </span>
        </div>
      )}

      {!isFlying && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ pointerEvents: "none" }}
        >
          <div
            className="font-mono text-xs tracking-widest"
            style={{ color: "oklch(0.35 0.05 215)" }}
          >
            CAMERA STANDBY
          </div>
        </div>
      )}
    </div>
  );
}
