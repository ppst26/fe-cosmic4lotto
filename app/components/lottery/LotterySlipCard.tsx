"use client";

import Link from "@/lib/i18n/navigation";
import type { LotterySubmittedSlip } from "@/app/types/lotterySlip";
import { slipPendingState } from "@/lib/lottery/slipFilters";
import { lotteryPlayMarketMeta } from "@/lib/lottery/resolvePlayRound";
import { moneyDeltaRole, type ValueRole } from "@/lib/semanticValue";
import { toneClass } from "@/app/components/ui/valueTone";
import { LotteryFlagOrb } from "@/components/lottery/hub/LotteryFlagOrb";
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
      className="lottery-slips-list__card lottery-soft-card flex flex-col gap-2 px-4 py-3"
    >
      <div className="flex items-center gap-2.5">
        <LotteryFlagOrb
          label={meta.flagLabel}
          tone={meta.flagTone}
          size="sm"
          className="!h-9 !w-9"
        />
        <div className="min-w-0 flex-1">
          <p className="m-0 truncate text-sm font-bold text-[var(--text-on-light)]">{t(meta.titleKey)}</p>
          <p className="m-0 truncate text-xs text-[var(--text-muted)]">
            {slip.drawLabel || t("round.current")}
          </p>
        </div>
        <span className={toneClass(SLIP_STATUS_ROLE[status], "shrink-0 text-xs font-semibold")}>
          {t(`slips.status.${status}`)}
        </span>
      </div>

      <p className="m-0 text-xs text-[var(--text-muted)]">
        {isSettled && slip.settledAt
          ? t("slips.card.settledAt", { date: dateTime(slip.settledAt) })
          : t("slips.card.drawAt", { date: dateTime(slip.drawAt) })}
      </p>

      <div className="flex items-end justify-between gap-3 border-t border-white/[0.06] pt-2">
        <div className="min-w-0">
          <p className="m-0 text-xs text-[var(--text-muted)]">
            {t("slip.itemCount", { count: slip.lines.length })}
          </p>
          <p className="m-0 text-sm font-semibold tabular-nums text-[var(--text-on-light)]">
            {t("slips.stake", { amount: formatBaht(slip.totalStake) })}
          </p>
        </div>
        {isSettled && slip.winLoss !== null ? (
          <span className={signedMoneyToneClass(slip.winLoss, "shrink-0 text-base font-bold")}>
            {formatSignedBaht(slip.winLoss)}
          </span>
        ) : null}
      </div>
    </Link>
  );
}
