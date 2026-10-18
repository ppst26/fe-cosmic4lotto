"use client";

import React from "react";
import type { YikiBetEntry } from "@/app/types/yiki";
import { LotteryPriceControls } from "@/components/lottery/play/LotteryPriceControls";

interface YikiPriceControlsProps {
  selectedEntry: YikiBetEntry | null;
  sameForAll: boolean;
  onToggleSameForAll: (checked: boolean) => void;
  onQuickAmount: (amount: number) => void;
  onBack: () => void;
  onSubmit: () => void;
  submitDisabled: boolean;
  isSubmitting?: boolean;
  total: number;
}

/** แผงใส่ราคายี่กี — ห่อ LotteryPriceControls ใช้ใน YikiBetBoard */
export function YikiPriceControls({
  selectedEntry,
  sameForAll,
  onToggleSameForAll,
  onQuickAmount,
  onBack,
  onSubmit,
  submitDisabled,
  isSubmitting,
  total,
}: YikiPriceControlsProps) {
  return (
    <LotteryPriceControls
      sameForAll={sameForAll}
      onToggleSameForAll={onToggleSameForAll}
      onBack={onBack}
      onQuickAmount={onQuickAmount}
      onSubmit={onSubmit}
      submitDisabled={submitDisabled}
      isSubmitting={isSubmitting}
      total={total}
      selectedAmount={selectedEntry?.amount ?? null}
    />
  );
}
