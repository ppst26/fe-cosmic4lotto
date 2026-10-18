"use client";

import React from "react";
import { formatBaht } from "@/app/components/lottery/lotteryUtils";
import { useT } from "@/lib/i18n/I18nProvider";

const QUICK_AMOUNTS = [5, 10, 20, 50, 100];

interface LotteryPriceControlsProps {
  sameForAll: boolean;
  onToggleSameForAll: (checked: boolean) => void;
  /** กลับไปแก้เลข — ปุ่ม "แก้ไข" และ "กลับแก้ไขเลข" */
  onBack: () => void;
  onQuickAmount: (amount: number) => void;
  onSubmit: () => void;
  submitDisabled: boolean;
  /** กำลังเรียก API ส่งโพย */
  isSubmitting?: boolean;
  total: number;
  /** ราคาที่เลือกอยู่ — ไฮไลต์ชิปเมื่อตรง */
  selectedAmount?: number | null;
}

/**
 * แถบใส่ราคา — ราคาเท่ากันทั้งหมด · แก้ไข · ยอดรวม · ชิปด่วน · กลับแก้ไขเลข / ส่งโพย
 * ใช้คู่ LotteryPriceSlipPanel ในขั้น price ของทุกประเภทหวย
 */
export function LotteryPriceControls({
  sameForAll,
  onToggleSameForAll,
  onBack,
  onQuickAmount,
  onSubmit,
  submitDisabled,
  isSubmitting = false,
  total,
  selectedAmount = null,
}: LotteryPriceControlsProps) {
  const t = useT("lottery");
  return (
    <div className="lottery-price-controls flex flex-col gap-3" aria-label={t("price.aria")}>
      <div className="lottery-price-controls__toolbar grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2">
        <label className="lottery-price-controls__checkbox inline-flex min-w-0 items-center gap-2 text-[var(--text-secondary)]">
          <input
            type="checkbox"
            className="h-4 w-4"
            checked={sameForAll}
            onChange={(event) => onToggleSameForAll(event.target.checked)}
          />
          <span>{t("price.sameForAll")}</span>
        </label>
        <button
          type="button"
          className="lottery-price-controls__edit inline-flex min-h-8 items-center gap-1 px-2"
          onClick={onBack}
        >
          <PencilIcon />
          {t("price.edit")}
        </button>
        <div
          className="lottery-price-controls__total-badge inline-flex items-center gap-[0.35rem] py-[0.2rem] pr-[0.55rem] pl-[0.45rem]"
          aria-live="polite"
        >
          <span className="lottery-price-controls__total-label">{t("price.total")}</span>
          <span className="lottery-price-controls__total-value">{formatBaht(total)}</span>
        </div>
      </div>

      <div
        className="lottery-price-controls__chips grid grid-cols-5 gap-2"
        role="group"
        aria-label={t("price.chipsAria")}
      >
        {QUICK_AMOUNTS.map((amount) => (
          <button
            key={amount}
            type="button"
            aria-pressed={selectedAmount === amount}
            onClick={() => onQuickAmount(amount)}
            className={`lottery-price-chip lottery-price-chip--${amount} min-h-10${
              selectedAmount === amount ? " is-active" : ""
            }`}
          >
            {amount}
          </button>
        ))}
      </div>

      <div className="lottery-price-controls__actions grid grid-cols-2 gap-2">
        <button
          type="button"
          className="lottery-price-controls__back min-h-11"
          onClick={onBack}
        >
          {t("price.backToNumbers")}
        </button>
        <button
          type="button"
          className="cosmic-cta-primary cosmic-cta-primary--lg lottery-price-controls__submit min-h-11"
          onClick={onSubmit}
          disabled={submitDisabled || isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? t("price.submitting") : t("price.submit")}
        </button>
      </div>
    </div>
  );
}

function PencilIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden>
      <path
        d="M13.5 3.5a2.12 2.12 0 0 1 3 3L7 16l-4 1 1-4 9.5-9.5Z"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinejoin="round"
      />
    </svg>
  );
}
