"use client";

import React, { useMemo, useState } from "react";
import { Clock, Gem } from "lucide-react";
import { useWheel } from "@/app/hooks/api/member";
import type { WheelPrizeHistoryRow, WheelSpinMethod } from "@/app/types/reward";
import { toneClass } from "@/app/components/ui/valueTone";
import type { ValueRole } from "@/lib/semanticValue";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/I18nProvider";

interface LuckyWheelPrizeHistoryProps {
  extraRows?: WheelPrizeHistoryRow[];
  /** desktop — คอลัมน์แคบข้างวงล้อ */
  variant?: "default" | "sidebar";
}

const pageBtnClass =
  "flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-0 bg-[var(--soft-card-elevated)] text-sm text-[var(--text-on-light)] transition-colors hover:bg-[var(--brand-soft)] disabled:opacity-30";

/** ประวัติการหมุนของฉัน */
export function LuckyWheelPrizeHistory({ extraRows = [], variant = "default" }: LuckyWheelPrizeHistoryProps) {
  const t = useT("rewards");
  const isSidebar = variant === "sidebar";
  /** ใช้ cache เดียวกับ LuckyWheelPageContent (SWR) */
  const wheel = useWheel().data;
  const [page, setPage] = useState(1);

  const prizeHistory = wheel?.prizeHistory;
  const historyPageSize = wheel?.historyPageSize ?? 1;
  const allRows = useMemo(() => [...extraRows, ...(prizeHistory ?? [])], [extraRows, prizeHistory]);
  const totalPages = Math.max(
    1,
    Math.min(wheel?.historyTotalPages ?? 1, Math.ceil(allRows.length / historyPageSize)),
  );
  const safePage = Math.min(page, totalPages);
  const sliceStart = (safePage - 1) * historyPageSize;
  const pageRows = allRows.slice(sliceStart, sliceStart + historyPageSize);

  return (
    <section
      className={cn("soft-panel flex h-full min-h-0 flex-col p-4 lg:p-3", isSidebar && "min-w-0")}
      aria-labelledby="wheel-history-title"
    >
      <header className={cn("flex items-start gap-2 pb-3.5 lg:pb-2.5", isSidebar && "gap-1.5")}>
        <Clock
          className={cn("shrink-0 text-[var(--brand-strong)]", isSidebar ? "mt-0.5 h-3.5 w-3.5" : "h-4 w-4")}
          aria-hidden="true"
        />
        <h2
          id="wheel-history-title"
          className={cn(
            "font-semibold leading-snug text-[var(--text-on-light)]",
            isSidebar ? "text-[11px] lg:text-xs" : "text-sm",
          )}
        >
          {t("wheel.history.title")}
        </h2>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-2">
        {pageRows.map((row) => (
          <div
            key={row.id}
            className={cn(
              "soft-card rounded-[var(--radius-soft-sm)]",
              isSidebar
                ? "flex min-w-0 flex-col gap-1 px-2.5 py-2 text-[10px] leading-snug lg:text-[11px]"
                : "flex items-center justify-between gap-1 px-3 py-2.5 text-xs lg:px-2.5 lg:py-2",
            )}
          >
            {isSidebar ? (
              <div className="flex items-start justify-between gap-2">
                <span className={toneClass("muted", "shrink-0")}>{row.atLabel}</span>
                <div className="flex min-w-0 flex-col items-end gap-0.5 text-right leading-snug">
                  <span className={toneClass("success", "font-semibold")}>
                    +{row.amount} {row.prizeName}
                  </span>
                  <span className={toneClass(wheelSpinCostRole(row.method))}>
                    {row.method === "gems" ? t("wheel.history.usedGems") : t("wheel.history.usedTicket")}
                  </span>
                </div>
              </div>
            ) : (
              <>
                <span className="w-24 shrink-0 text-xs tabular-nums text-[var(--text-muted)]">{row.atLabel}</span>
                <div className="flex flex-1 items-center justify-center gap-1.5 font-semibold text-[var(--text-on-light)]">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--brand-soft)] text-[var(--brand-strong)]">
                    <Gem className="h-3 w-3" aria-hidden />
                  </span>
                  <span className={toneClass("reward")}>
                    {row.amount} {row.prizeName}
                  </span>
                </div>
                <div className="flex w-20 shrink-0 items-center justify-end gap-1 text-xs text-[var(--text-muted)]">
                  <Gem className="h-3.5 w-3.5" aria-hidden />
                  <span>{row.method === "gems" ? t("wheel.history.usedGems") : t("wheel.history.usedTicket")}</span>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <footer className="flex items-center justify-end gap-3 pt-3.5">
        <button
          type="button"
          className={pageBtnClass}
          aria-label={t("wheel.history.prevPage")}
          disabled={safePage <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          &lsaquo;
        </button>
        <span className="text-xs font-semibold tabular-nums text-[var(--text-muted)]">
          {safePage} / {totalPages}
        </span>
        <button
          type="button"
          className={pageBtnClass}
          aria-label={t("wheel.history.nextPage")}
          disabled={safePage >= totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        >
          &rsaquo;
        </button>
      </footer>
    </section>
  );
}

/** สีค่าใช้จ่าย — ใช้เพชรแดง · ใช้ตั๋ว neutral */
function wheelSpinCostRole(method: WheelSpinMethod): ValueRole {
  return method === "gems" ? "danger" : "neutral";
}
