import React from "react";
import { cn } from "@/lib/utils";
import { resolveWheelRays } from "@/lib/domain/wheelTheme";
import type { WheelTheme } from "@/app/types/wheelTheme";

/**
 * รัศมี (rays) หมุนอยู่ด้านหลังวงล้อ — ค่าทั้งหมดมาจาก theme.rays (GET /api/wheel)
 * ไม่ส่ง theme.rays หรือ enabled !== true = ไม่ render · สไตล์ใน .lucky-wheel__rays
 */
export function WheelRays({ theme }: { theme: WheelTheme | undefined }) {
  const rays = resolveWheelRays(theme);
  if (!rays) return null;
  return (
    <div
      className={cn(
        "lucky-wheel__rays",
        rays.isStatic && "lucky-wheel__rays--static",
        rays.reverse && "lucky-wheel__rays--reverse",
      )}
      style={rays.vars}
      aria-hidden="true"
    />
  );
}
