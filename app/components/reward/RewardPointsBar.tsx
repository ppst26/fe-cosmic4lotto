"use client";

import React from "react";
import Image from "next/image";
import { useT } from "@/lib/i18n/I18nProvider";
import { cn } from "@/lib/utils";
import { formatRewardPoints } from "@/lib/format";
import { REWARD_GEM_ICON_SRC } from "./rewardAssets";

/** แถบยอดพอยท์คงเหลือ — ใช้ซ้ำในหน้าย่อย /reward/* */
export function RewardPointsBar({ pointsBalance, className }: { pointsBalance: number; className?: string }) {
  const t = useT("rewards");
  return (
    <div
      className={cn("soft-card flex items-center border border-white/10 justify-between gap-3 px-3.5 py-2.5", className)}
      aria-label={t("hub.pointsBalance")}
    >
      <p className="text-sm text-[var(--text-muted)]">{t("hub.pointsBalance")}</p>
      <p className="flex items-center gap-2 text-lg font-semibold tabular-nums text-[var(--brand-strong)]">
        <Image src={REWARD_GEM_ICON_SRC} alt="" width={24} height={24} className="h-6 w-6 object-contain" />
        {formatRewardPoints(pointsBalance)}
      </p>
    </div>
  );
}
