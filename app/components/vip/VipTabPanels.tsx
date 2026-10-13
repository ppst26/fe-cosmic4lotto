"use client";

import React from "react";
import type { VipModalTabId, VipPlayerState, VipRankTier } from "@/app/types/vip";
import { getVipRankTier } from "@/app/data/vipMockData";
import { VipBenefitsComparisonTable } from "./VipBenefitsComparisonTable";
import { VipMaintainRankPanel } from "./VipMaintainRankPanel";
import { VipMyLevelBenefitsCard } from "./VipMyLevelBenefitsCard";
import { VipRankCarousel } from "./VipRankCarousel";
import { VipRankEmblem } from "./VipRankEmblem";
import { VipRankLevelUpCard } from "./VipRankLevelUpCard";
import { useT } from "@/lib/i18n/I18nProvider";

interface VipTabPanelsProps {
  tab: VipModalTabId;
  player: VipPlayerState;
  /** ตารางระดับจาก useVipRanks (VipPageContent) */
  vipRankTiers: VipRankTier[];
  rankFocusIndex: number;
  onRankFocusChange: (index: number) => void;
}

/** เนื้อหาแท็บ VIP — มือถือเรียงแนวตั้ง · จอกว้าง (lg) แยก 2 คอลัมน์ */
export function VipTabPanels({ tab, player, vipRankTiers, rankFocusIndex, onRankFocusChange }: VipTabPanelsProps) {
  const t = useT("vip");

  if (tab === "my-level") {
    const currentTier = getVipRankTier(player.currentRankId);
    const nextTier = player.nextRankId ? getVipRankTier(player.nextRankId) : null;

    return (
      <div className="flex w-full flex-col items-center gap-4">
        <div className="flex flex-col items-center text-center" aria-label={t("level.currentAriaLabel")}>
          <p className="text-sm font-semibold text-[var(--text-muted)]">{t("level.label")}</p>
          <div className="my-2">
            <VipRankEmblem rankId={player.currentRankId} size="lg" />
          </div>
          <p className="text-2xl font-semibold tracking-[0.2em]" style={{ color: currentTier.accent }}>
            {currentTier.label}
          </p>
          {nextTier ? (
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              {t("level.next")} <span className="font-semibold text-[var(--text-on-light)]">{nextTier.label}</span>
            </p>
          ) : null}
        </div>

        <div
          className="grid w-full gap-3 lg:grid-cols-2"
          aria-label={t("level.benefitsAndMaintainAriaLabel")}
        >
          <div className="flex min-w-0 flex-col gap-3">
            <VipRankLevelUpCard player={player} focusRankId={player.currentRankId} mode="current" />
            <VipMaintainRankPanel activeRankId={player.currentRankId} />
          </div>
          <div className="flex min-w-0 flex-col gap-3">
            <VipMyLevelBenefitsCard player={player} />
          </div>
        </div>
      </div>
    );
  }

  if (tab === "rank") {
    return (
      <div className="grid w-full items-start gap-4 lg:grid-cols-2">
        <div className="flex w-full flex-col items-center gap-3">
          <VipRankCarousel
            focusIndex={rankFocusIndex}
            onFocusChange={onRankFocusChange}
            playerRankId={player.currentRankId}
            vipRankTiers={vipRankTiers}
          />
        </div>
        <VipRankLevelUpCard
          player={player}
          focusRankId={vipRankTiers[rankFocusIndex]?.id ?? player.currentRankId}
        />
      </div>
    );
  }

  return <VipBenefitsComparisonTable currentRankId={player.currentRankId} />;
}
