"use client";

import { useRef } from "react";
import { useLotteryI18n } from "@/app/components/lottery/useLotteryI18n";

export type LotteryInputMode = "manual" | "grid";

export function LotteryInputModeTabs({
  modes,
  activeMode,
  onChange,
  panelId,
}: {
  modes: { id: LotteryInputMode; label: string }[];
  activeMode: LotteryInputMode;
  onChange: (mode: LotteryInputMode) => void;
  panelId: string;
}) {
  const { t } = useLotteryI18n();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const focusTab = (index: number) => {
    const next = (index + modes.length) % modes.length;
    onChange(modes[next].id);
    tabRefs.current[next]?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (event.key === "ArrowRight") focusTab(index + 1);
    else if (event.key === "ArrowLeft") focusTab(index - 1);
    else if (event.key === "Home") focusTab(0);
    else if (event.key === "End") focusTab(modes.length - 1);
    else return;
    event.preventDefault();
  };

  return (
    <div className="lottery-mode-tabs grid grid-cols-2 gap-1" role="tablist" aria-label={t("inputMode.aria")}>
      {modes.map((mode, index) => {
        const isActive = mode.id === activeMode;
        return (
          <button
            key={mode.id}
            ref={(node) => {
              tabRefs.current[index] = node;
            }}
            id={`lottery-mode-${mode.id}`}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={panelId}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(mode.id)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={`lottery-mode-tabs__tab min-h-9 text-xs font-semibold${isActive ? " is-active" : ""}`}
          >
            {mode.label}
          </button>
        );
      })}
    </div>
  );
}
