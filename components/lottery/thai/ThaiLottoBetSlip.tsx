"use client";

import React, { useCallback, useMemo } from "react";
import type { ThaiLottoBetEntry, ThaiLottoBetType, ThaiLottoBetTypeId } from "@/app/types/lottery";
import { LotteryBetSlip } from "@/components/lottery/play/LotteryBetSlip";
import { useT } from "@/lib/i18n/I18nProvider";

interface ThaiLottoBetSlipProps {
  entries: ThaiLottoBetEntry[];
  betTypes: ThaiLottoBetType[];
  onRemove: (entryId: string) => void;
  onClearAll: () => void;
  canUndo?: boolean;
  onUndo?: () => void;
}

/**
 * โพยหวยรัฐบาล — ห่อ LotteryBetSlip มาตรฐาน
 * ใช้ใน ThaiLottoBetBoard
 */
export function ThaiLottoBetSlip({
  entries,
  betTypes,
  onRemove,
  onClearAll,
  canUndo = false,
  onUndo,
}: ThaiLottoBetSlipProps) {
  const t = useT("lottery");
  const typeById = useMemo(
    () => new Map<ThaiLottoBetTypeId, ThaiLottoBetType>(betTypes.map((type) => [type.id, type])),
    [betTypes],
  );

  const resolveGroup = useCallback(
    (groupKey: string) => {
      const type = typeById.get(groupKey as ThaiLottoBetTypeId);
      if (!type) return undefined;
      return { label: t(type.labelKey), payoutRate: type.payoutRate };
    },
    [typeById, t],
  );

  const pickEntries = entries.map((entry) => ({
    id: entry.id,
    number: entry.number,
    groupKey: entry.typeId,
  }));

  return (
    <LotteryBetSlip
      entries={pickEntries}
      resolveGroup={resolveGroup}
      emptyMessage={t("slip.emptyPickType")}
      titleId="thai-lotto-bet-slip-title"
      onRemove={onRemove}
      onClearAll={onClearAll}
      canUndo={canUndo}
      onUndo={onUndo}
    />
  );
}
