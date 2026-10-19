"use client";

import React from "react";
import { ArrowDownLeft, ArrowUpRight, X } from "lucide-react";
import { useT } from "@/lib/i18n/I18nProvider";
import { usePresence } from "@/lib/usePresence";

export type WalletConfirmKind = "deposit" | "withdraw";

export interface WalletConfirmDialogProps {
  kind: WalletConfirmKind;
  open: boolean;
  loading?: boolean;
  title: string;
  description?: string;
  confirmLabel: string;
  amountLabel: string;
  /** ยอดที่จัดรูปแบบแล้ว (ไม่รวมสัญลักษณ์ ฿) */
  amountDisplay: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function WalletConfirmDialog({
  kind,
  open,
  loading = false,
  title,
  description,
  confirmLabel,
  amountLabel,
  amountDisplay,
  onClose,
  onConfirm,
}: WalletConfirmDialogProps) {
  const tc = useT("common");
  const tw = useT("wallet");
  const { rendered, state } = usePresence(open);
  if (!rendered) return null;

  const isDeposit = kind === "deposit";

  return (
    <div
      className="lotto-overlay-scrim fixed inset-0 z-[130] flex select-none items-center justify-center bg-black/60 p-4"
      data-state={state}
      role="presentation"
      onClick={() => {
        if (!loading) onClose();
      }}
    >
      <div
        role="alertdialog"
        aria-labelledby="wallet-confirm-title"
        aria-describedby="wallet-confirm-desc"
        className="lotto-overlay-panel lotto-overlay-panel--modal overlay-theme relative rounded-3xl border border-white/10 bg-[var(--BG-Surface-Darker)] text-[var(--text-on-light)] shadow-[var(--shadow-soft)] w-full max-w-[360px] p-5 sm:p-6"
        data-state={state}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          disabled={loading}
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent text-[var(--text-muted)] transition-colors hover:text-[var(--text-on-light)] disabled:opacity-50"
          aria-label={tc("close")}
        >
          <X className="h-4 w-4" />
        </button>

        <div className="pb-3 text-center">
          <div
            className={`mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-lg ${
              isDeposit ? "text-emerald-400" : "text-amber-400"
            }`}
          >
            {isDeposit ? (
              <ArrowDownLeft className="h-7 w-7 stroke-[2.5]" />
            ) : (
              <ArrowUpRight className="h-7 w-7 stroke-[2.5]" />
            )}
          </div>
          <h3 id="wallet-confirm-title" className="text-lg font-semibold text-[var(--text-on-light)]">
            {title}
          </h3>
          {description ? (
            <p id="wallet-confirm-desc" className="mt-0.5 text-xs text-[var(--text-muted)]">
              {description}
            </p>
          ) : null}
        </div>

        <div className="my-3 rounded-lg bg-[var(--BG-Surface-Normal)] p-3.5 text-xs sm:text-[13px]">
          <div className="flex items-center justify-between text-[var(--text-muted)]">
            <span>{amountLabel}</span>
            <span className="font-sans text-base font-semibold text-[var(--brand)]">฿{amountDisplay}</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 pt-1">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="h-11 flex-1 cursor-pointer rounded-lg border-0 bg-[var(--BG-Surface-Normal)] text-sm font-semibold text-[var(--text-on-light)] transition-colors hover:bg-[var(--Card-Normal)] disabled:opacity-50"
          >
            {tc("cancel")}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className="soft-btn-primary h-11 flex-1 cursor-pointer text-sm font-semibold transition-transform active:scale-95 disabled:opacity-60"
          >
            {loading ? tw("shared.submitting") : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
