"use client";

import React, { useId } from "react";
import type { WheelSegment } from "@/app/types/reward";
import type { WheelTheme } from "@/app/types/wheelTheme";
import {
  resolveWheelTheme,
  safeCssColor,
  safeImageUrl,
  segmentFill,
  wheelThemeCssVars,
} from "@/lib/domain/wheelTheme";
import { cn } from "@/lib/utils";
import "./luckyWheel.css";
import { useT } from "@/lib/i18n/I18nProvider";

interface CosmicFortuneWheelProps {
  segments: WheelSegment[];
  rotationDeg: number;
  spinning: boolean;
  onCenterClick?: () => void;
  centerDisabled?: boolean;
  /** ธีมจาก API (GET /api/wheel → theme) — ไม่ส่ง = ดีไซน์เริ่มต้น */
  theme?: WheelTheme;
}

/** ปัดพิกัด SVG ให้ SSR/client ตรงกัน (ลด hydration mismatch จาก float) */
function roundSvgCoord(value: number) {
  return Math.round(value * 1000) / 1000;
}

/** แปลงมุมเป็น x,y รอบวง */
function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return {
    x: roundSvgCoord(cx + r * Math.cos(rad)),
    y: roundSvgCoord(cy + r * Math.sin(rad)),
  };
}

/** path ช่องวงล้อ */
function wedgePath(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const start = polar(cx, cy, r, startDeg);
  const end = polar(cx, cy, r, endDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y} Z`;
}

/**
 * วงล้อรางวัล — จำนวนช่องตามข้อมูล (2–16) · ปรับหน้าตาทั้งชุดผ่าน theme
 * ชิ้นที่ปรับได้: วงนอก/กรอบ · ไฟรอบวง · สีช่อง (สลับ/รายช่อง) · ไอคอนรางวัล · เข็มชี้ · ปุ่ม SPIN/โลโก้ · พื้นหลัง · เวลาหมุน
 * ใช้ใน LuckyWheelPageContent
 */
export function CosmicFortuneWheel({
  segments,
  rotationDeg,
  spinning,
  onCenterClick,
  centerDisabled,
  theme,
}: CosmicFortuneWheelProps) {
  const tr = useT("rewards");
  const uid = useId().replace(/:/g, "");
  const hubGradId = `wheelHub-${uid}`;
  const cx = 200;
  const cy = 200;
  const r = 168;

  const t = resolveWheelTheme(theme);
  const slices = segments.slice(0, 16);
  const segmentDeg = 360 / Math.max(slices.length, 1);
  const hasIcons = slices.some((segment) => safeImageUrl(segment.iconUrl));

  return (
    <div
      className={cn(
        "lucky-wheel__stage",
        t.lightAnimation !== "none" && `lucky-wheel__stage--lights-${t.lightAnimation}`,
        spinning && t.fastLightsWhileSpinning && "lucky-wheel__stage--lights-fast",
      )}
      style={wheelThemeCssVars(theme)}
    >
      {t.pointerImageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- รูปจาก API (โดเมนไม่แน่นอน) ขนาดเล็ก
        <img src={t.pointerImageUrl} alt="" className="lucky-wheel__pointer-img" draggable={false} />
      ) : (
        <div className="lucky-wheel__pointer" aria-hidden="true" />
      )}

      <div
        className="lucky-wheel__disc"
        style={{
          transform: `rotate(${rotationDeg}deg)`,
          transition: spinning
            ? `transform ${t.spinDurationMs}ms cubic-bezier(0.12, 0.85, 0.18, 1)`
            : "none",
        }}
      >
        <svg viewBox="0 0 400 400" className="lucky-wheel__svg" aria-hidden="true">
          <defs>
            <radialGradient id={hubGradId} cx="50%" cy="45%" r="55%">
              <stop offset="0%" stopColor="var(--soft-card-elevated)" />
              <stop offset="100%" stopColor="var(--soft-card)" />
            </radialGradient>
          </defs>

          {/* แถบวงนอก (พื้นใต้ไฟ) — โปร่งใสถ้าธีมไม่กำหนด */}
          <circle cx={cx} cy={cy} r={r + 10} className="lucky-wheel__rim-band" strokeWidth={14} fill="none" />

          <circle
            cx={cx}
            cy={cy}
            r={r + 12}
            fill="none"
            className="lucky-wheel__rim"
            strokeWidth={t.rimWidth}
          />

          {Array.from({ length: t.lightCount }).map((_, i) => {
            const dot = polar(cx, cy, r + 10, (360 / t.lightCount) * i);
            return (
              <circle
                key={`dot-${i}`}
                cx={dot.x}
                cy={dot.y}
                r={t.lightSize}
                className={cn("lucky-wheel__rim-dot", i % 2 === 1 && "lucky-wheel__rim-dot--odd")}
                style={
                  t.lightAnimation === "chase"
                    ? ({ "--wheel-light-index": i, "--wheel-light-count": t.lightCount } as React.CSSProperties)
                    : undefined
                }
              />
            );
          })}

          {slices.map((segment, index) => {
            const start = index * segmentDeg;
            const end = start + segmentDeg;
            const mid = start + segmentDeg / 2;
            const iconUrl = safeImageUrl(segment.iconUrl);
            /** มีไอคอน = ไอคอนด้านนอก ข้อความขยับเข้าใน */
            const labelPos = polar(cx, cy, r * (hasIcons ? 0.56 : 0.64), mid);
            const iconPos = polar(cx, cy, r * 0.8, mid);
            const fill = segmentFill(index, segment, t.segmentColors);
            const labelColor = safeCssColor(segment.labelColor);

            return (
              <g key={segment.id}>
                <path
                  d={wedgePath(cx, cy, r, start, end)}
                  className={cn(
                    "lucky-wheel__slice",
                    !fill && (index % 2 === 0 ? "lucky-wheel__slice--a" : "lucky-wheel__slice--b"),
                  )}
                  style={{
                    ...(fill ? { fill } : null),
                    ...(t.segmentBorderWidth !== undefined ? { strokeWidth: t.segmentBorderWidth } : null),
                  }}
                />
                {iconUrl ? (
                  <image
                    href={iconUrl}
                    x={iconPos.x - t.iconSize / 2}
                    y={iconPos.y - t.iconSize / 2}
                    width={t.iconSize}
                    height={t.iconSize}
                    preserveAspectRatio="xMidYMid meet"
                    transform={`rotate(${roundSvgCoord(mid)} ${iconPos.x} ${iconPos.y})`}
                    className="lucky-wheel__slice-icon"
                  />
                ) : null}
                <g transform={`translate(${labelPos.x} ${labelPos.y}) rotate(${roundSvgCoord(mid)})`}>
                  <text
                    y={4}
                    textAnchor="middle"
                    className="lucky-wheel__slice-label"
                    style={{
                      ...(labelColor ? { fill: labelColor } : null),
                      ...(t.labelSize ? { fontSize: t.labelSize } : null),
                    }}
                  >
                    {segment.label}
                  </text>
                </g>
              </g>
            );
          })}

          <circle cx={cx} cy={cy} r={36} fill={`url(#${hubGradId})`} className="lucky-wheel__hub-ring" />
        </svg>
      </div>

      {t.frameImageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- กรอบจาก API (โดเมนไม่แน่นอน) ทับทั้งวง
        <img src={t.frameImageUrl} alt="" className="lucky-wheel__frame-img" draggable={false} />
      ) : null}

      <button
        type="button"
        className="lucky-wheel__hub-btn"
        disabled={centerDisabled || spinning}
        onClick={onCenterClick}
        aria-label={tr("wheel.spinAria")}
        /** letter-spacing ของ "SPIN" ทำให้ภาษาไทยห่างเกิน — ปิดเมื่อข้อความไม่ใช่ตัวอักษรละติน */
        style={/[^\x20-\x7e]/.test(t.hubLabel) ? { letterSpacing: 0 } : undefined}
      >
        {t.hubLogoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- โลโก้จาก API
          <img src={t.hubLogoUrl} alt="" className="lucky-wheel__hub-logo" draggable={false} />
        ) : (
          t.hubLabel
        )}
      </button>
    </div>
  );
}
