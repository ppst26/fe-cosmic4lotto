"use client";

import { useLotteryI18n } from "@/app/components/lottery/useLotteryI18n";
export function LotterySlipToolbar({
  visible,
  canUndo,
  onUndo,
  onClearAll,
}: {
  visible: boolean;
  canUndo: boolean;
  onUndo: () => void;
  onClearAll: () => void;
}) {
  const { t } = useLotteryI18n();

  if (!visible) return null;

  return (
    <div
      className="lottery-slip-toolbar grid grid-cols-2 gap-2"
      role="toolbar"
      aria-label={t("slip.toolbarAria")}
    >
      <button
        type="button"
        className="soft-btn-outline min-h-10 text-xs font-semibold disabled:opacity-40"
        onClick={onUndo}
        disabled={!canUndo}
      >
        {t("slip.undo")}
      </button>
      <button
        type="button"
        className="soft-btn-outline min-h-10 text-xs font-semibold"
        onClick={onClearAll}
      >
        {t("slip.clearAll")}
      </button>
    </div>
  );
}
