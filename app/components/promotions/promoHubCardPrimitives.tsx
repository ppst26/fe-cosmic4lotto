"use client";

import React from "react";
import { ChevronRight } from "lucide-react";

/** ป้ายปุ่มทรงแคปซูล (ตกแต่งอย่างเดียว — ตัวการ์ดเป็นลิงก์/ปุ่มอยู่แล้ว) */
export function PromoHubPillLabel({ label }: { label: string }) {
  return (
    <span className="pointer-events-none inline-flex items-center gap-0.5 rounded-full border border-[var(--Main-Primary)]/50 bg-black/30 px-3 py-1.5 text-xs font-semibold text-[var(--Main-Primary)] sm:text-[13px]">
      {label}
      <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
    </span>
  );
}

/** การ์ดโปรโมชัน / กิจกรรม — พื้นการ์ดมืด ขอบ white/10 */
export function promoCardButtonClass(extra?: string) {
  return [
    "relative block w-full overflow-hidden rounded-2xl border border-white/10 bg-[var(--Card-Normal)] text-left",
    "cursor-pointer transition-[transform,border-color] duration-200 hover:border-[var(--Main-Primary)]/40 active:scale-[0.995]",
    extra ?? "",
  ]
    .filter(Boolean)
    .join(" ");
}
