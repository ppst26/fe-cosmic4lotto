"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { formatRewardPoints } from "@/lib/format";
import { useT } from "@/lib/i18n/I18nProvider";
import { REWARD_GEM_ICON_SRC } from "./rewardAssets";

/** กระดานแลกรางวัล (ปิดใช้งาน · Coming soon) — ใช้ร่วม Lucky Box / Redeem Card; children = ส่วนภาพรางวัล */
export function RewardRedeemBoard({
  heading,
  pointsBalance,
  drawCost,
  comingSoonLabel,
  children,
  className,
}: {
  heading: string;
  pointsBalance: number;
  drawCost: number;
  comingSoonLabel: string;
  children: React.ReactNode;
  className?: string;
}) {
  const t = useT("rewards");
  return (
    <section
      className={cn("soft-panel relative overflow-hidden border border-white/10 p-4", className)}
      aria-label={heading}
    >
      <span
        role="status"
        className="absolute right-3 top-3 z-10 rounded-full bg-[var(--brand-soft)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--brand-strong)]"
      >
        {comingSoonLabel}
      </span>

      <div className="pointer-events-none flex select-none flex-col items-center gap-4 opacity-80">
        <header className="text-center">
          <h2 className="text-xl font-semibold text-[var(--brand-strong)]">{heading}</h2>
          <p className="mt-1 flex items-center justify-center gap-1 text-xs text-[var(--text-muted)]">
            <Image src={REWARD_GEM_ICON_SRC} alt="" width={14} height={14} className="h-3.5 w-3.5 object-contain" />
            {t("redeemBoard.subtitle")}
          </p>
        </header>

        <div className="text-center">
          <p className="text-xs text-[var(--text-muted)]">{t("redeemBoard.pointsLabel")}</p>
          <p className="mt-0.5 flex items-center justify-center gap-2 text-2xl font-semibold text-[var(--text-on-light)]">
            <Image src={REWARD_GEM_ICON_SRC} alt="" width={28} height={28} className="h-7 w-7 object-contain" />
            <span className="tabular-nums">{formatRewardPoints(pointsBalance)}</span>
          </p>
        </div>

        {children}

        <p className="text-sm text-[var(--text-muted)]">{t("redeemBoard.drawCost", { cost: drawCost })}</p>

        <div className="flex w-full flex-col items-center gap-1">
          <button type="button" disabled className="soft-btn-outline h-12 w-full text-sm font-semibold opacity-60">
            {t("redeemBoard.startDraw")}
          </button>
          <span className="text-[11px] text-[var(--text-muted)]">{comingSoonLabel}</span>
        </div>

        <p className="text-[11px] text-[var(--text-muted)]">
          {comingSoonLabel} · {t("redeemBoard.history")}
        </p>
      </div>
    </section>
  );
}
