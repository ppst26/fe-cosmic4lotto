"use client";

import React from "react";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import type { VipModalTabId, VipPlayerState, VipRankTier } from "@/app/types/vip";
import { VipBenefitsComparisonTable } from "./VipBenefitsComparisonTable";
import { VipMaintainRankPanel } from "./VipMaintainRankPanel";
import { VipMyLevelBenefitsCard } from "./VipMyLevelBenefitsCard";
import { VipRankCarousel } from "./VipRankCarousel";
import { VipRankLevelUpCard } from "./VipRankLevelUpCard";
import { useT } from "@/lib/i18n/I18nProvider";
import s from "./vip-page.module.css";

interface VipTabPanelsProps {
  tab: VipModalTabId;
  player: VipPlayerState;
  /** ตารางระดับจาก useVipRanks (VipPageContent) */
  vipRankTiers: VipRankTier[];
  rankFocusIndex: number;
  onRankFocusChange: (index: number) => void;
  onSelectTab?: (tab: VipModalTabId) => void;
}

/** เนื้อหาแท็บ VIP — มือถือเรียงแนวตั้ง · จอกว้าง (lg) แยก 2 คอลัมน์ */
export function VipTabPanels({
  tab,
  player,
  vipRankTiers,
  rankFocusIndex,
  onRankFocusChange,
  onSelectTab,
}: VipTabPanelsProps) {
  const t = useT("vip");

  if (tab === "my-level") {
    return (
      <div className="grid w-full items-start gap-3.5 lg:grid-cols-2" aria-label={t("level.benefitsAndMaintainAriaLabel")}>
        <div className="flex min-w-0 flex-col gap-3.5">
          <VipRankLevelUpCard player={player} focusRankId={player.currentRankId} mode="current" />
          <VipMaintainRankPanel activeRankId={player.currentRankId} />
        </div>
        <div className="flex min-w-0 flex-col gap-3.5">
          <VipMyLevelBenefitsCard player={player} onViewAll={onSelectTab ? () => onSelectTab("benefits") : undefined} />
          <section className={s.cta}>
            <h3 className={s.ctaTitle}>CLIMB HIGHER</h3>
            <p className={s.ctaSub}>{t("cta.sub")}</p>
            <button type="button" className={s.ctaBtn} onClick={() => onSelectTab?.("benefits")}>
              {t("cta.button")}
              <ChevronRight size={16} aria-hidden />
            </button>
            <Image
              src="/assets/check-in/diamon3.avif"
              alt=""
              width={260}
              height={200}
              sizes="(min-width: 1024px) 260px, 50vw"
              className={s.ctaArt}
              aria-hidden
            />
          </section>
        </div>
      </div>
    );
  }

  if (tab === "rank") {
    return (
      <div className="flex w-full flex-col gap-3.5">
        <VipRankCarousel
          focusIndex={rankFocusIndex}
          onFocusChange={onRankFocusChange}
          playerRankId={player.currentRankId}
          vipRankTiers={vipRankTiers}
        />
        <VipRankLevelUpCard
          player={player}
          focusRankId={vipRankTiers[rankFocusIndex]?.id ?? player.currentRankId}
        />
      </div>
    );
  }

  return <VipBenefitsComparisonTable currentRankId={player.currentRankId} />;
}
