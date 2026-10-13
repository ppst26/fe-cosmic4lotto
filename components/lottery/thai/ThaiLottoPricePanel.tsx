"use client";

import { useMemo, type Ref } from "react";
import type { ThaiLottoBetEntry, ThaiLottoBetType, ThaiLottoBetTypeId } from "@/app/types/lottery";
import { useT } from "@/lib/i18n/I18nProvider";
import {
  LotteryPriceSlipPanel,
  type LotteryPriceSlipGroup,
  type LotteryPriceSlipHandle,
} from "@/components/lottery/play/LotteryPriceSlipPanel";

export function ThaiLottoPricePanel({
  entries,
  betTypes,
  handleRef,
  selectedEntryId,
  onSelectEntry,
  onAmountChange,
  onRemove,
}: {
  entries: ThaiLottoBetEntry[];
  betTypes: ThaiLottoBetType[];
  handleRef?: Ref<LotteryPriceSlipHandle>;
  selectedEntryId: string | null;
  onSelectEntry: (entryId: string) => void;
  onAmountChange: (entryId: string, amount: number) => void;
  onRemove: (entryId: string) => void;
}) {
  const t = useT("lottery");
  const typeById = useMemo(
    () => new Map<ThaiLottoBetTypeId, ThaiLottoBetType>(betTypes.map((type) => [type.id, type])),
    [betTypes],
  );

  const groups = useMemo((): LotteryPriceSlipGroup[] => {
    const order: ThaiLottoBetTypeId[] = [];
    const map = new Map<ThaiLottoBetTypeId, ThaiLottoBetEntry[]>();
    for (const entry of entries) {
      if (!map.has(entry.typeId)) {
        map.set(entry.typeId, []);
        order.push(entry.typeId);
      }
      map.get(entry.typeId)!.push(entry);
    }
    return order.map((typeId) => {
      const type = typeById.get(typeId);
      return {
        key: typeId,
        label: type ? t(type.labelKey) : typeId,
        entries: map.get(typeId)!.map((entry) => ({
          id: entry.id,
          number: entry.number,
          payoutRate: type?.payoutRate ?? 0,
          amount: entry.amount,
        })),
      };
    });
  }, [entries, typeById, t]);

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
