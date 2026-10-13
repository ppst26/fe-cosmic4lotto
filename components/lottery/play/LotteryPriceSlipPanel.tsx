"use client";

import { useImperativeHandle, useRef, type Ref } from "react";
import { formatLotteryDigitsDisplay } from "@/app/components/lottery/lotteryUtils";
import { useLotteryI18n } from "@/app/components/lottery/useLotteryI18n";

export type LotteryPriceSlipEntry = {
  id: string;
  number: string;
  payoutRate: number;
  amount: number;
};

export type LotteryPriceSlipGroup = {
  key: string;
  label: string;
  entries: LotteryPriceSlipEntry[];
};

function parseAmount(raw: string): number {
  const digits = raw.replace(/\D/g, "").slice(0, 7);
  return digits ? Number(digits) : 0;
}

/** คำสั่งจากภายนอก — ใช้หลังกดชิปราคาเพื่อเลื่อนไปช่องราคาถัดไป */
export type LotteryPriceSlipHandle = {
  focusNextAfter: (entryId: string) => boolean;
};

type LotteryPriceSlipPanelProps = {
  groups: LotteryPriceSlipGroup[];
  handleRef?: Ref<LotteryPriceSlipHandle>;
  selectedEntryId: string | null;
  onSelectEntry: (entryId: string) => void;
  onAmountChange: (entryId: string, amount: number) => void;
  onRemove: (entryId: string) => void;
};

export function LotteryPriceSlipPanel({
  groups,
  handleRef,
  selectedEntryId,
  onSelectEntry,
  onAmountChange,
  onRemove,
}: LotteryPriceSlipPanelProps) {
  const { t } = useLotteryI18n();
  const totalCount = groups.reduce((sum, group) => sum + group.entries.length, 0);
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useImperativeHandle(
    handleRef,
    () => ({
      focusNextAfter(entryId) {
        const flat = groups.flatMap((group) => group.entries);
        const index = flat.findIndex((entry) => entry.id === entryId);
        const next = index >= 0 ? flat[index + 1] : undefined;
        if (!next) return false;
        onSelectEntry(next.id);
        const input = inputRefs.current[next.id];
        input?.focus();
        input?.select();
        return true;
      },
    }),
    [groups, onSelectEntry],
  );

  const focusAmount = (entryId: string) => {
    onSelectEntry(entryId);
    requestAnimationFrame(() => inputRefs.current[entryId]?.focus());
  };

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <p className="m-0 text-sm font-bold text-[var(--text-on-light)]">{t("slip.itemCount", { count: totalCount })}</p>

      <div className="flex flex-col gap-2">
        {groups.map((group) => (
          <section key={group.key} aria-label={group.label}>
            <div className="mb-1 flex items-center justify-between px-1 text-xs font-semibold text-[var(--text-muted)]">
              <span>{group.label}</span>
              <span>{t("slip.itemCount", { count: group.entries.length })}</span>
            </div>
            <ul className="m-0 flex list-none flex-col gap-1 p-0">
              {group.entries.map((entry) => {
                const isSelected = entry.id === selectedEntryId;
                return (
                  <li
                    key={entry.id}
                    className={`lottery-price-row flex items-center gap-1 rounded-[var(--radius-soft-sm)] py-1 pr-1 pl-2${isSelected ? " is-selected" : ""}`}
                    onClick={() => onSelectEntry(entry.id)}
                  >
                    <span className="min-w-0 flex-1 font-semibold tabular-nums">
                      {formatLotteryDigitsDisplay(entry.number)}
                    </span>
                    <button
                      type="button"
                      className="shrink-0 rounded-full bg-[var(--brand-soft)] px-2 py-0.5 text-[10px] font-semibold text-[var(--brand)]"
                      onClick={(event) => {
                        event.stopPropagation();
                        focusAmount(entry.id);
                      }}
                    >
                      {t("slip.enterPrice")}
                    </button>
                    <span className="shrink-0 text-xs text-[var(--text-muted)]">x{entry.payoutRate}</span>
                    <input
                      ref={(node) => {
                        inputRefs.current[entry.id] = node;
                      }}
                      inputMode="numeric"
                      value={entry.amount || ""}
                      aria-label={t("slip.priceAria", { label: group.label, number: entry.number })}
                      onFocus={() => onSelectEntry(entry.id)}
                      onClick={(event) => event.stopPropagation()}
                      onChange={(event) => onAmountChange(entry.id, parseAmount(event.target.value))}
                      className="thai-lotto-amount__input h-9 w-14 rounded-[var(--radius-soft-sm)] soft-card-bg text-center text-sm outline-none"
                    />
                    <button
                      type="button"
                      className="grid h-8 w-8 shrink-0 place-items-center text-[var(--text-muted)]"
                      onClick={(event) => {
                        event.stopPropagation();
                        onRemove(entry.id);
                      }}
                      aria-label={t("slip.removeAria", { label: group.label, number: entry.number })}
                    >
                      ×
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
