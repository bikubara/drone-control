import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from "lucide-react";

interface DPadProps {
  onForward: () => void;
  onBackward: () => void;
  onLeft: () => void;
  onRight: () => void;
  disabled: boolean;
}

function DPadButton({
  onClick,
  disabled,
  children,
  className = "",
  ocid,
}: {
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
  className?: string;
  ocid: string;
}) {
  return (
    <button
      type="button"
      data-ocid={ocid}
      onClick={onClick}
      disabled={disabled}
      className={`w-12 h-12 flex items-center justify-center border transition-all duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary ${className}`}
      style={{
        background: disabled ? "oklch(0.13 0.01 235)" : "oklch(0.17 0.03 230)",
        borderColor: disabled ? "oklch(0.22 0.03 230)" : "oklch(0.35 0.08 198)",
        color: disabled ? "oklch(0.35 0.05 215)" : "oklch(0.82 0.16 198)",
        cursor: disabled ? "not-allowed" : "pointer",
        boxShadow: disabled ? "none" : "0 0 8px oklch(0.82 0.16 198 / 0.2)",
      }}
      onMouseDown={(e) => {
        if (!disabled)
          e.currentTarget.style.background = "oklch(0.22 0.05 230)";
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.background = disabled
          ? "oklch(0.13 0.01 235)"
          : "oklch(0.17 0.03 230)";
      }}
    >
      {children}
    </button>
  );
}

export function DPad({
  onForward,
  onBackward,
  onLeft,
  onRight,
  disabled,
}: DPadProps) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className="hud-label mb-1">DIRECTIONAL</div>
      <DPadButton
        onClick={onForward}
        disabled={disabled}
        ocid="control.forward.button"
      >
        <ArrowUp size={18} />
      </DPadButton>
      <div className="flex gap-0.5">
        <DPadButton
          onClick={onLeft}
          disabled={disabled}
          ocid="control.left.button"
        >
          <ArrowLeft size={18} />
        </DPadButton>
        <div
          className="w-12 h-12 flex items-center justify-center border"
          style={{
            background: "oklch(0.13 0.01 235)",
            borderColor: "oklch(0.22 0.03 230)",
          }}
        >
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: "oklch(0.35 0.08 198)" }}
          />
        </div>
        <DPadButton
          onClick={onRight}
          disabled={disabled}
          ocid="control.right.button"
        >
          <ArrowRight size={18} />
        </DPadButton>
      </div>
      <DPadButton
        onClick={onBackward}
        disabled={disabled}
        ocid="control.backward.button"
      >
        <ArrowDown size={18} />
      </DPadButton>
    </div>
  );
}
