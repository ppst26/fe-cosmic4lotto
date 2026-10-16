import React from "react";
import Image from "next/image";
import type { LotteryFlagTone } from "@/app/types/lottery";
import { getLotteryIconSrc } from "@/app/data/lotteryIconAssets";
import { cn } from "@/lib/utils";
import { LotteryFlagOrb } from "./LotteryFlagOrb";

export type LotteryMarketIconSize = "sm" | "md" | "lg" | "feature";

const SIZE_CLASS: Record<LotteryMarketIconSize, string> = {
  sm: "w-10 h-10",
  md: "w-12 h-12",
  lg: "w-14 h-14",
  feature: "w-[3.25rem] h-[3.25rem]",
};

const PIXEL_SIZE: Record<LotteryMarketIconSize, number> = {
  sm: 40,
  md: 48,
  lg: 56,
  feature: 52,
};

interface LotteryMarketIconProps {
  /** segment หลัง /lottery/ — ใช้แมปรูปใน lotteryIconAssets */
  marketSlug?: string;
  /** ข้ามแมป slug ถ้ารู้ path ตรง */
  src?: string;
  size?: LotteryMarketIconSize;
  className?: string;
  /** fallback เมื่อไม่มีรูป */
  fallbackLabel?: string;
  fallbackTone?: LotteryFlagTone;
}

/**
 * ไอคอนประเภทหวยจาก public/lottery — ไม่มีรูปจะ fallback เป็น LotteryFlagOrb
 * ใช้ใน hub, sidebar ตลาด, ผลหวย, การ์ดงวด
 */
export function LotteryMarketIcon({
  marketSlug,
  src: srcProp,
  size = "md",
  className,
  fallbackLabel = "?",
  fallbackTone = "th",
}: LotteryMarketIconProps) {
  const resolvedSrc = srcProp ?? (marketSlug ? getLotteryIconSrc(marketSlug) : undefined);

  if (!resolvedSrc) {
    const orbSize = size === "feature" ? "lg" : size;
    return (
      <LotteryFlagOrb
        label={fallbackLabel}
        tone={fallbackTone}
        size={orbSize}
        className={className}
      />
    );
  }

  const px = PIXEL_SIZE[size];

  return (
    <span
      className={cn(
        "lottery-market-icon relative inline-flex shrink-0 items-center justify-center",
        SIZE_CLASS[size],
        className,
      )}
      aria-hidden
    >
      <Image
        src={resolvedSrc}
        alt=""
        width={px}
        height={px}
        className="h-full w-full object-contain"
      />
    </span>
  );
}
