"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { formatVipAmount } from "@/lib/format";
import { useT } from "@/lib/i18n/I18nProvider";
import { useFormat } from "@/lib/i18n/useFormat";
import s from "./vip-page.module.css";

export interface VipRankProgressMetricProps {
  label: string;
  iconKind: "deposit" | "turnover";
  progress: number;
  target: number;
  locked?: boolean;
  /** การ์ดเลื่อนระดับใช้หน่วยล้าน */
  amountFormat?: "compact" | "full";
}

/**
 * กล่องฝาก/เทิร์นในการ์ดเลื่อน/รักษาระดับ — ใช้ใน VipRankLevelUpCard และ VipMaintainRankPanel
 * ฝาก = แถบทอง · เทิร์น = แถบม่วง · ครบแล้ว = แถบเขียว
 */
export function VipRankProgressMetric({
  label,
  iconKind,
  progress,
  target,
  locked = false,
  amountFormat = "full",
}: VipRankProgressMetricProps) {
  const t = useT("vip");
  const fmt = useFormat();
  const formatAmount = amountFormat === "compact" ? fmt.compactAmount : formatVipAmount;
  const pct = target > 0 ? Math.min(100, (progress / target) * 100) : 0;
  const complete = !locked && progress >= target;
  const remaining = Math.max(0, target - progress);

  return (
    <div className={cn(s.metric, iconKind === "turnover" && s.metricTurn, locked && s.locked)}>
      <div className={s.metricTop}>
        <span className={s.metricLabel}>
          {iconKind === "deposit" ? <WalletMiniIcon /> : <TurnoverMiniIcon />}
          {label}
        </span>
        <span className={s.metricAmt}>
          <b>{formatAmount(progress)}</b> / {formatAmount(target)}
        </span>
      </div>
      <div className={s.bar}>
        <div
          className={cn(s.barFill, "motion-bar", complete ? s.barDone : iconKind === "deposit" ? s.barGold : s.barPurple)}
          style={{ width: locked ? "0%" : `${pct}%` }}
        />
      </div>
      <div className={s.metricFoot}>
        {locked ? (
          t("progress.target", { amount: formatAmount(target) })
        ) : complete ? (
          <span className={s.done}>
            <CheckMiniIcon />
            {t("progress.complete")}
          </span>
        ) : (
          t("progress.remaining", { amount: formatAmount(remaining) })
        )}
      </div>
    </div>
  );
}

function WalletMiniIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <path d="M4 8.5V17a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-1.5H6a2 2 0 0 1-2-2v-1.5Z" strokeLinejoin="round" />
      <path d="M19 13.5h1.5a1.5 1.5 0 1 0 0-3H19" strokeLinecap="round" />
      <path d="M4 8.5A2.5 2.5 0 0 1 6.5 6H17" strokeLinecap="round" />
    </svg>
  );
}

function TurnoverMiniIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <path d="M4 20h16" strokeLinecap="round" />
      <path d="M6 16v-3M11 16V9M16 16v-5" strokeLinecap="round" />
      <path d="M5 9l5-4 3 3 6-5M16 3h3v3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckMiniIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path d="M5 12.5 9.5 17 19 7.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
