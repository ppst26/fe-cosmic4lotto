import React from "react";
import type { Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

/** ดาว 5 แฉก — คืน points ของ <polygon> */
function star(cx: number, cy: number, r: number, rotate = 0): string {
  const inner = r * 0.382;
  return Array.from({ length: 10 }, (_, i) => {
    const radius = i % 2 === 0 ? r : inner;
    const angle = ((-90 + rotate + i * 36) * Math.PI) / 180;
    return `${(cx + radius * Math.cos(angle)).toFixed(2)},${(cy + radius * Math.sin(angle)).toFixed(2)}`;
  }).join(" ");
}

/**
 * ธงแบบวงกลมในกรอบ 24×24 — วาดให้องค์ประกอบหลักอยู่ในวงกลม (ไม่ใช่สัดส่วนธงจริง)
 * en ใช้ธงสหราชอาณาจักร
 */
const FLAGS: Record<Locale, React.ReactNode> = {
  th: (
    <>
      <rect width="24" height="24" fill="#a51931" />
      <rect y="4" width="24" height="16" fill="#f4f5f8" />
      <rect y="8" width="24" height="8" fill="#2d2a4a" />
    </>
  ),
  en: (
    <>
      <rect width="24" height="24" fill="#012169" />
      <path d="M0 0 24 24M24 0 0 24" stroke="#fff" strokeWidth="4.8" />
      <path d="M0 0 24 24M24 0 0 24" stroke="#c8102e" strokeWidth="1.6" />
      <path d="M12 0v24M0 12h24" stroke="#fff" strokeWidth="6.4" />
      <path d="M12 0v24M0 12h24" stroke="#c8102e" strokeWidth="3.6" />
    </>
  ),
  lo: (
    <>
      <rect width="24" height="24" fill="#ce1126" />
      <rect y="6" width="24" height="12" fill="#002868" />
      <circle cx="12" cy="12" r="4.8" fill="#fff" />
    </>
  ),
  my: (
    <>
      <rect width="24" height="24" fill="#ea2839" />
      <rect width="24" height="16" fill="#34b233" />
      <rect width="24" height="8" fill="#fecb00" />
      <polygon points={star(12, 12.6, 7.4)} fill="#fff" />
    </>
  ),
  vi: (
    <>
      <rect width="24" height="24" fill="#da251d" />
      <polygon points={star(12, 12.6, 7.4)} fill="#ffcd00" />
    </>
  ),
  zh: (
    <>
      <rect width="24" height="24" fill="#de2910" />
      <polygon points={star(8, 9, 4.4)} fill="#ffde00" />
      <polygon points={star(13.6, 4.8, 1.4, 20)} fill="#ffde00" />
      <polygon points={star(15.8, 7.6, 1.4, 45)} fill="#ffde00" />
      <polygon points={star(15.8, 11.2, 1.4, 0)} fill="#ffde00" />
      <polygon points={star(13.6, 13.8, 1.4, 20)} fill="#ffde00" />
    </>
  ),
  id: (
    <>
      <rect width="24" height="24" fill="#f4f5f8" />
      <rect width="24" height="12" fill="#ce1126" />
    </>
  ),
  fil: (
    <>
      <rect width="24" height="24" fill="#ce1126" />
      <rect width="24" height="12" fill="#0038a8" />
      <path d="M0 0 14 12 0 24Z" fill="#fff" />
      <circle cx="5" cy="12" r="2.2" fill="#fcd116" />
    </>
  ),
  km: (
    <>
      <rect width="24" height="24" fill="#032ea1" />
      <rect y="6" width="24" height="12" fill="#e00025" />
      <path
        d="M5.5 16h13v-1.2h-1.2v-2.2h-1v-1.8h-.8V9.2h-.7V8h-.6v1.2h-.8V7.4h-.7V6h-.6v1.4h-.7v1.8h-.8V8h-.6v1.2h-.7v1.6h-.8v1.8h-1v2.2H5.5Z"
        fill="#fff"
      />
    </>
  ),
};

/** ธงประจำภาษา (วงกลม) — ใช้ในตัวเลือกภาษาและไทล์เมนู */
export function LocaleFlag({ locale, className }: { locale: Locale; className?: string }) {
  const clipId = `locale-flag-${React.useId()}`;
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("shrink-0 rounded-full shadow-[inset_0_0_0_1px_rgb(255_255_255/0.18)]", className)}
      aria-hidden="true"
    >
      <clipPath id={clipId}>
        <circle cx="12" cy="12" r="12" />
      </clipPath>
      <g clipPath={`url(#${clipId})`}>{FLAGS[locale]}</g>
      <circle cx="12" cy="12" r="11.5" fill="none" stroke="rgb(255 255 255 / 0.22)" />
    </svg>
  );
}
