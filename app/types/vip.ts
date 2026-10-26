import type { MessageKey } from "@/lib/i18n/messages";

/** รหัสแรงค์ VIP 0–10 — ลำดับจากต่ำไปสูง (ตรารูป webp ใน public/rank) */
export type VipRankId =
  | "vip0"
  | "vip1"
  | "vip2"
  | "vip3"
  | "vip4"
  | "vip5"
  | "vip6"
  | "vip7"
  | "vip8"
  | "vip9"
  | "vip10";

export type VipModalTabId = "my-level" | "rank" | "benefits";

export type VipMissionIconKind = "login" | "deposit" | "play";

/** ภารกิจเลื่อนระดับ */
export interface VipMission {
  id: string;
  /** แปลตอน render: useT("vip")(labelKey) */
  labelKey: MessageKey<"vip">;
  progress: number;
  target: number;
  unitKey: MessageKey<"vip">;
  icon: VipMissionIconKind;
}

/** แรงค์ในลadder */
export interface VipRankTier {
  id: VipRankId;
  label: string;
  /** เลข VIP ที่แสดงใน UI — จาก API / ตารางแรงค์ */
  vipLevel: number;
  expRequired: number;
  accent: string;
}

/** เป้าเลื่อนระดับจาก API (แท็บระดับของฉัน) */
export interface VipLevelUpTarget {
  vipLevel: number;
  depositTarget: number;
  turnoverTarget: number;
}

/** แถวในตารางเปรียบเทียบสิทธิประโยชน์ */
export interface VipBenefitComparisonRow {
  id: string;
  labelKey: MessageKey<"vip">;
}

/** ค่าในช่องตารางสิทธิ — ข้อความดิบ (ตัวเลข / % / ✓) หรือ key ที่ต้องแปล */
export type VipBenefitCellValue = string | { labelKey: MessageKey<"vip"> };

/** @deprecated ใช้ตาราง VIP_BENEFIT_COMPARISON_* แทน */
export interface VipBenefitRow {
  rankId: VipRankId;
  items: string[];
}

/** สถานะ VIP ของผู้เล่น (mock) */
export interface VipPlayerState {
  currentRankId: VipRankId;
  nextRankId: VipRankId | null;
  /** เป้าเลื่อนระดับ — จาก GET /api/vip/player (แท็บระดับของฉัน) */
  levelUpTarget?: VipLevelUpTarget | null;
  /** ยอดฝากสะสมเลื่อนระดับ (mock) */
  depositProgress: number;
  /** ยอดเทิร์นโอเวอร์สะสม — ใช้กับแถบ progress หลัก */
  turnoverProgress: number;
  missions: VipMission[];
}

/** เงื่อนไขรักษาระดับ VIP รอบปัจจุบัน */
export interface VipMaintainState {
  daysRemaining: number;
  depositProgress: number;
  depositTarget: number;
  turnoverProgress: number;
  turnoverTarget: number;
}

/* ── จาก app/data/vipMockData.ts ── */

export interface VipRankRequirements {
  turnoverTarget: number;
  loginDays: number;
  depositCount: number;
  playCount: number;
}

export type VipRankViewStatus = "active" | "cleared" | "locked";
