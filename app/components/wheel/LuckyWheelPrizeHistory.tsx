"use client";

import React, { useMemo } from "react";
import { Clock } from "lucide-react";
import { useWheel } from "@/app/hooks/api/member";
import type { WheelPrizeHistoryRow, WheelSpinMethod } from "@/app/types/reward";
import { WHEEL_LIST_MAX_ROWS } from "@/lib/domain/wheelList";
import { toneClass as valueClass } from "@/app/components/ui/valueTone";
import type { ValueRole } from "@/lib/semanticValue";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/I18nProvider";

interface LuckyWheelPrizeHistoryProps {
  extraRows?: WheelPrizeHistoryRow[];
  /** desktop — คอลัมน์แคบข้างวงล้อ */
  variant?: "default" | "sidebar";
}

/**
 * ตารางประวัติการหมุนของฉัน — โครงเดียวกับตารางผู้ได้รับรางวัล (ความสูงเท่ากัน เห็น 5 แถว)
 * แสดงสูงสุด WHEEL_LIST_MAX_ROWS แถว · เกิน 5 แถวเลื่อนในกรอบเมื่อเมาส์ชี้ · ไม่แบ่งหน้า
 * สไตล์: app/styles/lucky-wheel.css (.wheel-winners / .wheel-history)
 */
export function LuckyWheelPrizeHistory({ extraRows = [], variant = "default" }: LuckyWheelPrizeHistoryProps) {
  const t = useT("rewards");
  /** ใช้ cache เดียวกับ LuckyWheelPageContent (SWR) */
  const prizeHistory = useWheel().data?.prizeHistory;
  const rows = useMemo(
    () => [...extraRows, ...(prizeHistory ?? [])].slice(0, WHEEL_LIST_MAX_ROWS),
    [extraRows, prizeHistory],
  );

  return (
    <section
      className={cn("wheel-winners wheel-history", variant === "sidebar" && "wheel-winners--sidebar")}
      aria-labelledby="wheel-history-title"
    >
      <header className="wheel-winners__head">
        <span className="wheel-winners__head-icon" aria-hidden="true">
          <ClockIcon className="h-6 w-6" />
        </span>
        <h2 id="wheel-history-title" className="wheel-winners__title">
          {t("wheel.history.title")}
        </h2>
      </header>

      <div className="wheel-winners__panel wheel-winners__panel--solo">
        <div className="wheel-winners__bar">
          <Clock size={18} className="wheel-winners__bar-icon" aria-hidden="true" />
          <span>{t("wheel.history.latest")}</span>
        </div>

        <ul className="wheel-winners__list">
          {rows.map((row) => (
            <li key={row.id} className="wheel-winners__row wheel-history__row">
              <div className="wheel-history__main">
                <span className={valueClass("reward", "wheel-history__prize")}>
                  <span className="wheel-history__prize-icon" aria-hidden="true">
                    <DiamondSmallIcon />
                  </span>
                  {row.amount} {row.prizeName}
                </span>
                <span className="wheel-history__time">{row.atLabel}</span>
              </div>
              <span className={valueClass(wheelSpinCostRole(row.method), "wheel-history__cost")}>
                <DiamondOutlineSmallIcon />
                {row.method === "gems" ? t("wheel.history.usedGems") : t("wheel.history.usedTicket")}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** สีค่าใช้จ่าย — ใช้เพชรแดงอ่อน (ลด) · ใช้ตั๋ว neutral */
function wheelSpinCostRole(method: WheelSpinMethod): ValueRole {
  return method === "gems" ? "danger" : "neutral";
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" />
    </svg>
  );
}

function DiamondSmallIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0 text-white" fill="currentColor" aria-hidden="true">
      <path d="M8 2 13 7 10 14 6 14 3 7Z" />
    </svg>
  );
}

function DiamondOutlineSmallIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5 shrink-0 text-white/70" aria-hidden="true">
      <path d="M12 4 19 10 15 20 9 20 5 10Z" strokeLinejoin="round" />
    </svg>
  );
}
