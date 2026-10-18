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
import { useT } from "@/lib/i18n/I18nProvider";
import { cn } from "@/lib/utils";
import s from "./vip-page.module.css";

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

  /** เน้น "VIP 10" เป็นสีทองในหัวข้อ (ตัดจากข้อความแปล) */
  const marker = `VIP ${targetVipNumber}`;
  const raw = cleared ? marker : t("progress.levelUpTo", { level: targetVipNumber });
  const at = raw.indexOf(marker);
  const title =
    at >= 0 ? (
      <>
        {raw.slice(0, at)}
        <span className={s.hl}>{marker}</span>
        {raw.slice(at + marker.length)}
      </>
    ) : (
      raw
    );

  return (
    <section className={`${s.panel} motion-reveal`}>
      <div className={s.panelHead}>
        <div className="min-w-0">
          <h3 className={s.panelTitle}>{title}</h3>
          <p className={s.panelSub}>{t("progress.bothRequired")}</p>
        </div>
        <div className={s.percentWrap} aria-label={t("progress.overallAriaLabel", { percent: Math.round(overallPct) })}>
          <span className={s.percent}>
            {Math.round(overallPct)}
            <small>%</small>
          </span>
          <div className={cn(s.bar, s.barTop)}>
            <div className={cn(s.barFill, s.barPurple, "motion-bar")} style={{ width: `${Math.min(100, overallPct)}%` }} />
          </div>
        </div>
      </div>

      <div className={s.metrics}>
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
