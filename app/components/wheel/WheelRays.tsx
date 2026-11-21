import React from "react";
import { cn } from "@/lib/utils";
import { resolveWheelRays } from "@/lib/domain/wheelTheme";
import type { WheelTheme } from "@/app/types/wheelTheme";

/**
 * รัศมี (rays) หมุนอยู่ด้านหลังวงล้อ — ค่าทั้งหมดมาจาก theme.rays (GET /api/wheel)
 * ไม่ส่ง theme.rays หรือ enabled !== true = ไม่ render · เต็มความกว้างจอ (ไม่มี padding ข้าง) + ขอบซ้าย/ขวาไล่มืด · สไตล์ใน .lucky-wheel__rays
 */
export function WheelRays({ theme }: { theme: WheelTheme | undefined }) {
  const rays = resolveWheelRays(theme);
  if (!rays) return null;
  return (
    <div className="lucky-wheel__rays" style={rays.vars} aria-hidden="true">
      <div
        className={cn(
          "lucky-wheel__rays-disc",
          rays.isStatic && "lucky-wheel__rays--static",
          rays.reverse && "lucky-wheel__rays--reverse",
        )}
      />
    </div>
  );
}
