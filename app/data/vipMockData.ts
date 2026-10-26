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
 * ลำดับแรงค์ VIP (ต่ำ → สูง) — VIP 0–10
 * เงื่อนไขเลื่อนระดับ: ฝากสะสม + เทิร์นสะสมครบเป้า (AND) ภายในรอบ 30 วัน
 * เป้าเลื่อน/รักษาระดับแต่ละขั้นดูใน VIP_RANK_LEVEL_UP_TARGETS / VIP_RANK_MAINTAIN_TARGETS
 * ตรา: public/rank/*.webp — ลำดับ starter, base, bronze, silver, gold, platinum, diamond, obsidian, ruby, mystic, cosmic
 */
export const VIP_RANK_TIERS: VipRankTier[] = [
  { id: "vip0", label: "STARTER", vipLevel: 0, expRequired: 0, accent: "#8fd9a8" },
  { id: "vip1", label: "BASE", vipLevel: 1, expRequired: 300, accent: "#9aa3b2" },
  { id: "vip2", label: "BRONZE", vipLevel: 2, expRequired: 3_000, accent: "#c98a55" },
  { id: "vip3", label: "SILVER", vipLevel: 3, expRequired: 108_000, accent: "#b8c0cc" },
  { id: "vip4", label: "GOLD", vipLevel: 4, expRequired: 350_000, accent: "#f5c542" },
  { id: "vip5", label: "PLATINUM", vipLevel: 5, expRequired: 655_000, accent: "#9fd4ff" },
  { id: "vip6", label: "DIAMOND", vipLevel: 6, expRequired: 2_000_000, accent: "#b794ff" },
  { id: "vip7", label: "OBSIDIAN", vipLevel: 7, expRequired: 6_200_000, accent: "#8b7fa8" },
  { id: "vip8", label: "RUBY", vipLevel: 8, expRequired: 10_000_000, accent: "#ff5c7a" },
  { id: "vip9", label: "MYSTIC", vipLevel: 9, expRequired: 20_000_000, accent: "#5ee4d6" },
  { id: "vip10", label: "COSMIC", vipLevel: 10, expRequired: 30_000_000, accent: "#7aa2ff" },
];

/** ตราแรงค์ VIP — ไฟล์รูป webp ใน public/rank */
export const VIP_RANK_IMAGE: Record<VipRankId, string> = {
  vip0: "/rank/starter.webp",
  vip1: "/rank/base.webp",
  vip2: "/rank/bronze.webp",
  vip3: "/rank/silver.webp",
  vip4: "/rank/gold.webp",
  vip5: "/rank/platinum.webp",
  vip6: "/rank/diamond.webp",
  vip7: "/rank/obsidian.webp",
  vip8: "/rank/ruby.webp",
  vip9: "/rank/mystic.webp",
  vip10: "/rank/cosmic.webp",
};

/**
 * เป้าเลื่อนขึ้นสู่แรงค์นี้ (ฝากสะสม + เทิร์นสะสม ต้องครบทั้งคู่)
 * VIP 0 = ระดับเริ่มต้นหลังสมัคร (ไม่มีเป้าเลื่อนที่ตัวเอง)
 */
export const VIP_RANK_LEVEL_UP_TARGETS: Record<
  VipRankId,
  { depositTarget: number; turnoverTarget: number }
> = {
  vip0: { depositTarget: 0, turnoverTarget: 0 },
  vip1: { depositTarget: 300, turnoverTarget: 300 },
  vip2: { depositTarget: 3_000, turnoverTarget: 3_000 },
  vip3: { depositTarget: 108_000, turnoverTarget: 108_000 },
  vip4: { depositTarget: 350_000, turnoverTarget: 350_000 },
  vip5: { depositTarget: 655_000, turnoverTarget: 655_000 },
  vip6: { depositTarget: 2_000_000, turnoverTarget: 2_000_000 },
  vip7: { depositTarget: 6_200_000, turnoverTarget: 6_200_000 },
  vip8: { depositTarget: 10_000_000, turnoverTarget: 10_000_000 },
  vip9: { depositTarget: 20_000_000, turnoverTarget: 20_000_000 },
  vip10: { depositTarget: 30_000_000, turnoverTarget: 30_000_000 },
};

/** รักษาระดับ (รอบ 30 วัน) — ฝากในรอบ + เทิร์นในรอบ ต่อแรงค์ */
export const VIP_RANK_MAINTAIN_TARGETS: Record<
  VipRankId,
  { depositTarget: number; turnoverTarget: number }
> = {
  vip0: { depositTarget: 0, turnoverTarget: 0 },
  vip1: { depositTarget: 100, turnoverTarget: 100 },
  vip2: { depositTarget: 1_000, turnoverTarget: 1_000 },
  vip3: { depositTarget: 10_000, turnoverTarget: 10_000 },
  vip4: { depositTarget: 10_000, turnoverTarget: 10_000 },
  vip5: { depositTarget: 10_000, turnoverTarget: 10_000 },
  vip6: { depositTarget: 10_000, turnoverTarget: 10_000 },
  vip7: { depositTarget: 10_000, turnoverTarget: 10_000 },
  vip8: { depositTarget: 10_000, turnoverTarget: 10_000 },
  vip9: { depositTarget: 10_000, turnoverTarget: 10_000 },
  vip10: { depositTarget: 10_000, turnoverTarget: 10_000 },
};

export function getVipRankImageSrc(rankId: VipRankId): string | null {
  return VIP_RANK_IMAGE[rankId] ?? null;
}

/** เป้าเทิร์นอ้างอิงตาราง (fallback) */
export const VIP_TURNOVER_BASE = 500;

export const VIP_MISSION_BASE = {
  loginDays: 7,
  depositCount: 5,
  playCount: 10,
} as const;

const PLAYER_CURRENT_RANK: VipRankId = "vip10";
const PLAYER_NEXT_RANK = getVipNextRankId(PLAYER_CURRENT_RANK);
const PLAYER_NEXT_TARGET = PLAYER_NEXT_RANK ? VIP_RANK_LEVEL_UP_TARGETS[PLAYER_NEXT_RANK] : null;

export const VIP_PLAYER_MOCK: VipPlayerState = {
  currentRankId: PLAYER_CURRENT_RANK,
  nextRankId: PLAYER_NEXT_RANK,
  levelUpTarget:
    PLAYER_NEXT_RANK && PLAYER_NEXT_TARGET
      ? { vipLevel: getVipRankDisplayNumber(PLAYER_NEXT_RANK), ...PLAYER_NEXT_TARGET }
      : null,
  depositProgress: 478_000,
  turnoverProgress: 411_000,
  missions: [
    { id: "login", labelKey: "missions.login", progress: 5, target: 28, unitKey: "missions.unitDays", icon: "login" },
    { id: "deposit", labelKey: "missions.deposit", progress: 3, target: 20, unitKey: "missions.unitTimes", icon: "deposit" },
    { id: "play", labelKey: "missions.play", progress: 8, target: 40, unitKey: "missions.unitTimes", icon: "play" },
  ],
};

/** mock รักษาระดับ — แสดงเฉพาะแรงค์ที่ผู้เล่นถืออยู่ */
export const VIP_MAINTAIN_BY_RANK: Partial<Record<VipRankId, VipMaintainState>> = {
  vip10: {
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
  { id: "maintain-deposit", labelKey: "benefitRows.maintainDeposit" },
  { id: "maintain-turnover", labelKey: "benefitRows.maintainTurnover" },
];

const RANK_IDS = VIP_RANK_TIERS.map((tier) => tier.id);

/** สร้างค่าทั้งแถวจากรายการเรียงตาม VIP 0 → 10 */
function rowByRank(values: VipBenefitCellValue[]): Partial<Record<VipRankId, VipBenefitCellValue>> {
  return Object.fromEntries(RANK_IDS.map((id, index) => [id, values[index] ?? "—"]));
}

/** ค่า mock ต่อช่อง [rowId][rankId] — แถวเงื่อนไขอ่านจากเป้าเลื่อน/รักษาระดับใน getVipBenefitCellValue */
export const VIP_BENEFIT_COMPARISON_VALUES: Record<
  string,
  Partial<Record<VipRankId, VipBenefitCellValue>>
> = {
  // ลำดับคอลัมน์ = VIP 0 → 10 (starter, base, bronze, silver, gold, platinum, diamond, obsidian, ruby, mystic, cosmic)
  cashback: rowByRank(["0.1%", "0.1%", "0.2%", "0.3%", "0.5%", "0.8%", "1.0%", "1.2%", "1.3%", "1.5%", "2.0%"]),
  rolling: rowByRank(["—", "—", "—", "—", "0.2%", "0.35%", "0.5%", "0.65%", "0.7%", "0.8%", "1.0%"]),
  "diamond-deposit": rowByRank(["—", "—", "—", "—", "+5%", "+8%", "+12%", "+15%", "+17%", "+20%", "+25%"]),
  "fast-withdraw": rowByRank([
    "—",
    "—",
    "—",
    "—",
    "✓",
    "✓",
    { labelKey: "benefitValues.faster" },
    { labelKey: "benefitValues.max" },
    { labelKey: "benefitValues.max" },
    { labelKey: "benefitValues.max" },
    { labelKey: "benefitValues.max" },
  ]),
  "vip-manager": rowByRank(["—", "—", "—", "—", "—", "✓", "✓", "✓", "✓", "✓", "✓"]),
  "upgrade-bonus": rowByRank(["—", "25", "50", "100", "250", "500", "1,000", "1,500", "2,500", "5,000", "10,000"]),
};

export function getVipBenefitCellValue(
  rowId: string,
  rankId: VipRankId,
  values: Record<string, Partial<Record<VipRankId, VipBenefitCellValue>>>,
): VipBenefitCellValue {
  if (rowId === "deposit-condition") return formatVipAmount(getVipRankLevelUpAmounts(rankId).depositTarget);
  if (rowId === "turnover-condition") return formatVipAmount(getVipRankLevelUpAmounts(rankId).turnoverTarget);
  if (rowId === "maintain-deposit") return formatVipAmount(VIP_RANK_MAINTAIN_TARGETS[rankId]?.depositTarget ?? 0);
  if (rowId === "maintain-turnover") return formatVipAmount(VIP_RANK_MAINTAIN_TARGETS[rankId]?.turnoverTarget ?? 0);
  return values[rowId]?.[rankId] ?? "—";
}

export function getVipRankIndex(rankId: VipRankId): number {
  const index = VIP_RANK_TIERS.findIndex((t) => t.id === rankId);
  return index >= 0 ? index : 0;
}

/** ระดับความยากภารกิจ (1 = VIP 0, 11 = VIP 10) */
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
