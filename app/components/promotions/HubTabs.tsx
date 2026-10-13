"use client";

import React from "react";

export interface HubTabItem<T extends string = string> {
  id: T;
  label: string;
}

/** แท็บหมวด (pill ทอง/มืด) — ใช้ร่วมกันใน promotions / activities hub */
export function HubTabs<T extends string>({
  tabs,
  activeId,
  onSelect,
  ariaLabel,
  className = "",
}: {
  tabs: HubTabItem<T>[];
  activeId: T;
  onSelect: (id: T) => void;
  ariaLabel: string;
  className?: string;
}) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={`scrollbar-none flex gap-2 overflow-x-auto ${className}`}
    >
      {tabs.map((tab) => {
        const selected = tab.id === activeId;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onSelect(tab.id)}
            className={`h-10 shrink-0 whitespace-nowrap rounded-full px-4 text-sm font-semibold transition-colors ${
              selected
                ? "soft-btn-primary"
                : "border border-white/10 bg-[var(--BG-Surface-Normal)] text-[var(--Text-Icon-Body)] hover:text-[var(--Text-Icon-Title)]"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
