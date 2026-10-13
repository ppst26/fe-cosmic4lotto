"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import type { BetRowType, TransactionItem, TransactionKind, TransactionStatus } from "@/app/types/transaction";
import { moneyDeltaRole, transactionStatusValueRole } from "@/lib/semanticValue";
import { toneClass } from "../ui/valueTone";
import { useT } from "@/lib/i18n/I18nProvider";
import { useLocale } from "@/lib/i18n/navigation";
import type { Locale } from "@/lib/i18n/config";
import type { MessageKey } from "@/lib/i18n/messages";
import { intlDateLocale } from "@/app/lib/transactionDateUtils";

type TxT = (key: MessageKey<"transactions">) => string;

function formatDateOnly(iso: string | null | undefined, locale: Locale): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(intlDateLocale(locale), {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function formatTimeOnly(iso: string | null | undefined, locale: Locale): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(intlDateLocale(locale), {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
}

function formatDateTime(iso: string | null | undefined, locale: Locale): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(intlDateLocale(locale), {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatAmount(value: number): string {
  return new Intl.NumberFormat("th-TH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function statusLabel(status: TransactionStatus, t: TxT): string {
  return t(`status.${status}`);
}

function betTypeLabel(type: BetRowType | undefined, t: TxT): string {
  if (type === "result" || type === "bet") return t(`betType.${type}`);
  return "—";
}

type Column = { key: string; labelKey: MessageKey<"transactions">; render: (item: TransactionItem) => React.ReactNode };

function columnsForKind(kind: TransactionKind, t: TxT, locale: Locale): Column[] {
  if (kind === "withdraw") {
    return [
      {
        key: "amount",
        labelKey: "columns.amount",
        render: (item) => (
          <span className={toneClass("emphasis")}>
            {formatAmount(item.amount)} ฿
          </span>
        ),
      },
      { key: "channel", labelKey: "columns.channel", render: (item) => item.channel ?? "—" },
      {
        key: "account",
        labelKey: "columns.account",
        render: (item) => (
          <span className="whitespace-nowrap tabular-nums">{item.accountLabel ?? "—"}</span>
        ),
      },
      {
        key: "created",
        labelKey: "columns.createdAt",
        render: (item) => (
          <span className="whitespace-nowrap tabular-nums">{formatDateTime(item.createdAt, locale)}</span>
        ),
      },
      {
        key: "status",
        labelKey: "columns.status",
        render: (item) => (
          <span className={toneClass(transactionStatusValueRole(item.status), "font-medium")}>
            {statusLabel(item.status, t)}
          </span>
        ),
      },
    ];
  }

  if (kind === "deposit") {
    return [
      { key: "detail", labelKey: "columns.detail", render: (item) => item.title },
      {
        key: "created",
        labelKey: "columns.createdAt",
        render: (item) => (
          <span className="whitespace-nowrap tabular-nums">{formatDateTime(item.createdAt, locale)}</span>
        ),
      },
      {
        key: "status",
        labelKey: "columns.status",
        render: (item) => (
          <span className={toneClass(transactionStatusValueRole(item.status), "font-medium")}>
            {statusLabel(item.status, t)}
          </span>
        ),
      },
      {
        key: "completed",
        labelKey: "columns.completedAt",
        render: (item) => (
          <span className="whitespace-nowrap tabular-nums">{formatDateTime(item.completedAt, locale)}</span>
        ),
      },
    ];
  }

  if (kind === "promotion") {
    return [
      {
        key: "name",
        labelKey: "columns.promotionName",
        render: (item) => item.promotionName ?? item.title,
      },
      {
        key: "playStart",
        labelKey: "columns.playStart",
        render: (item) => (
          <span className="whitespace-nowrap tabular-nums">{formatDateOnly(item.playStartAt, locale)}</span>
        ),
      },
      {
        key: "playEnd",
        labelKey: "columns.playEnd",
        render: (item) => (
          <span className="whitespace-nowrap tabular-nums">{formatDateOnly(item.playEndAt, locale)}</span>
        ),
      },
      {
        key: "freeSpins",
        labelKey: "columns.freeSpins",
        render: (item) => (
          <span className="tabular-nums">{item.freeSpins != null ? item.freeSpins : "—"}</span>
        ),
      },
      {
        key: "perRound",
        labelKey: "columns.perRound",
        render: (item) => (
          <span className="tabular-nums">
            {item.amountPerRound != null ? formatAmount(item.amountPerRound) : "—"}
          </span>
        ),
      },
      {
        key: "provider",
        labelKey: "columns.provider",
        render: (item) => item.gameProvider ?? "—",
      },
      {
        key: "game",
        labelKey: "columns.gameName",
        render: (item) => item.gameName ?? "—",
      },
      {
        key: "expires",
        labelKey: "columns.expiresWithin",
        render: (item) => item.expiresWithinLabel ?? "—",
      },
      {
        key: "status",
        labelKey: "columns.status",
        render: (item) => (
          <span className={toneClass(transactionStatusValueRole(item.status), "font-medium")}>
            {statusLabel(item.status, t)}
          </span>
        ),
      },
    ];
  }

  if (kind === "bet") {
    return [
      {
        key: "game",
        labelKey: "columns.game",
        render: (item) => item.gameName ?? item.title,
      },
      {
        key: "date",
        labelKey: "columns.date",
        render: (item) => (
          <span className="whitespace-nowrap tabular-nums">{formatDateOnly(item.createdAt, locale)}</span>
        ),
      },
      {
        key: "time",
        labelKey: "columns.time",
        render: (item) => (
          <span className="whitespace-nowrap tabular-nums">{formatTimeOnly(item.createdAt, locale)}</span>
        ),
      },
      {
        key: "type",
        labelKey: "columns.type",
        render: (item) => betTypeLabel(item.betRowType, t),
      },
      {
        key: "amount",
        labelKey: "columns.betAmount",
        render: (item) => (
          <span className={toneClass(moneyDeltaRole(item.amount), "font-medium")}>
            {formatAmount(item.amount)}
          </span>
        ),
      },
      {
        key: "open",
        labelKey: "columns.openingBalance",
        render: (item) => (
          <span className="tabular-nums">
            {item.openingBalance != null ? formatAmount(item.openingBalance) : "—"}
          </span>
        ),
      },
      {
        key: "close",
        labelKey: "columns.closingBalance",
        render: (item) => (
          <span className="tabular-nums">
            {item.closingBalance != null ? formatAmount(item.closingBalance) : "—"}
          </span>
        ),
      },
    ];
  }

  return [];
}

function minWidthForKind(kind: TransactionKind): string {
  if (kind === "promotion") return "min-w-[720px]";
  if (kind === "bet") return "min-w-[640px]";
  return "min-w-[520px]";
}

/**
 * ตารางประวัติธุรกรรม — คอลัมน์ตามประเภทแท็บ
 */
export function TransactionHistoryTable({
  kind,
  items,
}: {
  kind: TransactionKind;
  items: TransactionItem[];
}) {
  const t = useT("transactions");
  const locale = useLocale();
  const columns = columnsForKind(kind, t, locale);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: false, end: false });

  const updateEdges = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const left = Math.abs(el.scrollLeft);
    const next = { start: left > 2, end: max - left > 2 };
    setEdges((prev) => (prev.start === next.start && prev.end === next.end ? prev : next));
  }, []);

  useEffect(() => {
    updateEdges();
    const el = scrollRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(updateEdges);
    ro.observe(el);
    return () => ro.disconnect();
  }, [updateEdges, kind, items.length]);

  return (
    <div
      className="soft-card overflow-hidden"
      data-scroll-start={edges.start ? "true" : undefined}
      data-scroll-end={edges.end ? "true" : undefined}
    >
      <div ref={scrollRef} onScroll={updateEdges} className="overflow-x-auto">
        <table className={`w-full border-collapse text-left text-xs sm:text-sm ${minWidthForKind(kind)}`}>
          <thead>
            <tr className="border-b border-white/[0.08] bg-[var(--soft-surface)]">
              {columns.map((col) => (
                <th key={col.key} className="whitespace-nowrap px-3 py-2.5 text-xs font-semibold text-[var(--text-muted)]">
                  {t(col.labelKey)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-3 py-10">
                  <p className="text-center text-sm text-[var(--text-muted)]">{t("empty")}</p>
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="border-b border-white/[0.05] last:border-0">
                  {columns.map((col) => (
                    <td key={col.key} className="px-3 py-2.5 text-[var(--text-on-light)]">
                      {col.render(item)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
