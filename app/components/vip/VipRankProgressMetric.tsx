"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { formatVipAmount } from "@/lib/format";
import { toneClass } from "../ui/valueTone";
import { useT } from "@/lib/i18n/I18nProvider";
import { useFormat } from "@/lib/i18n/useFormat";

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
 * แถวฝาก/เทิร์นในการ์ดเลื่อน/รักษาระดับ — ใช้ใน VipRankLevelUpCard และ VipMaintainRankPanel
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
    <div className="min-w-0">
      <div className="flex items-baseline justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1.5 text-[var(--brand-strong)]">
          {iconKind === "deposit" ? (
            <WalletMiniIcon className="h-4 w-4 shrink-0" />
          ) : (
            <TurnoverMiniIcon className="h-4 w-4 shrink-0" />
          )}
          <span className="shrink-0 text-sm font-semibold text-[var(--text-on-light)]">{label}</span>
        </div>
        <p className="min-w-0 text-right text-xs sm:text-sm">
          <span className={toneClass("emphasis")}>{formatAmount(progress)}</span>
          <span className={toneClass("muted")}> / {formatAmount(target)}</span>
        </p>
      </div>
      <div
        className={cn(
          "mt-1.5 h-2.5 overflow-hidden rounded-full bg-[var(--soft-card-elevated)]",
          locked && "opacity-60",
        )}
      >
        <div
          className={cn("h-full rounded-full transition-[width] duration-500", complete ? "bg-emerald-500" : "bg-[var(--brand)]")}
          style={{ width: locked ? "0%" : `${pct}%` }}
        />
      </div>
      <div className="mt-1.5 text-right text-[0.65rem] leading-snug sm:text-xs">
        {locked ? (
          <span className="text-[var(--text-muted)]">{t("progress.target", { amount: formatAmount(target) })}</span>
        ) : complete ? (
          <span className={toneClass("success", "inline-flex items-center justify-end gap-1")}>
            <CheckMiniIcon className="h-3.5 w-3.5 shrink-0" />
            {t("progress.complete")}
          </span>
        ) : (
          <span className="text-[var(--text-muted)]">{t("progress.remaining", { amount: formatAmount(remaining) })}</span>
        )}
      </div>
    </div>
  );
}

function WalletMiniIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className} aria-hidden="true">
      <path d="M4 8.5V17a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-1.5H6a2 2 0 0 1-2-2v-1.5Z" strokeLinejoin="round" />
      <path d="M19 13.5h1.5a1.5 1.5 0 1 0 0-3H19" strokeLinecap="round" />
    </svg>
  );
}

function TurnoverMiniIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className} aria-hidden="true">
      <path d="M4 18V6M4 18h16M4 18l4-4M20 6v12M20 6H4M20 6l-4 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckMiniIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" className={className} aria-hidden="true">
      <path d="M5 12.5 9.5 17 19 7.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
