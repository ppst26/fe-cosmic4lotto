"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface SoftLineTabItem<T extends string> {
  id: T;
  label: React.ReactNode;
}

interface SoftLineTabsProps<T extends string> {
  tabs: SoftLineTabItem<T>[];
  activeId: T;
  onSelect: (id: T) => void;
  ariaLabel: string;
  className?: string;
}

/** แท็บเส้นใต้สไตล์ sport — แท็บละเท่า ๆ กัน · active ใช้สี brand */
export function SoftLineTabs<T extends string>({
  tabs,
  activeId,
  onSelect,
  ariaLabel,
  className,
}: SoftLineTabsProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn("flex w-full border-b border-white/[0.08]", className)}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(tab.id)}
            className={cn(
              "soft-line-tab -mb-px min-h-10 flex-1 cursor-pointer border-0 border-b-2 bg-transparent px-2 py-2 text-sm font-semibold transition-colors",
              isActive
                ? "border-transparent text-[var(--brand-strong)]"
                : "border-transparent text-[var(--tab-inactive)] hover:text-[var(--text-on-light)]",
            )}
          >
            {tab.label}
            {isActive ? <span className="soft-line-tab__bar" aria-hidden /> : null}
          </button>
        );
      })}
    </div>
  );
}
