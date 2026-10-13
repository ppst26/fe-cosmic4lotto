"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { VipRankId, VipRankTier } from "@/app/types/vip";
import { getVipRankViewStatus, getVipTurnoverTarget } from "@/app/data/vipMockData";
import { VipRankEmblem } from "./VipRankEmblem";
import { formatVipAmount } from "@/lib/format";
import { toneClass } from "../ui/valueTone";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/I18nProvider";

interface VipRankCarouselProps {
  focusIndex: number;
  onFocusChange: (index: number) => void;
  playerRankId: VipRankId;
  /** ตารางระดับจาก useVipRanks (ส่งลงมาจาก VipPageContent) */
  vipRankTiers: VipRankTier[];
}

const arrowClass =
  "absolute top-[42%] z-20 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-0 bg-[var(--soft-card-elevated)] text-[var(--text-on-light)] shadow-[var(--shadow-soft-sm)] transition-colors hover:bg-[var(--brand-soft)] disabled:pointer-events-none disabled:opacity-0";

/** แรงค์กลาง + ปุ่มเลื่อน — แท็บแร็งค์ */
export function VipRankCarousel({ focusIndex, onFocusChange, playerRankId, vipRankTiers }: VipRankCarouselProps) {
  const t = useT("vip");
  const safeIndex = Math.max(0, Math.min(focusIndex, vipRankTiers.length - 1));
  const focused = vipRankTiers[safeIndex];
  const focusStatus = getVipRankViewStatus(focused.id, playerRankId);
  const isLocked = focusStatus === "locked";
  const isCleared = focusStatus === "cleared";
  const isActive = focusStatus === "active";

  const statusLabel = isActive
    ? t("rankStatus.current")
    : isCleared
      ? t("rankStatus.cleared")
      : t("rankStatus.locked");

  const canPrev = safeIndex > 0;
  const canNext = safeIndex < vipRankTiers.length - 1;

  return (
    <div className="relative mx-auto w-full max-w-[280px] sm:max-w-xs">
      <button
        type="button"
        onClick={() => canPrev && onFocusChange(safeIndex - 1)}
        disabled={!canPrev}
        className={cn(arrowClass, "left-0")}
        aria-label={t("carousel.previous")}
      >
        <ChevronLeft className="h-5 w-5" aria-hidden />
      </button>
      <button
        type="button"
        onClick={() => canNext && onFocusChange(safeIndex + 1)}
        disabled={!canNext}
        className={cn(arrowClass, "right-0")}
        aria-label={t("carousel.next")}
      >
        <ChevronRight className="h-5 w-5" aria-hidden />
      </button>

      <div className="flex flex-col items-center gap-2 px-11 py-2 text-center">
        <VipRankEmblem rankId={focused.id} size="xl" inactive={isLocked} playing={!isLocked} />
        <p
          className={`text-2xl font-semibold tracking-[0.15em] sm:text-[1.65rem] ${isLocked ? "text-[var(--text-muted)]" : ""}`}
          style={isLocked ? undefined : { color: focused.accent }}
        >
          {focused.label}
        </p>
        <p
          className={cn(
            "text-xs font-semibold sm:text-sm",
            isActive
              ? "text-[var(--text-on-light)]"
              : isCleared
                ? toneClass("success")
                : "text-[var(--text-muted)]",
          )}
        >
          {statusLabel}
        </p>
        {!isActive && focused.id !== "silver" && (
          <p className="text-xs text-[var(--text-muted)]">
            {t("carousel.turnoverTarget", { amount: formatVipAmount(getVipTurnoverTarget(focused.id)) })}
          </p>
        )}
      </div>
    </div>
  );
}
