import type { CSSProperties } from "react";
import type { CssColor, ImageUrl, WheelSegmentStyle, WheelTheme } from "@/app/types/wheelTheme";

/**
 * แปลง/กรองธีมวงล้อจาก API ก่อนใช้ — ค่าที่ไม่ผ่านถูกทิ้ง (กลับไปใช้ดีไซน์เริ่มต้น)
 * ใช้ใน CosmicFortuneWheel · มี test ใน wheelTheme.test.ts
 */

export const WHEEL_DEFAULT_SPIN_MS = 4200;
export const WHEEL_DEFAULT_LIGHT_COUNT = 24;

/** สี/พื้น CSS ที่ยอมรับ — ห้าม url() / expression / ; { } (กันฉีด CSS อื่น) */
export function safeCssColor(value: unknown, max = 300): CssColor | undefined {
  if (typeof value !== "string") return undefined;
  const v = value.trim();
  if (!v || v.length > max) return undefined;
  if (/url\s*\(|expression|javascript:|[;{}<>\\]/i.test(v)) return undefined;
  if (!/^[#a-zA-Z0-9(),.%\s+\-/]+$/.test(v)) return undefined;
  return v;
}

/** รูปที่ยอมรับ — path ภายในเว็บ หรือ https:// */
export function safeImageUrl(value: unknown): ImageUrl | undefined {
  if (typeof value !== "string") return undefined;
  const v = value.trim();
  if (v.length > 500) return undefined;
  if (v.startsWith("/") && !v.startsWith("//")) return v;
  try {
    return new URL(v).protocol === "https:" ? v : undefined;
  } catch {
    return undefined;
  }
}

function safeNumber(value: unknown, min: number, max: number): number | undefined {
  return typeof value === "number" && Number.isFinite(value) && value >= min && value <= max ? value : undefined;
}

/** CSS variables ที่ส่งให้ .lucky-wheel__stage (lucky-wheel.css ใช้ var(..., ค่าเริ่มต้น)) */
export function wheelThemeCssVars(theme: WheelTheme | undefined): CSSProperties {
  if (!theme) return {};
  const vars: Record<string, string | undefined> = {
    "--wheel-rim-color": safeCssColor(theme.rim?.color),
    "--wheel-rim-glow": safeCssColor(theme.rim?.glow),
    "--wheel-rim-band": safeCssColor(theme.rim?.bandColor),
    "--wheel-light-color": safeCssColor(theme.lights?.color),
    "--wheel-light-active": safeCssColor(theme.lights?.activeColor),
    "--wheel-slice-border": safeCssColor(theme.segments?.borderColor),
    "--wheel-label-color": safeCssColor(theme.segments?.labelColor),
    "--wheel-pointer-color": safeCssColor(theme.pointer?.color),
    "--wheel-pointer-glow": safeCssColor(theme.pointer?.glow),
    "--wheel-hub-bg": safeCssColor(theme.hub?.background, 500),
    "--wheel-hub-text": safeCssColor(theme.hub?.textColor),
    "--wheel-hub-ring": safeCssColor(theme.hub?.ringColor),
    "--wheel-hub-glow": safeCssColor(theme.hub?.glow),
    "--wheel-stage-bg": safeCssColor(theme.background?.color, 500),
  };
  const hubSize = safeNumber(theme.hub?.sizePercent, 8, 40);
  if (hubSize) vars["--wheel-hub-size"] = `${hubSize}%`;
  const pointerSize = safeNumber(theme.pointer?.sizePercent, 3, 30);
  if (pointerSize) vars["--wheel-pointer-size"] = `${pointerSize}%`;
  const bg = safeImageUrl(theme.background?.imageUrl);
  if (bg) vars["--wheel-stage-image"] = `url("${bg.replace(/"/g, "%22")}")`;

  return Object.fromEntries(Object.entries(vars).filter(([, v]) => v !== undefined)) as CSSProperties;
}

/** ค่าที่ component ใช้ตอนวาด SVG (ผ่านการกรองแล้ว) */
export interface ResolvedWheelTheme {
  lightCount: number;
  lightSize: number;
  lightAnimation: "none" | "blink" | "chase";
  fastLightsWhileSpinning: boolean;
  rimWidth: number;
  segmentColors: CssColor[];
  segmentBorderWidth?: number;
  labelSize?: number;
  iconSize: number;
  pointerImageUrl?: ImageUrl;
  hubLabel: string;
  hubLogoUrl?: ImageUrl;
  frameImageUrl?: ImageUrl;
  spinDurationMs: number;
}

export function resolveWheelTheme(theme: WheelTheme | undefined): ResolvedWheelTheme {
  const animation = theme?.lights?.animation;
  return {
    lightCount: Math.round(safeNumber(theme?.lights?.count, 4, 60) ?? WHEEL_DEFAULT_LIGHT_COUNT),
    lightSize: safeNumber(theme?.lights?.size, 0.5, 10) ?? 2.2,
    lightAnimation: animation === "blink" || animation === "chase" ? animation : "none",
    fastLightsWhileSpinning: theme?.lights?.fastWhileSpinning === true,
    rimWidth: safeNumber(theme?.rim?.width, 0, 20) ?? 2,
    segmentColors: (theme?.segments?.colors ?? []).map((c) => safeCssColor(c)).filter((c): c is string => Boolean(c)),
    segmentBorderWidth: safeNumber(theme?.segments?.borderWidth, 0, 10),
    labelSize: safeNumber(theme?.segments?.labelSize, 6, 40),
    iconSize: safeNumber(theme?.segments?.iconSize, 10, 80) ?? 34,
    pointerImageUrl: safeImageUrl(theme?.pointer?.imageUrl),
    hubLabel: typeof theme?.hub?.label === "string" && theme.hub.label.trim() ? theme.hub.label.trim().slice(0, 12) : "SPIN",
    hubLogoUrl: safeImageUrl(theme?.hub?.logoUrl),
    frameImageUrl: safeImageUrl(theme?.rim?.frameImageUrl),
    spinDurationMs: safeNumber(theme?.spinDurationMs, 2000, 10000) ?? WHEEL_DEFAULT_SPIN_MS,
  };
}

/** สีช่องที่ index — รายช่อง > ชุดสีของธีม > undefined (ใช้ class เริ่มต้น a/b) */
export function segmentFill(index: number, segment: WheelSegmentStyle, colors: CssColor[]): CssColor | undefined {
  return safeCssColor(segment.color) ?? (colors.length > 0 ? colors[index % colors.length] : undefined);
}
