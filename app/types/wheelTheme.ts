/**
 * ธีมวงล้อ — backend ส่งมากับ GET /api/wheel (field `theme`) เพื่อเปลี่ยนหน้าตาทั้งชุดโดยไม่ต้อง deploy front-end
 * ทุก field ไม่บังคับ: ไม่ส่ง = ใช้ดีไซน์เริ่มต้นใน app/styles/lucky-wheel.css
 * ใช้ใน CosmicFortuneWheel · ตัวอย่าง JSON: docs/api/wheel-theme.md
 *
 * ค่าสี (CssColor): hex / rgb() / rgba() / hsl() / ชื่อสี เช่น "#7c3aed", "rgba(255,255,255,0.6)"
 * ค่าพื้น (CssPaint): สี หรือ linear-gradient() / radial-gradient()
 * รูป (ImageUrl): path ในเว็บ ("/wheel/frame.png") หรือ https:// เท่านั้น
 */

export type CssColor = string;
export type CssPaint = string;
export type ImageUrl = string;

/** วงนอกของวงล้อ */
export interface WheelRimTheme {
  /** สีเส้นวงนอก */
  color?: CssColor;
  /** ความหนาเส้น (หน่วย SVG ของวงล้อขนาด 400 · ค่าเริ่มต้น 2) */
  width?: number;
  /** สีเรืองแสงรอบวง (drop-shadow) */
  glow?: CssColor;
  /** พื้นแถบวงนอก (ระหว่างช่องรางวัลกับไฟ) */
  bandColor?: CssColor;
  /** รูปกรอบทับทั้งวง (PNG โปร่งใส ขนาดจัตุรัส ไม่หมุนตามวง) — ใช้ทำกรอบทอง/ไฟจริงจากดีไซเนอร์ */
  frameImageUrl?: ImageUrl;
}

/** ไฟ (dots) รอบวง */
export interface WheelLightsTheme {
  /** จำนวนดวง (4–60 · ค่าเริ่มต้น 24) */
  count?: number;
  /** สีไฟปกติ */
  color?: CssColor;
  /** สีไฟตอนกะพริบ / ไฟที่วิ่ง */
  activeColor?: CssColor;
  /** รัศมีดวงไฟ (หน่วย SVG · ค่าเริ่มต้น 2.2) */
  size?: number;
  /** none = นิ่ง · blink = กะพริบสลับคู่-คี่ · chase = ไฟวิ่งรอบวง */
  animation?: "none" | "blink" | "chase";
  /** ไฟวิ่ง/กะพริบเร็วขึ้นระหว่างหมุน */
  fastWhileSpinning?: boolean;
}

/** ช่องรางวัล */
export interface WheelSegmentsTheme {
  /** สีพื้นช่องวนตามลำดับ — 2 สี = สลับ, 3 สีขึ้นไป = วนเป็นชุด */
  colors?: CssColor[];
  /** สีเส้นแบ่งช่อง */
  borderColor?: CssColor;
  /** ความหนาเส้นแบ่ง (หน่วย SVG · ค่าเริ่มต้น 0.75) */
  borderWidth?: number;
  /** สีข้อความรางวัล */
  labelColor?: CssColor;
  /** ขนาดข้อความรางวัล (หน่วย SVG · ค่าเริ่มต้นตาม CSS) */
  labelSize?: number;
  /** ขนาดไอคอนรางวัล (หน่วย SVG · ค่าเริ่มต้น 34) */
  iconSize?: number;
}

/** เข็มชี้รางวัล (ด้านบน ไม่หมุน) */
export interface WheelPointerTheme {
  color?: CssColor;
  glow?: CssColor;
  /** รูปเข็มแทนสามเหลี่ยม (ปลายชี้ลง) */
  imageUrl?: ImageUrl;
  /** ความกว้างรูปเข็มเป็น % ของวงล้อ (ค่าเริ่มต้น 9) */
  sizePercent?: number;
}

/** ปุ่มกลาง / โลโก้สปิน */
export interface WheelHubTheme {
  /** ข้อความบนปุ่ม (ค่าเริ่มต้น "SPIN") */
  label?: string;
  /** รูปโลโก้แทนข้อความ */
  logoUrl?: ImageUrl;
  background?: CssPaint;
  textColor?: CssColor;
  ringColor?: CssColor;
  glow?: CssColor;
  /** ขนาดปุ่มเป็น % ของวงล้อ (ค่าเริ่มต้นตาม CSS ~18) */
  sizePercent?: number;
}

export interface WheelTheme {
  rim?: WheelRimTheme;
  lights?: WheelLightsTheme;
  segments?: WheelSegmentsTheme;
  pointer?: WheelPointerTheme;
  hub?: WheelHubTheme;
  /** พื้นหลังด้านหลังวงล้อ */
  background?: { color?: CssPaint; imageUrl?: ImageUrl };
  /** เวลาหมุน (ms · 2000–10000 · ค่าเริ่มต้น 4200) */
  spinDurationMs?: number;
}

/** ค่าที่ปรับได้รายช่อง (อยู่ใน WheelSegment) */
export interface WheelSegmentStyle {
  /** สีพื้นช่องนี้ (ทับ theme.segments.colors) */
  color?: CssColor;
  labelColor?: CssColor;
  /** ไอคอนรางวัล เช่น รูปเพชร / เหรียญ */
  iconUrl?: ImageUrl;
}
