"use client";

import React from "react";
import type {
  LotteryMessageKey,
  ThaiLottoBetType,
  ThaiLottoBetTypeId,
  ThaiLottoDigitGroup,
} from "@/app/types/lottery";
import { useT } from "@/lib/i18n/I18nProvider";

interface ThaiLottoBetTypePickerProps {
  groups: { id: ThaiLottoDigitGroup; labelKey: LotteryMessageKey }[];
  betTypes: ThaiLottoBetType[];
  activeGroup: ThaiLottoDigitGroup;
  selectedTypeIds: ThaiLottoBetTypeId[];
  onGroupChange: (group: ThaiLottoDigitGroup) => void;
  onToggleType: (typeId: ThaiLottoBetTypeId) => void;
  /** single = ยี่กี/บางตลาด · multi = หวยรัฐบาล (ค่าเริ่มต้น) */
  selectionMode?: "multi" | "single";
}

/**
 * เลือกกลุ่มหลัก (3 ตัว / 2 ตัว / เลขวิ่ง) แล้วเลือกประเภทการแทงได้หลายแบบในกลุ่มเดียวกัน
 * ใช้ใน ThaiLottoBetBoard
 */
export function ThaiLottoBetTypePicker({
  groups,
  betTypes,
  activeGroup,
  selectedTypeIds,
  onGroupChange,
  onToggleType,
  selectionMode = "multi",
}: ThaiLottoBetTypePickerProps) {
  const t = useT("lottery");
  const groupTypes = betTypes.filter((type) => type.group === activeGroup);

  return (
    <div className="flex flex-col gap-3">
      <div className="cosmic-segment-track grid grid-cols-3 gap-1" role="group" aria-label={t("board.digitGroupAria")}>
        {groups.map((group) => {
          const isActive = group.id === activeGroup;
          return (
            <button
              key={group.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => onGroupChange(group.id)}
              className={`cosmic-segment-btn text-xs ${
                isActive ? "is-active" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              {t(group.labelKey)}
            </button>
          );
        })}
      </div>

      <div
        className="thai-lotto-type-grid grid grid-cols-2 gap-1.5"
        role="group"
        aria-label={t("board.betTypeAria")}
      >
        {groupTypes.map((type) => {
          const isSelected = selectedTypeIds.includes(type.id);
          return (
            <button
              key={type.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onToggleType(type.id)}
              className={`thai-lotto-type-chip flex min-h-[2.5rem] min-w-0 flex-col items-start justify-center gap-0.5 px-1.5 py-1.5 text-left${isSelected ? " is-active" : ""}`}
            >
              <span className="thai-lotto-type-chip__label max-w-full truncate">{t(type.labelKey)}</span>
              <span className="thai-lotto-type-chip__rate">{t("board.payout", { rate: type.payoutRate })}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
