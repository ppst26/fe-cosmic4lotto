"use client";

import React, { useImperativeHandle, useRef } from "react";
import { formatLotteryDigitsDisplay } from "@/app/components/lottery/lotteryUtils";
import { useT } from "@/lib/i18n/I18nProvider";

export interface LotteryPriceSlipEntry {
  id: string;
  number: string;
  payoutRate: number;
  amount: number;
}

export interface LotteryPriceSlipGroup {
  key: string;
  label: string;
  entries: LotteryPriceSlipEntry[];
}

/** คำสั่งจากภายนอก — ใช้หลังกดชิปราคาเพื่อเลื่อนไปช่องราคาถัดไป */
export interface LotteryPriceSlipHandle {
  /**
   * เลือก + โฟกัสช่องราคาของรายการถัดจาก entryId ตามลำดับที่แสดงบนจอ (พร้อมเลือกข้อความเดิมให้พิมพ์ทับได้)
   * เรียกแบบ synchronous ใน event ของผู้ใช้ — iOS ถึงจะไม่ปิดคีย์บอร์ด · คืน false เมื่อเป็นรายการสุดท้าย
   */
  focusNextAfter: (entryId: string) => boolean;
}

interface LotteryPriceSlipPanelProps {
  groups: LotteryPriceSlipGroup[];
  handleRef?: React.Ref<LotteryPriceSlipHandle>;
  selectedEntryId: string | null;
  onSelectEntry: (entryId: string) => void;
  onAmountChange: (entryId: string, amount: number) => void;
  onRemove: (entryId: string) => void;
}

/** แปลงค่าจาก input เป็นจำนวนเต็มบาท (ว่าง = 0) */
function parseAmount(raw: string): number {
  const digits = raw.replace(/\D/g, "").slice(0, 7);
  return digits ? Number(digits) : 0;
}

/**
 * รายการโพยขั้นใส่ราคา/ส่งโพย — จัดกลุ่มตามประเภท · แถวเลข · ป้ายใส่ราคา · อัตรา · ช่องบาท · ลบ
 * ใช้ใน YikiBetBoard · ThaiLottoBetBoard (ขั้น price) และตลาดหวยอื่นที่ใช้ flow เดียวกัน
 */
export function LotteryPriceSlipPanel({
  groups,
  handleRef,
  selectedEntryId,
  onSelectEntry,
  onAmountChange,
  onRemove,
}: LotteryPriceSlipPanelProps) {
  const t = useT("lottery");
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
    <div className="lottery-price-slip flex flex-col gap-2 min-w-0">
      <div className="lottery-price-slip__head m-0">{t("slip.itemCount", { count: totalCount })}</div>

      <div className="lottery-price-slip__list flex flex-col gap-2">
        {groups.map((group) => (
          <section key={group.key} className="lottery-price-slip__group" aria-label={group.label}>
            <div className="lottery-price-slip__group-head flex items-center justify-between px-2 py-[0.35rem]">
              <span>{group.label}</span>
              <span>{t("slip.itemCount", { count: group.entries.length })}</span>
            </div>
            <ul className="lottery-price-slip__rows flex flex-col gap-1 m-0 p-0">
              {group.entries.map((entry) => {
                const inputId = `lottery-price-amount-${entry.id}`;
                const isSelected = entry.id === selectedEntryId;
                return (
                  <li
                    key={entry.id}
                    className={`lottery-price-row flex items-center gap-1 py-[0.3rem] pr-[0.35rem] pl-2${isSelected ? " is-selected" : ""}`}
                    onClick={() => onSelectEntry(entry.id)}
                  >
                    <span className="lottery-price-row__number flex-1 min-w-0">
                      {formatLotteryDigitsDisplay(entry.number)}
                    </span>
                    <button
                      type="button"
                      className="lottery-price-row__tag shrink-0 min-h-[1.65rem] px-[0.45rem]"
                      onClick={(event) => {
                        event.stopPropagation();
                        focusAmount(entry.id);
                      }}
                    >
                      {t("slip.enterPrice")}
                    </button>
                    <span className="lottery-price-row__rate shrink-0">x{entry.payoutRate}</span>
                    <span className="thai-lotto-amount thai-lotto-amount--sm lottery-price-row__amount inline-flex items-center gap-1 min-h-9 flex-[0_0_2.75rem] min-w-0 px-[0.35rem]">
                      <input
                        ref={(node) => {
                          inputRefs.current[entry.id] = node;
                        }}
                        id={inputId}
                        inputMode="numeric"
                        value={entry.amount || ""}
                        aria-label={t("slip.priceAria", { label: group.label, number: entry.number })}
                        onFocus={() => onSelectEntry(entry.id)}
                        onClick={(event) => event.stopPropagation()}
                        onChange={(event) => onAmountChange(entry.id, parseAmount(event.target.value))}
                        className="thai-lotto-amount__input w-full min-w-0 text-center"
                      />
                    </span>
                    <button
                      type="button"
                      className="lottery-price-row__remove grid shrink-0 place-items-center w-7 h-7"
                      onClick={(event) => {
                        event.stopPropagation();
                        onRemove(entry.id);
                      }}
                      aria-label={t("slip.removeAria", { label: group.label, number: entry.number })}
                    >
                      <TrashIcon />
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

function TrashIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden>
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
