"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { toneClass } from "../ui/valueTone";
import { useT } from "@/lib/i18n/I18nProvider";
import type { CashbackMessageKey } from "@/app/types/cashback";

/** ช่วงเวลาสรุปยอด — layout แบบ dashboard (ยังไม่ผูก API รายละเอียดทุกแท็บ) */
export type CashbackInsightPeriodId = "all" | "today" | "last_week" | "last_month";

export const CASHBACK_INSIGHT_PERIODS: { id: CashbackInsightPeriodId; labelKey: CashbackMessageKey }[] = [
  { id: "all", labelKey: "periods.all" },
  { id: "today", labelKey: "periods.today" },
  { id: "last_week", labelKey: "periods.lastWeek" },
  { id: "last_month", labelKey: "periods.lastMonth" },
];

type CashbackPanelShellProps = {
  children: React.ReactNode;
  embedded?: boolean;
  className?: string;
};

/** กล่องหลักแท็บคืนยอด — หัวข้อ · แถบรับ · ช่วงเวลา · สรุป · ตาราง */
export function CashbackPanelShell({ children, embedded = false, className }: CashbackPanelShellProps) {
  return (
    <section
      className={cn(
        "soft-panel flex flex-col gap-4 px-4 py-4 sm:px-5 sm:py-5",
        embedded && "shadow-none",
        className,
      )}
    >
      {children}
    </section>
  );
}

/** หัวข้อกลางในกล่องหลัก */
export function CashbackPanelHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <header className="border-b border-white/[0.08] pb-3 text-center">
      <h2 className="text-base font-bold text-[var(--text-on-light)]">{title}</h2>
      <p className="mt-0.5 text-xs text-[var(--text-muted)]">{subtitle}</p>
    </header>
  );
}

type CashbackClaimRowProps = {
  amountLabel: string;
  amount: React.ReactNode;
  statusHint: string;
  claimLabel: string;
  canClaim: boolean;
  onClaim: () => void;
  onRefresh?: () => void;
  refreshing?: boolean;
};

/** แถบยอดรับได้ + ปุ่มรับ (ซ้ายข้อความ · ขวา CTA) */
export function CashbackClaimRow({
  amountLabel,
  amount,
  statusHint,
  claimLabel,
  canClaim,
  onClaim,
  onRefresh,
  refreshing = false,
}: CashbackClaimRowProps) {
  const t = useT("cashback");

  return (
    <div className="soft-card flex items-center justify-between gap-3 p-3.5 sm:gap-4 sm:p-4">
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-[var(--text-muted)] sm:text-[13px]">{amountLabel}</p>
        <div className="mt-0.5 flex items-center gap-1.5">
          <p className={toneClass("reward", "text-xl leading-tight sm:text-2xl")}>{amount}</p>
          {onRefresh ? (
            <button
              type="button"
              onClick={onRefresh}
              disabled={refreshing}
              className="inline-flex shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent text-[var(--text-muted)] transition-colors hover:text-[var(--text-on-light)] disabled:opacity-50"
              aria-label={t("panel.refresh")}
            >
              <RefreshIcon className={cn("h-4 w-4", refreshing && "animate-spin")} />
            </button>
          ) : null}
        </div>
        <p className="mt-1 text-[11px] text-[var(--text-muted)] sm:text-xs">{statusHint}</p>
      </div>
      <button
        type="button"
        disabled={!canClaim}
        onClick={onClaim}
        className="soft-btn-primary flex h-10 shrink-0 items-center justify-center px-4 text-xs font-semibold disabled:opacity-45 sm:h-11 sm:px-5 sm:text-sm"
      >
        {claimLabel}
      </button>
    </div>
  );
}

type CashbackInsightPeriodTabsProps = {
  activeId: CashbackInsightPeriodId;
  onSelect: (id: CashbackInsightPeriodId) => void;
};

/** แถบเลือกช่วงเวลา 4 ช่อง */
export function CashbackInsightPeriodTabs({ activeId, onSelect }: CashbackInsightPeriodTabsProps) {
  const t = useT("cashback");
  return (
    <div
      className="grid grid-cols-4 gap-1.5 rounded-[var(--radius-soft-sm)] bg-[var(--soft-card-elevated)] p-1.5"
      role="group"
      aria-label={t("periods.ariaLabel")}
    >
      {CASHBACK_INSIGHT_PERIODS.map((period) => {
        const isActive = period.id === activeId;
        return (
          <button
            key={period.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onSelect(period.id)}
            className={cn(
              "min-h-9 cursor-pointer rounded-[var(--radius-soft-sm)] border-0 px-1.5 py-2 text-xs font-semibold leading-snug transition-colors sm:text-[13px]",
              isActive
                ? "bg-[var(--brand)] text-[#2a0607]"
                : "bg-transparent text-[var(--text-muted)] hover:text-[var(--text-on-light)]",
            )}
          >
            {t(period.labelKey)}
          </button>
        );
      })}
    </div>
  );
}

type CashbackHighlightCardProps = {
  primaryLabel: string;
  primaryValue: React.ReactNode;
  secondaryValue: React.ReactNode;
  secondaryHint: string;
};

/** การ์ดสรุป — ซ้ายยอด · ขวาตัวเลขรอง */
export function CashbackHighlightCard({
  primaryLabel,
  primaryValue,
  secondaryValue,
  secondaryHint,
}: CashbackHighlightCardProps) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-[var(--radius-soft-md)] border border-white/[0.08] px-3.5 py-3 sm:px-4 sm:py-3.5">
      <div className="min-w-0">
        <p className="text-xs text-[var(--text-muted)]">{primaryLabel}</p>
        <p className={toneClass("emphasis", "mt-1 text-xl leading-tight sm:text-2xl")}>{primaryValue}</p>
      </div>
      <div className="shrink-0 text-right">
        <p className={toneClass("neutral", "text-lg leading-tight sm:text-xl")}>{secondaryValue}</p>
        <p className="mt-1 text-[11px] text-[var(--text-muted)] sm:text-xs">{secondaryHint}</p>
      </div>
    </div>
  );
}

export type CashbackRuleRow = {
  id: string;
  label: string;
  value: React.ReactNode;
};

type CashbackRulesTableSectionProps = {
  title: string;
  rows: CashbackRuleRow[];
  action?: React.ReactNode;
};

/** ตารางเงื่อนไข 2 คอลัมน์ */
export function CashbackRulesTableSection({ title, rows, action }: CashbackRulesTableSectionProps) {
  const t = useT("cashback");
  return (
    <section className="flex flex-col gap-2.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-bold text-[var(--text-on-light)]">{title}</h3>
        {action}
      </div>
      <div className="soft-card overflow-hidden">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-white/[0.08] bg-[var(--soft-surface)]">
              <th className="h-10 px-3 text-left text-xs font-semibold text-[var(--text-muted)] sm:px-4">
                {t("rules.item")}
              </th>
              <th className="h-10 px-3 text-right text-xs font-semibold text-[var(--text-muted)] sm:px-4">
                {t("rules.value")}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-white/[0.05] last:border-0">
                <td className="px-3 py-3 text-xs text-[var(--text-muted)] sm:px-4 sm:text-sm">{row.label}</td>
                <td className="px-3 py-3 text-right text-xs font-semibold tabular-nums text-[var(--text-on-light)] sm:px-4 sm:text-sm">
                  {row.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function RefreshIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className} aria-hidden="true">
      <path d="M20 11a8 8 0 1 0-2.2 5.5" strokeLinecap="round" />
      <path d="M20 4v5h-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
