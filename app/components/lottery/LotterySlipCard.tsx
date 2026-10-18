"use client";

import Link from "@/lib/i18n/navigation";
import type { LotterySubmittedSlip } from "@/app/types/lotterySlip";
import { slipPendingState } from "@/lib/lottery/slipFilters";
import { lotteryPlayMarketMeta } from "@/lib/lottery/resolvePlayRound";
import { moneyDeltaRole, type ValueRole } from "@/lib/semanticValue";
import { toneClass } from "@/app/components/ui/valueTone";
import { LotteryMarketIcon } from "@/components/lottery/hub/LotteryMarketIcon";
import { formatBaht } from "./lotteryUtils";
import { useLotteryI18n } from "./useLotteryI18n";

/** ป้ายสถานะของโพย — pending แยก "รอออกผล" / "รอสรุปผล" · history ตามผล */
export type SlipStatusKey = "waitingDraw" | "waitingSettle" | "won" | "lost" | "void";

export const SLIP_STATUS_ROLE: Record<SlipStatusKey, ValueRole> = {
  waitingDraw: "neutral",
  waitingSettle: "warning",
  won: "success",
  lost: "muted",
  void: "neutral",
};

export function slipStatusKey(slip: LotterySubmittedSlip, now: Date): SlipStatusKey {
  return slip.status === "submitted" ? slipPendingState(slip, now) : slip.status;
}

/** เงินได้/เสียแบบมีเครื่องหมาย เช่น +฿1,800 · −฿100 · ฿0 */
export function formatSignedBaht(value: number): string {
  if (value === 0) return formatBaht(0);
  return `${value > 0 ? "+" : "−"}${formatBaht(Math.abs(value))}`;
}

/** สีเงินได้/เสีย (เขียว = ได้ · แดง = เสีย) */
export function signedMoneyToneClass(amount: number, extra?: string): string {
  return toneClass(moneyDeltaRole(amount), extra);
}

/**
 * การ์ดโพยในรายการ (/lottery/slips) — ตลาด · ป้ายสถานะ · งวด · เวลาออกผล/สรุปผล · จำนวนรายการ · เดิมพัน · ได้/เสีย
 * กดไปหน้ารายละเอียด /lottery/slips/[id]
 */
export function LotterySlipCard({ slip, now }: { slip: LotterySubmittedSlip; now: Date }) {
  const { t, dateTime } = useLotteryI18n();
  const meta = lotteryPlayMarketMeta(slip.market);
  const status = slipStatusKey(slip, now);
  const isSettled = slip.status !== "submitted";

  return (
    <Link
      href={`/lottery/slips/${slip.id}`}
      className="lottery-slips-list__card flex flex-col gap-2 px-4 py-[0.85rem]"
    >
      <div className="flex items-center gap-2.5">
        <LotteryMarketIcon
          marketSlug={slip.market}
          size="sm"
          fallbackLabel={meta.flagLabel}
          fallbackTone={meta.flagTone}
          className="!h-9 !w-9"
        />
        <div className="min-w-0 flex-1">
          <p className="lottery-slips-list__id m-0 truncate">{t(meta.titleKey)}</p>
          <p className="lottery-slips-list__meta m-0 truncate">{slip.drawLabel || t("round.current")}</p>
        </div>
        <span className={toneClass(SLIP_STATUS_ROLE[status], "shrink-0 text-xs font-medium")}>
          {t(`slips.status.${status}`)}
        </span>
      </div>

      <p className="lottery-slips-list__meta m-0">
        {isSettled && slip.settledAt
          ? t("slips.card.settledAt", { date: dateTime(slip.settledAt) })
          : t("slips.card.drawAt", { date: dateTime(slip.drawAt) })}
      </p>

      <div className="flex items-end justify-between gap-3 border-t border-[var(--border-subtle)]/50 pt-2">
        <div className="min-w-0">
          <p className="lottery-slips-list__meta m-0">{t("slip.itemCount", { count: slip.lines.length })}</p>
          <p className="lottery-slips-list__stake m-0 tabular-nums">
            {t("slips.stake", { amount: formatBaht(slip.totalStake) })}
          </p>
        </div>
        {isSettled && slip.winLoss !== null ? (
          <span className={signedMoneyToneClass(slip.winLoss, "shrink-0 text-base font-medium tabular-nums")}>
            {formatSignedBaht(slip.winLoss)}
          </span>
        ) : null}
      </div>
    </Link>
  );
}
