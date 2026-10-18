"use client";

import React, { useCallback } from "react";
import type { YikiBetEntry, YikiSettlementTypeId, YikiSettlementType } from "@/app/types/yiki";
import { LotteryBetSlip } from "@/components/lottery/play/LotteryBetSlip";
import { useT } from "@/lib/i18n/I18nProvider";

interface YikiSlipProps {
  entries: YikiBetEntry[];
  settlementTypes: Record<YikiSettlementTypeId, YikiSettlementType>;
  canUndo: boolean;
  onRemove: (entryId: string) => void;
  onUndo: () => void;
  onClearAll: () => void;
}

/**
 * โพยยี่กี/หวยหุ้น — ห่อ LotteryBetSlip มาตรฐานเดียวกับหวยรัฐบาล
 * ใช้ใน YikiBetBoard
 */
export function YikiSlip({
  entries,
  settlementTypes,
  canUndo,
  onRemove,
  onUndo,
  onClearAll,
}: YikiSlipProps) {
  const t = useT("lottery");
  const resolveGroup = useCallback(
    (groupKey: string) => {
      const settlementType = settlementTypes[groupKey as YikiSettlementTypeId];
      if (!settlementType) return undefined;
      return { label: t(settlementType.labelKey), payoutRate: settlementType.payoutRate };
    },
    [settlementTypes, t],
  );

  const pickEntries = entries.map((entry) => ({
    id: entry.id,
    number: entry.number,
    groupKey: entry.settlementTypeId,
  }));

  return (
    <LotteryBetSlip
      entries={pickEntries}
      resolveGroup={resolveGroup}
      emptyMessage={t("slip.emptyEnterNumber")}
      titleId="yiki-bet-slip-title"
      onRemove={onRemove}
      onClearAll={onClearAll}
      canUndo={canUndo}
      onUndo={onUndo}
    />
  );
}
