"use client";

import React from "react";
import { useT } from "@/lib/i18n/I18nProvider";

/**
 * แถบล่างโพย — ย้อนรายการล่าสุด · ล้างทั้งหมด (โทนเดียวกับตัวอย่างยี่กี)
 * ใช้ใน LotteryBetSlip
 */
export function LotterySlipToolbar({
  visible,
  canUndo,
  onUndo,
  onClearAll,
}: {
  visible: boolean;
  canUndo: boolean;
  onUndo: () => void;
  onClearAll: () => void;
}) {
  const t = useT("lottery");
  if (!visible) return null;

  return (
    <div
      className="lottery-slip-toolbar grid grid-cols-[1fr_1px_1fr] items-stretch overflow-hidden"
      role="toolbar"
      aria-label={t("slip.toolbarAria")}
    >
      <button
        type="button"
        className="lottery-slip-toolbar__btn grid place-items-center min-h-10"
        onClick={onUndo}
        disabled={!canUndo}
        aria-label={t("slip.undo")}
      >
        <UndoIcon />
      </button>
      <div className="lottery-slip-toolbar__divider" aria-hidden="true" />
      <button
        type="button"
        className="lottery-slip-toolbar__btn grid place-items-center min-h-10"
        onClick={onClearAll}
        aria-label={t("slip.clearAll")}
      >
        <TrashIcon />
      </button>
    </div>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-[1.125rem] w-[1.125rem]" fill="none" aria-hidden>
      <path
        d="M4 6h12M8 6V4.5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1V6m-7 0 .6 9.4a1 1 0 0 0 1 .9h5.8a1 1 0 0 0 1-.9L15 6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UndoIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-[1.125rem] w-[1.125rem]" fill="none" aria-hidden>
      <path
        d="M6.5 5 3 8.5 6.5 12"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 8.5h8.5a4 4 0 1 1 0 8H8"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
