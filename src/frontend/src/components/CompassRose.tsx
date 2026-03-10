interface CompassRoseProps {
  heading: number;
}

export function CompassRose({ heading }: CompassRoseProps) {
  const cardinals = [
    { label: "N", deg: 0 },
    { label: "E", deg: 90 },
    { label: "S", deg: 180 },
    { label: "W", deg: 270 },
  ];

  const ticks = Array.from({ length: 36 }, (_, i) => i * 10);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="hud-label">HEADING</div>
      <div className="relative w-32 h-32">
        <svg
          viewBox="0 0 128 128"
          className="w-full h-full"
          role="img"
          aria-label="Compass rose heading indicator"
        >
          <title>Compass Rose</title>
          <circle
            cx="64"
            cy="64"
            r="60"
            fill="none"
            stroke="oklch(0.26 0.06 198 / 0.5)"
            strokeWidth="1"
          />
          <circle
            cx="64"
            cy="64"
            r="50"
            fill="oklch(0.1 0.02 235)"
            stroke="none"
          />

          {ticks.map((deg) => {
            const r1 = deg % 90 === 0 ? 52 : deg % 30 === 0 ? 54 : 56;
            const r2 = 60;
            const rad = ((deg - heading) * Math.PI) / 180;
            const x1 = 64 + r1 * Math.sin(rad);
            const y1 = 64 - r1 * Math.cos(rad);
            const x2 = 64 + r2 * Math.sin(rad);
            const y2 = 64 - r2 * Math.cos(rad);
            const isCardinal = deg % 90 === 0;
            return (
              <line
                key={deg}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={
                  isCardinal ? "oklch(0.82 0.16 198)" : "oklch(0.35 0.06 198)"
                }
                strokeWidth={isCardinal ? 1.5 : 0.8}
              />
            );
          })}

          {cardinals.map(({ label, deg }) => {
            const r = 42;
            const rad = ((deg - heading) * Math.PI) / 180;
            const x = 64 + r * Math.sin(rad);
            const y = 64 - r * Math.cos(rad);
            const isNorth = label === "N";
            return (
              <text
                key={label}
                x={x}
                y={y + 4}
                textAnchor="middle"
                fill={isNorth ? "oklch(0.58 0.23 25)" : "oklch(0.82 0.16 198)"}
                fontSize="9"
                fontFamily="JetBrains Mono"
                fontWeight={isNorth ? "700" : "400"}
              >
                {label}
              </text>
            );
          })}

          <polygon
            points="64,14 61,22 64,20 67,22"
            fill="oklch(0.82 0.16 198)"
            stroke="none"
          />
          <polygon
            points="64,50 61,22 64,20 67,22"
            fill="oklch(0.58 0.23 25)"
            stroke="none"
          />
          <circle cx="64" cy="64" r="3" fill="oklch(0.82 0.16 198)" />
        </svg>
      </div>
      <div className="hud-text text-lg font-bold">
        {heading.toFixed(1).padStart(5, "0")}°
      </div>
    </div>
  );
}
