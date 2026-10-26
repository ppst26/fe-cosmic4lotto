"use client";

import React from "react";
import type { VipRankId } from "@/app/types/vip";
import { getVipRankImageSrc, getVipRankTier } from "@/app/data/vipMockData";
import { Lock as LockIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const DIM = {
  xl: "h-36 w-36 sm:h-40 sm:w-40",
  lg: "h-[88px] w-[88px]",
  sm: "h-12 w-12",
  xs: "h-8 w-8",
} as const;

/**
 * ตราแรงค์ VIP — รูป webp จาก public/rank (VIP 0–10)
 * ใช้ในหน้า VIP: hero / carousel แร็งค์ / หัวตารางสิทธิประโยชน์
 */
export function VipRankEmblem({
  rankId,
  size = "lg",
  inactive = false,
}: {
  rankId: VipRankId;
  size?: "xs" | "sm" | "lg" | "xl";
  inactive?: boolean;
}) {
  const tier = getVipRankTier(rankId);
  const src = getVipRankImageSrc(rankId);
  const showLock = inactive && (size === "xl" || size === "lg");

  return (
    <div
      className={cn(
        "relative flex items-center justify-center",
        DIM[size],
        inactive && "opacity-45 grayscale-[0.85]",
      )}
      aria-hidden="true"
    >
      {src ? (
        <img
          src={src}
          alt=""
          width={256}
          height={256}
          decoding="async"
          draggable={false}
          className="h-full w-full select-none object-contain"
        />
      ) : (
        <span className="text-xs font-semibold" style={{ color: tier.accent }}>
          {tier.label}
        </span>
      )}
      {showLock && (
        <span className="absolute inset-0 flex items-center justify-center">
          <LockIcon
            className={cn("text-[var(--text-muted)]/90", size === "xl" ? "h-7 w-7" : "h-5 w-5")}
          />
        </span>
      )}
    </div>
  );
}
