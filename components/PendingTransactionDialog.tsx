"use client";

import React from "react";
import Link from "@/lib/i18n/navigation";
import { Copy, X } from "lucide-react";
import type { PendingTransactionPayload } from "@/app/types/transaction";
import { useToast } from "@/context/ToastContext";
import { useT } from "@/lib/i18n/I18nProvider";
import { usePresence, useLastValue } from "@/lib/usePresence";
import { useLocale } from "@/lib/i18n/navigation";
import { formatTransactionDateTimeMedium } from "@/app/lib/transactionDateUtils";

interface PendingTransactionDialogProps {
  payload: PendingTransactionPayload | null;
  onClose: () => void;
}

export function PendingTransactionDialog({ payload: payloadProp, onClose }: PendingTransactionDialogProps) {
  const payload = useLastValue(payloadProp);
  const { rendered, state } = usePresence(payloadProp !== null);
  const t = useT("wallet");
  const locale = useLocale();
  const { showToast } = useToast();

  if (!payload || !rendered) return null;

  const handleCopyRef = async () => {
    try {
      await navigator.clipboard.writeText(payload.referenceCopyValue);
      showToast(t("pending.referenceCopied"), "success", 2500);
    } catch {
      showToast(t("pending.referenceCopyFailed"), "error");
    }
  };

  return (
    <div
      className="lotto-overlay-scrim fixed inset-0 z-[140] flex items-center justify-center p-4 bg-black/60 select-none"
      data-state={state}
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        data-state={state}
        aria-labelledby="pending-tx-title"
        aria-describedby="pending-tx-desc"
        className="lotto-overlay-panel lotto-overlay-panel--modal overlay-theme relative rounded-3xl border border-white/10 bg-[var(--BG-Surface-Darker)] text-[var(--text-on-light)] shadow-[var(--shadow-soft)] w-full max-w-[400px] px-5 pb-5 pt-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent text-[var(--text-muted)] transition-colors hover:text-[var(--text-on-light)]"
          aria-label={t("pending.close")}
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center pt-2 text-center">
          {payload.kind === "deposit" ? (
            <PendingDepositGraphic className="mb-3 h-24 w-24" />
          ) : (
            <PendingWithdrawGraphic className="mb-3 h-24 w-24" />
          )}


          <h2 id="pending-tx-title" className="text-lg font-semibold text-[var(--text-on-light)] sm:text-xl">
            {t(payload.titleKey)}
          </h2>
          <p id="pending-tx-desc" className="mt-1 text-sm font-medium text-[var(--text-muted)]">
            {t(payload.subtitleKey)}
          </p>
        </div>

        <p className="mt-6 text-center text-4xl font-semibold tracking-tight text-[var(--text-on-light)] sm:text-[2.75rem]">
          <span className="text-[var(--brand)]">฿</span> {payload.amountDisplay}
        </p>

        <hr className="my-5 border-white/[0.06]" />

        <dl className="space-y-3 text-sm">
          {payload.rows.map((row) => {
            const isRef = row.labelKey === "pending.rows.reference";
            const value = row.valueKey
              ? t(row.valueKey)
              : row.dateTime
                ? formatTransactionDateTimeMedium(row.dateTime, locale)
                : row.value;
            return (
              <div key={row.labelKey} className="flex items-start justify-between gap-3">
                <dt className="shrink-0 font-medium text-[var(--text-muted)]">{t(row.labelKey)}</dt>
                <dd className="flex min-w-0 items-center justify-end gap-1.5 text-right font-semibold text-[var(--text-on-light)]">
                  <span className="truncate">{value}</span>
                  {isRef && (
                    <button
                      type="button"
                      onClick={handleCopyRef}
                      className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-md border-0 bg-[var(--BG-Surface-Normal)] text-[var(--brand)] hover:bg-[var(--brand-soft)]"
                      aria-label={t("pending.copyReference")}
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  )}
                </dd>
              </div>
            );
          })}
        </dl>

        <button
          type="button"
          onClick={onClose}
          className="soft-btn-primary mt-6 flex h-12 w-full cursor-pointer items-center justify-center text-[15px] font-semibold active:scale-[0.98]"
        >
          {t("pending.done")}
        </button>

        <Link
          href={payload.historyHref}
          onClick={onClose}
          className="mt-4 block text-center text-sm font-semibold text-[var(--text-muted)] underline underline-offset-4 transition-colors hover:text-[var(--text-primary)]"
        >
          {t("pending.viewHistory")}
        </Link>
      </div>
    </div>
  );
}

function PendingDepositGraphic({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
      <ellipse cx="48" cy="78" rx="28" ry="8" fill="#000" opacity="0.15" />
      <rect x="22" y="36" width="52" height="38" rx="10" fill="#3a3320" stroke="#ffd15c" strokeWidth="1.5" />
      <rect x="22" y="42" width="52" height="8" rx="2" fill="#2a2518" />
      <circle cx="48" cy="24" r="14" fill="#fde047" stroke="#ca8a04" strokeWidth="1.5" />
      <path d="M48 18v12M42 24h12" stroke="#92400e" strokeWidth="2" strokeLinecap="round" />
      <circle cx="68" cy="68" r="10" fill="#28282b" stroke="#fde047" strokeWidth="1.5" />
      <path d="M68 64v5l2 2" stroke="#fde047" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="68" cy="64" r="1.5" fill="#fde047" />
    </svg>
  );
}

function PendingWithdrawGraphic({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
      <ellipse cx="48" cy="78" rx="28" ry="8" fill="#000" opacity="0.15" />
      <path
        d="M28 38 48 28 68 38 V58 C68 68 48 76 48 76 C48 76 28 68 28 58 Z"
        fill="#3a3320"
        stroke="#ffd15c"
        strokeWidth="1.5"
      />
      <path
        d="M58 48 H78 L74 44 M78 48 74 52"
        stroke="#ffd15c"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="68" cy="62" r="10" fill="#28282b" stroke="#fde047" strokeWidth="1.5" />
      <path d="M68 58v5l2 2" stroke="#fde047" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="68" cy="58" r="1.5" fill="#fde047" />
    </svg>
  );
}
