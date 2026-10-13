"use client";

import React from "react";
import type { VipPlayerState, VipRankId } from "@/app/types/vip";
import {
  getVipLevelUpOverallPercent,
  getVipRankDisplayNumber,
  getVipRankLevelUpAmounts,
  getVipRankViewStatus,
  getVipRequirementRankForFocus,
} from "@/app/data/vipMockData";
import { VipRankProgressMetric } from "./VipRankProgressMetric";
import { toneClass } from "../ui/valueTone";
import { useT } from "@/lib/i18n/I18nProvider";

interface VipRankLevelUpCardProps {
  player: VipPlayerState;
  focusRankId: VipRankId;
  /** current = แท็บระดับของฉัน (ไป nextRank เท่านั้น) · carousel = แท็บแร็งค์ */
  mode?: "current" | "carousel";
}

/** การ์ดความคืบหน้าเลื่อนแรงค์ — ฝาก + เทิร์น (AND ทั้งสองเงื่อนไข) */
export function VipRankLevelUpCard({ player, focusRankId, mode = "carousel" }: VipRankLevelUpCardProps) {
  const t = useT("vip");
  const status = getVipRankViewStatus(focusRankId, player.currentRankId);

  if (mode === "current") {
    if (!player.nextRankId) return null;
  } else if (status === "active" && !player.nextRankId && focusRankId === player.currentRankId) {
    return null;
  }

  const requirementRankId =
    mode === "current" && player.nextRankId
      ? player.nextRankId
      : getVipRequirementRankForFocus(focusRankId, player);
  const targetVipNumber = getVipRankDisplayNumber(requirementRankId);
  const { depositTarget, turnoverTarget } = getVipRankLevelUpAmounts(requirementRankId);

  const locked = mode === "carousel" && status === "locked";
  const cleared = mode === "carousel" && status === "cleared";

  const depositProgress = locked ? 0 : cleared ? depositTarget : player.depositProgress;
  const turnoverProgress = locked ? 0 : cleared ? turnoverTarget : player.turnoverProgress;

  const overallPct = getVipLevelUpOverallPercent(depositProgress, turnoverProgress, depositTarget, turnoverTarget);

  const title = cleared ? `VIP ${targetVipNumber}` : t("progress.levelUpTo", { level: targetVipNumber });

  return (
    <section className="soft-panel p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 text-left">
          <h3 className="text-base font-bold text-[var(--text-on-light)] sm:text-lg">{title}</h3>
          <p className="mt-1 text-xs text-[var(--text-muted)] sm:text-sm">{t("progress.bothRequired")}</p>
        </div>
        <span
          className={toneClass("accent", "shrink-0 text-2xl sm:text-[1.75rem]")}
          aria-label={t("progress.overallAriaLabel", { percent: Math.round(overallPct) })}
        >
          {Math.round(overallPct)}%
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4">
        <VipRankProgressMetric
          label={t("progress.deposit")}
          iconKind="deposit"
          progress={depositProgress}
          target={depositTarget}
          locked={locked}
          amountFormat="compact"
        />
        <VipRankProgressMetric
          label={t("progress.turnover")}
          iconKind="turnover"
          progress={turnoverProgress}
          target={turnoverTarget}
          locked={locked}
          amountFormat="compact"
        />
      </div>
    </section>
  );
}
