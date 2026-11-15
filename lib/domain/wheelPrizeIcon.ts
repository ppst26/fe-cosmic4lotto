import type { WheelPrizeKind } from "@/app/types/reward";

/** ไอคอนรางวัลตามชนิด — ใช้เมื่อ backend ไม่ส่ง prizeImageSrc มา */
export const WHEEL_PRIZE_ICON_SRC: Record<WheelPrizeKind, string> = {
  gems: "/assets/gems/diamond.avif",
  credit: "/assets/coins/coins1.webp",
};
