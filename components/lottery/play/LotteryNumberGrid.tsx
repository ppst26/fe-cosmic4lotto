"use client";

import { useState } from "react";
import { useLotteryI18n } from "@/app/components/lottery/useLotteryI18n";

const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

type LotteryNumberGridProps = {
  digits: number;
  selectedNumbers: Set<string>;
  disabled?: boolean;
  onToggle: (number: string) => void;
};

export function LotteryNumberGrid({
  digits,
  selectedNumbers,
  disabled = false,
  onToggle,
}: LotteryNumberGridProps) {
  const { t } = useLotteryI18n();
  const [hundred, setHundred] = useState("0");
  const prefix = digits === 3 ? hundred : "";
  const numbers =
    digits === 1 ? DIGITS : DIGITS.flatMap((tens) => DIGITS.map((units) => `${prefix}${tens}${units}`));

  const countInHundred = (value: string) =>
    [...selectedNumbers].filter((number) => number.length === 3 && number.startsWith(value)).length;

  return (
    <div className="flex flex-col gap-3">
      {digits === 3 ? (
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-[var(--text-muted)]" id="thai-lotto-hundred-label">
            {t("pad.hundreds")}
          </span>
          <div
            className="thai-lotto-hundreds grid grid-cols-5 gap-1 sm:grid-cols-10"
            role="group"
            aria-labelledby="thai-lotto-hundred-label"
          >
            {DIGITS.map((value) => {
              const count = countInHundred(value);
              const isActive = value === hundred;
              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={isActive}
                  aria-label={`${value}00–${value}99${count ? ` ${t("pad.selectedCount", { count })}` : ""}`}
                  onClick={() => setHundred(value)}
                  className={`thai-lotto-hundreds__btn relative min-h-8 text-xs font-semibold${isActive ? " is-active" : ""}`}
                >
                  {value}00
                  {count > 0 ? (
                    <span
                      className="absolute top-1 right-1 h-1 w-1 rounded-full bg-[var(--brand)]"
                      aria-hidden="true"
                    />
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      <div
        className={`thai-lotto-grid grid grid-cols-5 gap-1${digits === 1 ? "" : " sm:grid-cols-10"}`}
        role="group"
        aria-label={t("pad.gridAria")}
      >
        {numbers.map((number) => {
          const isSelected = selectedNumbers.has(number);
          return (
            <button
              key={number}
              type="button"
              aria-pressed={isSelected}
              disabled={disabled}
              onClick={() => onToggle(number)}
              className={`thai-lotto-grid__btn min-h-8 text-xs font-semibold${isSelected ? " is-active" : ""}`}
            >
              {number}
            </button>
          );
        })}
      </div>
    </div>
  );
}
