"use client";

import React from "react";
import { X } from "lucide-react";
import type { LotteryBetDialogState } from "@/app/hooks/useLotteryBetSubmit";
import { useT } from "@/lib/i18n/I18nProvider";

interface LotteryBetResultDialogProps {
  state: LotteryBetDialogState | null;
  onClose: () => void;
}

/**
 * Dialog แจ้งส่งโพยไม่สำเร็จ — สำเร็จไปหน้าสรุปโพยแทน
 */
export function LotteryBetResultDialog({ state, onClose }: LotteryBetResultDialogProps) {
  const t = useT("lottery");

  if (!state) return null;

  return (
    <div
      className="fixed inset-0 z-[130] flex animate-fade-in items-center justify-center bg-black/60 p-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="lottery-bet-result-title"
        aria-describedby="lottery-bet-result-desc"
        className="modal-surface relative w-full max-w-[360px] animate-scale-up p-5 sm:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border-0 soft-panel-bg text-[var(--text-muted)] transition-colors hover:text-[var(--text-on-light)]"
          aria-label={t("submit.close")}
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-col items-center pt-2 text-center">
          <span
            className="lottery-bet-result-dialog__icon is-error flex h-14 w-14 items-center justify-center rounded-lg bg-red-500/15 text-red-400"
            aria-hidden="true"
          >
            <X className="h-6 w-6 stroke-[2.5]" />
          </span>
          <h3 id="lottery-bet-result-title" className="mt-3 text-lg font-semibold text-[var(--text-on-light)]">
            {t("submit.failedTitle")}
          </h3>
          <p id="lottery-bet-result-desc" className="mt-1 text-sm text-[var(--text-muted)]">
            {state.message}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="soft-btn-primary mt-6 flex h-12 w-full items-center justify-center text-base font-semibold"
        >
          {t("submit.done")}
        </button>
      </div>
    </div>
  );
}
