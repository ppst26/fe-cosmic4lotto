"use client";

import React from "react";
import Image from "next/image";
import type { VipRankId } from "@/app/types/vip";
import { getVipRankImageSrc } from "@/app/data/vipMockData";
import { Lock as LockIcon } from "lucide-react";

/**
 * ตราแรงค์ VIP — รูป webp โปร่งใสจาก public/rank/img (ภาพนิ่งที่ capture จากวิดีโอเดิม)
 * ใช้ใน modal แท็บระดับของฉัน / แร็งค์ / ตารางสิทธิประโยชน์ · ประกายฟุ้งด้านหลังใช้ <VipStardust />
 */
export function VipRankEmblem({
  rankId,
  size = "lg",
  inactive = false,
}: {
  rankId: VipRankId;
  size?: "xs" | "sm" | "lg" | "xl" | "2xl";
  inactive?: boolean;
  /** คงไว้เพื่อความเข้ากันได้กับผู้เรียกเดิม (ตอนเป็นวิดีโอใช้หยุดเฟรม) */
  playing?: boolean;
}) {
  const dim =
    size === "2xl"
      ? "h-40 w-40 sm:h-52 sm:w-52"
      : size === "xl"
        ? "h-32 w-32 sm:h-36 sm:w-36"
        : size === "lg"
          ? "h-[88px] w-[88px]"
          : size === "sm"
            ? "h-12 w-12"
            : "h-8 w-8";
  const lockLg = size === "xl" || size === "lg" || size === "2xl";
  const px = size === "2xl" ? 208 : size === "xl" ? 144 : size === "lg" ? 88 : size === "sm" ? 48 : 32;

  return (
    <div
      className={`relative flex ${dim} items-center justify-center ${inactive ? "opacity-45 grayscale-[0.85]" : ""}`}
      aria-hidden="true"
    >
      <Image
        src={getVipRankImageSrc(rankId)}
        alt=""
        width={px}
        height={px}
        unoptimized
        draggable={false}
        className="h-full w-full object-contain drop-shadow-[0_6px_14px_rgba(0,0,0,0.45)]"
      />
      {inactive && lockLg && (
        <span className="absolute inset-0 flex items-center justify-center">
          <LockIcon className={`text-[var(--text-muted)] ${size === "xl" || size === "2xl" ? "h-7 w-7" : "h-5 w-5"}`} />
        </span>
      )}
    </div>
  );
}
