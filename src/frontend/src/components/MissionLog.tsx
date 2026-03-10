import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef } from "react";
import type { LogEntry } from "../backend.d";

interface MissionLogProps {
  entries: LogEntry[];
  isOpen: boolean;
  onToggle: () => void;
}

export function MissionLog({ entries, isOpen, onToggle }: MissionLogProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isOpen]);

  return (
    <div
      className="hud-panel transition-all duration-300"
      style={{ borderTop: "1px solid var(--hud-border)" }}
    >
      <button
        type="button"
        data-ocid="log.toggle"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-2 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background:
                entries.length > 0
                  ? "oklch(0.72 0.2 145)"
                  : "oklch(0.35 0.05 215)",
            }}
          />
          <span className="hud-label">MISSION LOG</span>
          <span className="hud-text text-xs">({entries.length})</span>
        </div>
        <span className="hud-text text-xs">{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <ScrollArea className="h-28 px-4 pb-2">
          <div className="flex flex-col gap-1">
            {entries.length === 0 ? (
              <div
                data-ocid="log.empty_state"
                className="hud-label py-4 text-center"
              >
                NO EVENTS RECORDED
              </div>
            ) : (
              entries.map((entry, i) => (
                <div
                  key={entry.timestamp.toString()}
                  data-ocid={`log.item.${i + 1}`}
                  className="flex gap-3 items-start"
                >
                  <span
                    className="font-mono text-[10px] shrink-0 pt-0.5"
                    style={{ color: "oklch(0.45 0.06 198)" }}
                  >
                    {new Date(
                      Number(entry.timestamp) / 1_000_000,
                    ).toLocaleTimeString()}
                  </span>
                  <span
                    className="font-mono text-xs"
                    style={{ color: "oklch(0.72 0.06 210)" }}
                  >
                    {entry.message}
                  </span>
                </div>
              ))
            )}
            <div ref={bottomRef} />
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
