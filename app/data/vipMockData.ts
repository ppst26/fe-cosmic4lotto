import type {
  VipBenefitCellValue,
  VipBenefitComparisonRow,
  VipMaintainState,
  VipMission,
  VipPlayerState,
  VipRankId,
  VipRankTier,
} from "@/app/types/vip";
import { formatVipAmount } from "@/lib/format";
import type { VipRankRequirements, VipRankViewStatus } from "@/app/types/vip";

/**
 * ลำดับแรงค์ VIP (ต่ำ → สูง)
 * เงื่อนไขเลื่อนระดับ: ฝากสะสม + เทิร์นสะสมครบเป้า (AND) ภายในรอบ 30 วัน
 * ดูเป้าเลื่อนแต่ละขั้นใน VIP_RANK_LEVEL_UP_TARGETS
 */
export const VIP_RANK_TIERS: VipRankTier[] = [
  { id: "base", label: "BASE", vipLevel: 6, expRequired: 0, accent: "#9aa3b2" },
  { id: "bronze", label: "BRONZE", vipLevel: 7, expRequired: 500, accent: "#c98a55" },
  { id: "silver", label: "SILVER", vipLevel: 8, expRequired: 3_000, accent: "#b8c0cc" },
  { id: "gold", label: "GOLD", vipLevel: 9, expRequired: 15_000, accent: "#f5c542" },
  { id: "platinum", label: "PLATINUM", vipLevel: 10, expRequired: 75_000, accent: "#9fd4ff" },
  { id: "emerald", label: "EMERALD", vipLevel: 11, expRequired: 250_000, accent: "#5ee4a0" },
  { id: "diamond", label: "DIAMOND", vipLevel: 12, expRequired: 1_000_000, accent: "#b794ff" },
  { id: "obsidian", label: "OBSIDIAN", vipLevel: 13, expRequired: 5_000_000, accent: "#8b7fa8" },
];

/** วิดีโอตราแรงค์ VIP — ไฟล์ใน public/rank */
export const VIP_RANK_VIDEO: Record<VipRankId, string> = {
  base: "/rank/base-tier_dark.q65PET5L.webm",
  bronze: "/rank/bronze-tier.DttGN2ww.webm",
  silver: "/rank/silver-tier.C7ZBg7E2.webm",
  gold: "/rank/gold-tier.CiYu19wS.webm",
  platinum: "/rank/platinum-tier.X7LpQ2-P.webm",
  emerald: "/rank/emerald-tier.B5fMjduG.webm",
  diamond: "/rank/diamond-tier.CTp40fMd.webm",
  obsidian: "/rank/obsidian-tier.BxvJWsnt.webm",
};

/**
 * เป้าเลื่อนขึ้นสู่แรงค์นี้ (ฝาก + เทิร์น ต้องครบทั้งคู่) — mock สำหรับ UI
 * BASE = ระดับเริ่มต้นหลังสมัคร (ไม่มีเป้าเลื่อนที่ตัวเอง)
 */
export const VIP_RANK_LEVEL_UP_TARGETS: Record<
  VipRankId,
  { depositTarget: number; turnoverTarget: number }
> = {
  base: { depositTarget: 0, turnoverTarget: 0 },
  bronze: { depositTarget: 500, turnoverTarget: 2_000 },
  silver: { depositTarget: 5_000, turnoverTarget: 25_000 },
  gold: { depositTarget: 50_000, turnoverTarget: 250_000 },
  platinum: { depositTarget: 30_000_000, turnoverTarget: 30_000_000 },
  emerald: { depositTarget: 10_000_000, turnoverTarget: 100_000_000 },
  diamond: { depositTarget: 30_000_000, turnoverTarget: 300_000_000 },
  obsidian: { depositTarget: 100_000_000, turnoverTarget: 1_000_000_000 },
};

/** รักษาระดับ (รอบ 30 วัน) — เป้ารายเดือนต่อแรงค์ (mock) */
export const VIP_RANK_MAINTAIN_TARGETS: Partial<
  Record<VipRankId, { depositTarget: number; turnoverTarget: number }>
> = {
  bronze: { depositTarget: 300, turnoverTarget: 1_500 },
  silver: { depositTarget: 2_000, turnoverTarget: 12_000 },
  gold: { depositTarget: 10_000, turnoverTarget: 80_000 },
  platinum: { depositTarget: 50_000, turnoverTarget: 400_000 },
  emerald: { depositTarget: 200_000, turnoverTarget: 1_500_000 },
  diamond: { depositTarget: 800_000, turnoverTarget: 6_000_000 },
  obsidian: { depositTarget: 2_000_000, turnoverTarget: 15_000_000 },
};

export function getVipRankVideoSrc(rankId: VipRankId): string | null {
  return VIP_RANK_VIDEO[rankId] ?? null;
}

/**
 * MP4 แบบ stacked-alpha (สี+mask) สำหรับ Safari/iOS — ชื่อไฟล์ = webm ตัด hash เป็น .stacked.mp4
 * ไฟล์ปัจจุบันเป็น 60 fps — ต่อ ?v=60fps เพื่อทิ้งแคชของไฟล์ 24 fps เดิม (เปลี่ยนค่าเมื่อเข้ารหัสใหม่)
 */
export function getVipRankStackedSrc(rankId: VipRankId): string | null {
  const webm = VIP_RANK_VIDEO[rankId];
  return webm ? webm.replace(/.[A-Za-z0-9_-]{8}.webm$/, ".stacked.mp4?v=60fps") : null;
}

/** เป้าเทิร์นอ้างอิงตาราง (fallback) */
export const VIP_TURNOVER_BASE = 500;

export const VIP_MISSION_BASE = {
  loginDays: 7,
  depositCount: 5,
  playCount: 10,
} as const;

export const VIP_PLAYER_MOCK: VipPlayerState = {
  currentRankId: "gold",
  nextRankId: "platinum",
  levelUpTarget: {
    vipLevel: 10,
    depositTarget: 30_000_000,
    turnoverTarget: 30_000_000,
  },
  depositProgress: 24_500_000,
  turnoverProgress: 21_800_000,
  missions: [
    { id: "login", labelKey: "missions.login", progress: 5, target: 28, unitKey: "missions.unitDays", icon: "login" },
    { id: "deposit", labelKey: "missions.deposit", progress: 3, target: 20, unitKey: "missions.unitTimes", icon: "deposit" },
    { id: "play", labelKey: "missions.play", progress: 8, target: 40, unitKey: "missions.unitTimes", icon: "play" },
  ],
};

/** mock รักษาระดับ — แสดงเฉพาะแรงค์ที่ผู้เล่นถืออยู่ */
export const VIP_MAINTAIN_BY_RANK: Partial<Record<VipRankId, VipMaintainState>> = {
  gold: {
    daysRemaining: 0,
    depositProgress: 7_000,
    depositTarget: 10_000,
    turnoverProgress: 14_647,
    turnoverTarget: 10_000,
  },
};

/** แถวชื่อสิทธิ — คอลัมน์แรกของตารางสิทธิประโยชน์ */
export const VIP_BENEFIT_COMPARISON_ROWS: VipBenefitComparisonRow[] = [
  { id: "cashback", labelKey: "benefitRows.cashback" },
  { id: "rolling", labelKey: "benefitRows.rolling" },
  { id: "diamond-deposit", labelKey: "benefitRows.diamondDeposit" },
  { id: "fast-withdraw", labelKey: "benefitRows.fastWithdraw" },
  { id: "vip-manager", labelKey: "benefitRows.vipManager" },
  { id: "upgrade-bonus", labelKey: "benefitRows.upgradeBonus" },
  { id: "deposit-condition", labelKey: "benefitRows.depositCondition" },
  { id: "turnover-condition", labelKey: "benefitRows.turnoverCondition" },
];

/** ค่า mock ต่อช่อง [rowId][rankId] */
export const VIP_BENEFIT_COMPARISON_VALUES: Record<
  string,
  Partial<Record<VipRankId, VipBenefitCellValue>>
> = {
  cashback: {
    base: "0.1%",
    bronze: "0.2%",
    silver: "0.3%",
    gold: "0.5%",
    platinum: "0.8%",
    emerald: "1.0%",
    diamond: "1.2%",
    obsidian: "1.5%",
  },
  rolling: {
    base: "—",
    bronze: "—",
    silver: "—",
    gold: "0.2%",
    platinum: "0.35%",
    emerald: "0.5%",
    diamond: "0.65%",
    obsidian: "0.8%",
  },
  "diamond-deposit": {
    base: "—",
    bronze: "—",
    silver: "—",
    gold: "+5%",
    platinum: "+8%",
    emerald: "+12%",
    diamond: "+15%",
    obsidian: "+20%",
  },
  "fast-withdraw": {
    base: "—",
    bronze: "—",
    silver: "—",
    gold: "✓",
    platinum: "✓",
    emerald: { labelKey: "benefitValues.faster" },
    diamond: { labelKey: "benefitValues.max" },
    obsidian: { labelKey: "benefitValues.max" },
  },
  "vip-manager": {
    base: "—",
    bronze: "—",
    silver: "—",
    gold: "—",
    platinum: "✓",
    emerald: "✓",
    diamond: "✓",
    obsidian: "✓",
  },
  "upgrade-bonus": {
    base: "—",
    bronze: "25",
    silver: "50",
    gold: "100",
    platinum: "250",
    emerald: "500",
    diamond: "1,000",
    obsidian: "2,500",
  },
  "deposit-condition": {
    base: { labelKey: "benefitValues.notRequired" },
    bronze: "300+",
    silver: "500+",
    gold: "1,000+",
    platinum: "2,500+",
    emerald: "5,000+",
    diamond: "10,000+",
    obsidian: "25,000+",
  },
};

export function getVipBenefitCellValue(
  rowId: string,
  rankId: VipRankId,
  values: Record<string, Partial<Record<VipRankId, VipBenefitCellValue>>>,
): VipBenefitCellValue {
  if (rowId === "turnover-condition") {
    return formatVipAmount(getVipTurnoverTarget(rankId));
  }
  return values[rowId]?.[rankId] ?? "—";
}

export function getVipRankIndex(rankId: VipRankId): number {
  const index = VIP_RANK_TIERS.findIndex((t) => t.id === rankId);
  return index >= 0 ? index : 0;
}

/** ระดับความยากภารกิจ (1 = Base, 8 = Obsidian) */
export function getVipRankMultiplier(rankId: VipRankId): number {
  return getVipRankIndex(rankId) + 1;
}

export function getVipNextRankId(rankId: VipRankId): VipRankId | null {
  const next = VIP_RANK_TIERS[getVipRankIndex(rankId) + 1];
  return next?.id ?? null;
}

export function getVipPreviousRankId(rankId: VipRankId): VipRankId | null {
  const index = getVipRankIndex(rankId);
  if (index <= 0) return null;
  return VIP_RANK_TIERS[index - 1]?.id ?? null;
}

/** เลข VIP ใน UI — อ่านจากตารางแรงค์ (API ส่ง vipLevel ต่อ tier) */
export function getVipRankDisplayNumber(rankId: VipRankId): number {
  return getVipRankTier(rankId).vipLevel;
}

export function getVipRankTier(id: VipRankId): VipRankTier {
  return VIP_RANK_TIERS.find((t) => t.id === id) ?? VIP_RANK_TIERS[0];
}

/** เป้าฝากและเทิร์นเพื่อถึงแรงค์ที่ระบุ */
export function getVipRankLevelUpAmounts(rankId: VipRankId): {
  depositTarget: number;
  turnoverTarget: number;
} {
  return VIP_RANK_LEVEL_UP_TARGETS[rankId] ?? { depositTarget: 0, turnoverTarget: 0 };
}

/** ความคืบหน้าเลื่อนระดับ — ต้องครบทั้งฝากและเทิร์น (AND) */
export function getVipLevelUpOverallPercent(
  depositProgress: number,
  turnoverProgress: number,
  depositTarget: number,
  turnoverTarget: number,
): number {
  const depositPct =
    depositTarget > 0 ? Math.min(100, (depositProgress / depositTarget) * 100) : 0;
  const turnoverPct =
    turnoverTarget > 0 ? Math.min(100, (turnoverProgress / turnoverTarget) * 100) : 0;
  return Math.min(depositPct, turnoverPct);
}

/** เป้าเทิร์นตามแรงค์ */
export function getVipTurnoverTarget(rankId: VipRankId): number {
  const fromLevelUp = VIP_RANK_LEVEL_UP_TARGETS[rankId]?.turnoverTarget;
  if (fromLevelUp && fromLevelUp > 0) return fromLevelUp;
  return VIP_TURNOVER_BASE * getVipRankMultiplier(rankId);
}

/** เป้าสะสมครบชุดตามแรงค์ (เทิร์น + ภารกิจ) */
export function getVipRequirementsForRank(rankId: VipRankId): VipRankRequirements {
  const mult = getVipRankMultiplier(rankId);
  return {
    turnoverTarget: VIP_TURNOVER_BASE * mult,
    loginDays: VIP_MISSION_BASE.loginDays * mult,
    depositCount: VIP_MISSION_BASE.depositCount * mult,
    playCount: VIP_MISSION_BASE.playCount * mult,
  };
}

export function getVipRankViewStatus(
  focusedRankId: VipRankId,
  playerRankId: VipRankId,
): VipRankViewStatus {
  const focused = getVipRankIndex(focusedRankId);
  const current = getVipRankIndex(playerRankId);
  if (focused < current) return "cleared";
  if (focused > current) return "locked";
  return "active";
}

/** แรงค์ที่ใช้คำนวณเป้าเมื่อโฟกัสแรงค์ใน carousel */
export function getVipRequirementRankForFocus(
  focusedRankId: VipRankId,
  player: VipPlayerState,
): VipRankId {
  const status = getVipRankViewStatus(focusedRankId, player.currentRankId);
  if (status === "active" && player.nextRankId) {
    return player.nextRankId;
  }
  return focusedRankId;
}

export function getVipScaledMissions(
  player: VipPlayerState,
  requirementRankId: VipRankId,
): VipMission[] {
  const req = getVipRequirementsForRank(requirementRankId);
  const byId = Object.fromEntries(player.missions.map((m) => [m.id, m]));

  return [
    {
      id: "login",
      labelKey: "missions.login",
      progress: byId.login?.progress ?? 0,
      target: req.loginDays,
      unitKey: "missions.unitDays",
      icon: "login",
    },
    {
      id: "deposit",
      labelKey: "missions.deposit",
      progress: byId.deposit?.progress ?? 0,
      target: req.depositCount,
      unitKey: "missions.unitTimes",
      icon: "deposit",
    },
    {
      id: "play",
      labelKey: "missions.play",
      progress: byId.play?.progress ?? 0,
      target: req.playCount,
      unitKey: "missions.unitTimes",
      icon: "play",
    },
  ];
}

/** ข้อมูลรักษาระดับของแรงค์ปัจจุบัน (ถ้ามี) */
export function getVipMaintainState(rankId: VipRankId): VipMaintainState | null {
  return VIP_MAINTAIN_BY_RANK[rankId] ?? null;
}
