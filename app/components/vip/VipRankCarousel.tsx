"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { VipRankId, VipRankTier } from "@/app/types/vip";
import { getVipRankViewStatus } from "@/app/data/vipMockData";
import { VipRankEmblem } from "./VipRankEmblem";
import { VipStardust } from "./VipStardust";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/I18nProvider";
import s from "./vip-page.module.css";

interface VipRankCarouselProps {
  focusIndex: number;
  onFocusChange: (index: number) => void;
  playerRankId: VipRankId;
  /** ตารางระดับจาก useVipRanks (ส่งลงมาจาก VipPageContent) */
  vipRankTiers: VipRankTier[];
}

/** เวทีแรงค์ — ตรากลางใหญ่ ข้างละ 1–2 ตราจาง (กดเลื่อนได้) + ปุ่มลูกศร — แท็บแร็งค์ */
export function VipRankCarousel({ focusIndex, onFocusChange, playerRankId, vipRankTiers }: VipRankCarouselProps) {
  const t = useT("vip");
  const safeIndex = Math.max(0, Math.min(focusIndex, vipRankTiers.length - 1));
  const focused = vipRankTiers[safeIndex];
  const focusStatus = getVipRankViewStatus(focused.id, playerRankId);
  const isLocked = focusStatus === "locked";

  const statusLabel =
    focusStatus === "active"
      ? t("rankStatus.current")
      : focusStatus === "cleared"
        ? t("rankStatus.cleared")
        : t("rankStatus.locked");

  const canPrev = safeIndex > 0;
  const canNext = safeIndex < vipRankTiers.length - 1;

  /** ตราข้าง: offset -2,-1 ซ้าย · +1,+2 ขวา (ตัวไกลซ่อนบนจอแคบ) */
  const side = (offset: number) => {
    const tier = vipRankTiers[safeIndex + offset];
    if (!tier) return <span className={cn(s.rankSide, Math.abs(offset) === 2 && s.rankSideFar)} aria-hidden />;
    const locked = getVipRankViewStatus(tier.id, playerRankId) === "locked";
    return (
      <button
        type="button"
        className={cn(s.rankSide, Math.abs(offset) === 2 && s.rankSideFar)}
        onClick={() => onFocusChange(safeIndex + offset)}
        aria-label={tier.label}
      >
        <VipRankEmblem rankId={tier.id} size={Math.abs(offset) === 2 ? "sm" : "lg"} inactive={locked} />
        {tier.label}
      </button>
    );
  };

  return (
    <div className={s.rankStage}>
      <button
        type="button"
        onClick={() => canPrev && onFocusChange(safeIndex - 1)}
        disabled={!canPrev}
        className={cn(s.rankArrow, s.arrowL)}
        aria-label={t("carousel.previous")}
      >
        <ChevronLeft className="h-5 w-5" aria-hidden />
      </button>
      <button
        type="button"
        onClick={() => canNext && onFocusChange(safeIndex + 1)}
        disabled={!canNext}
        className={cn(s.rankArrow, s.arrowR)}
        aria-label={t("carousel.next")}
      >
        <ChevronRight className="h-5 w-5" aria-hidden />
      </button>

      {side(-2)}
      {side(-1)}
      <div className={s.rankMain}>
        <div className={s.rankEmblemBox}>
          {isLocked ? null : <VipStardust accent={focused.accent} />}
          <VipRankEmblem rankId={focused.id} size="xl" inactive={isLocked} />
        </div>
        <p className={s.rankName} style={isLocked ? undefined : { color: focused.accent }}>
          {focused.label}
        </p>
        <p className={s.rankStatus}>{statusLabel}</p>
      </div>
      {side(1)}
      {side(2)}
    </div>
  );
}
