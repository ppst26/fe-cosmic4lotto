"use client";

import React, { useRef } from "react";
import { useT } from "@/lib/i18n/I18nProvider";

export type LotteryInputMode = "manual" | "grid";

/**
 * แท็บสลับวิธีใส่เลข — แป้นกรอกเลข / แผงเลขให้กดเลือก
 * ใช้ร่วมกันใน ThaiLottoBetBoard และ YikiBetBoard (ข้อความบนแท็บต่างกันตามเกม จึงรับผ่าน `modes`)
 * รองรับลูกศรซ้าย/ขวา/Home/End ตาม tablist pattern
 */
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
  const t = useT("lottery");
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
    <div
      className="thai-lotto-mode-tabs grid grid-cols-2"
      role="tablist"
      aria-label={t("inputMode.aria")}
    >
      {modes.map((mode, index) => {
        const isActive = mode.id === activeMode;
        return (
          <button
            key={mode.id}
            ref={(node) => {
              tabRefs.current[index] = node;
            }}
            id={`thai-lotto-mode-${mode.id}`}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={panelId}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(mode.id)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={`thai-lotto-mode-tabs__tab relative min-h-9${isActive ? " is-active" : ""}`}
          >
            {mode.label}
          </button>
        );
      })}
    </div>
  );
}
