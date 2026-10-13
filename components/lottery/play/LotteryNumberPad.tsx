"use client";

import { Delete } from "lucide-react";
import { useLotteryI18n } from "@/app/components/lottery/useLotteryI18n";
const PAD_DIGITS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

type LotteryNumberPadProps = {
  digits: number;
  value: string;
  onDigit: (digit: string) => void;
  onBackspace: () => void;
  onClear: () => void;
};

export function LotteryNumberPad({
  digits,
  value,
  onDigit,
  onBackspace,
  onClear,
}: LotteryNumberPadProps) {
  const { t } = useLotteryI18n();
  return (
    <div className="lottery-number-pad flex flex-col gap-2">
      <div
        className="thai-lotto-slots flex justify-center gap-1.5"
        aria-live="polite"
        aria-label={t("pad.enteredAria", { value: value || t("pad.empty") })}
      >
        {Array.from({ length: digits }, (_, index) => {
          const char = value[index];
          const isNext = index === value.length;
          return (
            <span
              key={index}
              className={`thai-lotto-slot grid h-9 w-8 place-items-center rounded-[var(--radius-soft-sm)] text-sm font-bold${char ? " is-filled" : ""}${isNext ? " is-next" : ""}`}
              aria-hidden="true"
            >
              {char ?? ""}
            </span>
          );
        })}
      </div>

      <div className="thai-lotto-pad grid grid-cols-3 gap-1">
        {PAD_DIGITS.map((digit) => (
          <button
            key={digit}
            type="button"
            className="thai-lotto-pad__key min-h-10 text-sm font-semibold"
            onClick={() => onDigit(digit)}
          >
            {digit}
          </button>
        ))}
        <button
          type="button"
          className="thai-lotto-pad__key thai-lotto-pad__key--muted min-h-10 text-xs font-semibold"
          onClick={onClear}
          disabled={!value}
        >
          {t("pad.clear")}
        </button>
        <button
          type="button"
          className="thai-lotto-pad__key min-h-10 text-sm font-semibold"
          onClick={() => onDigit("0")}
        >
          0
        </button>
        <button
          type="button"
          className="thai-lotto-pad__key thai-lotto-pad__key--muted min-h-10"
          onClick={onBackspace}
          disabled={!value}
          aria-label={t("pad.backspace")}
        >
          <Delete className="mx-auto h-4 w-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}
