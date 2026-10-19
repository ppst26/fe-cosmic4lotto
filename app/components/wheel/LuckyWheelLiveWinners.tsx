"use client";

import React from "react";
import { Users, Gem } from "lucide-react";
import { useWheel } from "@/app/hooks/api/member";
import { toneClass } from "@/app/components/ui/valueTone";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/I18nProvider";

/** รายการผู้เล่นคนอื่นได้รับรางวัล */
export function LuckyWheelLiveWinners({ variant = "default" }: { variant?: "default" | "sidebar" }) {
  const t = useT("rewards");
  const isSidebar = variant === "sidebar";
  /** ใช้ cache เดียวกับ LuckyWheelPageContent (SWR) — ยังไม่มีข้อมูลแสดงรายการว่าง */
  const liveWinners = useWheel().data?.liveWinners ?? [];
  return (
    <section
      className={cn("soft-panel flex h-full min-h-0 flex-col p-4 lg:p-3", isSidebar && "min-w-0")}
      aria-labelledby="wheel-live-title"
    >
      <header className={cn("flex items-start gap-2 pb-3.5 lg:pb-2.5", isSidebar && "gap-1.5")}>
        <Users
          className={cn("shrink-0 text-[var(--brand-strong)]", isSidebar ? "mt-0.5 h-3.5 w-3.5" : "h-4 w-4")}
          aria-hidden="true"
        />
        <h2
          id="wheel-live-title"
          className={cn(
            "font-semibold leading-snug text-[var(--text-on-light)]",
            isSidebar ? "text-[11px] lg:text-xs" : "text-sm",
          )}
        >
          {t("wheel.liveWinners.title")}
        </h2>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-2">
        {liveWinners.map((entry) => (
          <div
            key={entry.id}
            className={cn(
              "soft-card rounded-[var(--radius-soft-sm)]",
              isSidebar
                ? "flex min-w-0 flex-col gap-1 px-2.5 py-2 text-[10px] leading-snug lg:text-[11px]"
                : "flex items-center justify-between gap-1 px-3 py-2.5 text-xs lg:px-2.5 lg:py-2",
            )}
          >
            {isSidebar ? (
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex min-w-0 items-center gap-1.5">
                    <span
                      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--brand-soft)] text-[10px] font-semibold text-[var(--brand-strong)]"
                      aria-hidden="true"
                    >
                      {entry.avatarLetter}
                    </span>
                    <span className="truncate font-semibold text-[var(--text-on-light)]">{entry.maskedName}</span>
                  </div>
                  <span className={toneClass("muted", "mt-0.5 block")}>{entry.timeLabel}</span>
                </div>
                <div className="shrink-0 text-right leading-snug">
                  <span className={toneClass("success", "block font-semibold")}>
                    {t("wheel.liveWinners.gemsWon", { amount: entry.gemsAmount.toFixed(2) })}
                  </span>
                </div>
              </div>
            ) : (
              <>
                <div className="flex w-24 shrink-0 items-center gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--brand-soft)] text-xs font-semibold text-[var(--brand-strong)]">
                    {entry.avatarLetter}
                  </span>
                  <span className="truncate text-xs font-semibold text-[var(--text-on-light)] sm:text-[13px]">
                    {entry.maskedName}
                  </span>
                </div>
                <div className="flex flex-1 items-center justify-center gap-1.5 font-semibold text-[var(--text-on-light)]">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--brand-soft)] text-[var(--brand-strong)]">
                    <Gem className="h-3 w-3" aria-hidden />
                  </span>
                  <span>
                    {t("wheel.liveWinners.received")}{" "}
                    <span className={toneClass("accent")}>
                      {t("wheel.liveWinners.gemsAmount", { amount: entry.gemsAmount.toFixed(2) })}
                    </span>
                  </span>
                </div>
                <span className="w-20 shrink-0 text-right text-xs tabular-nums text-[var(--text-muted)]">
                  {entry.timeLabel}
                </span>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
