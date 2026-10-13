"use client";

import { useMemo, type Ref } from "react";
import type { YikiBetEntry, YikiSettlementTypeId, YikiSettlementType } from "@/app/types/yiki";
import {
  LotteryPriceSlipPanel,
  type LotteryPriceSlipGroup,
  type LotteryPriceSlipHandle,
} from "@/components/lottery/play/LotteryPriceSlipPanel";
import { useT } from "@/lib/i18n/I18nProvider";

interface YikiPricePanelProps {
  entries: YikiBetEntry[];
  settlementTypes: Record<YikiSettlementTypeId, YikiSettlementType>;
  handleRef?: Ref<LotteryPriceSlipHandle>;
  selectedEntryId: string | null;
  onSelectEntry: (entryId: string) => void;
  onAmountChange: (entryId: string, amount: number) => void;
  onRemove: (entryId: string) => void;
}

/** โพยขั้นใส่ราคายี่กี — ห่อ LotteryPriceSlipPanel จัดกลุ่มตามผลการจ่าย */
export function YikiPricePanel({
  entries,
  settlementTypes,
  handleRef,
  selectedEntryId,
  onSelectEntry,
  onAmountChange,
  onRemove,
}: YikiPricePanelProps) {
  const t = useT("lottery");
  const groups = useMemo((): LotteryPriceSlipGroup[] => {
    const order: YikiSettlementTypeId[] = [];
    const map = new Map<YikiSettlementTypeId, YikiBetEntry[]>();
    for (const entry of entries) {
      if (!map.has(entry.settlementTypeId)) {
        map.set(entry.settlementTypeId, []);
        order.push(entry.settlementTypeId);
      }
      map.get(entry.settlementTypeId)!.push(entry);
    }
    return order.map((settlementTypeId) => {
      const settlementType = settlementTypes[settlementTypeId];
      return {
        key: settlementTypeId,
        label: t(settlementType.labelKey),
        entries: map.get(settlementTypeId)!.map((entry) => ({
          id: entry.id,
          number: entry.number,
          payoutRate: settlementType.payoutRate,
          amount: entry.amount ?? 0,
        })),
      };
    });
  }, [entries, settlementTypes, t]);

  return (
    <LotteryPriceSlipPanel
      groups={groups}
      handleRef={handleRef}
      selectedEntryId={selectedEntryId}
      onSelectEntry={onSelectEntry}
      onAmountChange={onAmountChange}
      onRemove={onRemove}
    />
  );
}
