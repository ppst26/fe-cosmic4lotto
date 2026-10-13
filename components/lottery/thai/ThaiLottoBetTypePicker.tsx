"use client";

import { useT } from "@/lib/i18n/I18nProvider";
import type {
  LotteryMessageKey,
  ThaiLottoBetType,
  ThaiLottoBetTypeId,
  ThaiLottoDigitGroup,
} from "@/app/types/lottery";

type ThaiLottoBetTypePickerProps = {
  groups: { id: ThaiLottoDigitGroup; labelKey: LotteryMessageKey }[];
  betTypes: ThaiLottoBetType[];
  activeGroup: ThaiLottoDigitGroup;
  selectedTypeIds: ThaiLottoBetTypeId[];
  onGroupChange: (group: ThaiLottoDigitGroup) => void;
  onToggleType: (typeId: ThaiLottoBetTypeId) => void;
  /** single = ยี่กี/บางตลาด · multi = หวยรัฐบาล (ค่าเริ่มต้น) — ตัวเลือกเดียวกับ glass */
  selectionMode?: "multi" | "single";
};

export function ThaiLottoBetTypePicker({
  groups,
  betTypes,
  activeGroup,
  selectedTypeIds,
  onGroupChange,
  onToggleType,
}: ThaiLottoBetTypePickerProps) {
  const t = useT("lottery");
  const groupTypes = betTypes.filter((type) => type.group === activeGroup);

  return (
    <div className="flex flex-col gap-3">
      <div className="lottery-segment-track grid grid-cols-3 gap-1" role="group" aria-label={t("board.digitGroupAria")}>
        {groups.map((group) => {
          const isActive = group.id === activeGroup;
          return (
            <button
              key={group.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => onGroupChange(group.id)}
              className={`lottery-segment-btn text-xs${isActive ? " is-active" : ""}`}
            >
              {t(group.labelKey)}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-1.5" role="group" aria-label={t("board.betTypeAria")}>
        {groupTypes.map((type) => {
          const isSelected = selectedTypeIds.includes(type.id);
          return (
            <button
              key={type.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onToggleType(type.id)}
              className={`thai-lotto-type-chip flex min-h-10 flex-col items-start justify-center gap-0.5 px-2 py-1.5 text-left${isSelected ? " is-active" : ""}`}
            >
              <span className="max-w-full truncate text-xs font-semibold">{t(type.labelKey)}</span>
              <span className="text-[10px] text-[var(--text-muted)]">{t("board.payout", { rate: type.payoutRate })}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
