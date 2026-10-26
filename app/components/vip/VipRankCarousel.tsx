"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { VipRankId, VipRankTier } from "@/app/types/vip";
import { getVipRankViewStatus } from "@/app/data/vipMockData";
import { VipRankEmblem } from "./VipRankEmblem";
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

/** เรนเดอร์ตราห่างจากตัวกลางไม่เกินเท่านี้ — ตัว ±3 ซ่อนไว้นอกจอ เป็นตัวที่จะเลื่อนเข้ามา */
const RENDER_RANGE = 3;

/**
 * เวทีแรงค์ — ตรากลางใหญ่ ข้างละ 1–2 ตราจาง (กดเลื่อนได้) + ปุ่มลูกศร — แท็บแร็งค์
 * ทุกตราเป็น element เดิม (key ตาม id) วางตำแหน่งด้วย data-offset → เปลี่ยนตัวกลางแล้ว CSS transition เลื่อน/ย่อ-ขยายให้เอง
 */
export function VipRankCarousel({ focusIndex, onFocusChange, playerRankId, vipRankTiers }: VipRankCarouselProps) {
  const t = useT("vip");
  const safeIndex = Math.max(0, Math.min(focusIndex, vipRankTiers.length - 1));

  const canPrev = safeIndex > 0;
  const canNext = safeIndex < vipRankTiers.length - 1;

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

      {vipRankTiers.map((tier, index) => {
        const offset = index - safeIndex;
        if (Math.abs(offset) > RENDER_RANGE) return null;
        const status = getVipRankViewStatus(tier.id, playerRankId);
        const locked = status === "locked";
        const focused = offset === 0;
        const hidden = Math.abs(offset) === RENDER_RANGE;
        const statusLabel =
          status === "active"
            ? t("rankStatus.current")
            : status === "cleared"
              ? t("rankStatus.cleared")
              : t("rankStatus.locked");

        return (
          <button
            key={tier.id}
            type="button"
            data-offset={offset}
            className={cn(s.rankItem, focused && s.rankItemFocus)}
            onClick={() => !focused && onFocusChange(index)}
            aria-label={focused ? undefined : tier.label}
            aria-current={focused ? "true" : undefined}
            aria-hidden={hidden || undefined}
            tabIndex={focused || hidden ? -1 : 0}
          >
            <span className={s.rankEmblem}>
              <VipRankEmblem rankId={tier.id} size="xl" inactive={locked} />
            </span>
            <span
              className={s.rankName}
              style={focused && !locked ? { color: tier.accent } : undefined}
            >
              {tier.label}
            </span>
            <span className={s.rankStatus}>{statusLabel}</span>
          </button>
        );
      })}
    </div>
  );
}
