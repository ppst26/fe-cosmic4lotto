import type { LotteryBetMarketId } from "@/app/types/lotteryBetApi";
import type { LotterySubmittedSlip, LotterySlipLine } from "@/app/types/lotterySlip";
import type { LotteryMessageKey } from "@/app/types/lottery";
import { THAI_LOTTO_BET_TYPES } from "@/app/data/thaiLottoMockData";
import { YIKI_SETTLEMENT_TYPES } from "@/app/data/yikiMockData";

/** ประเภทแทงที่ server รู้จัก — ป้ายชื่อและอัตราจ่ายมาจากที่นี่เท่านั้น (ไม่เชื่อค่าจาก client) */
export interface BetTypeRule {
  labelKey: LotteryMessageKey;
  payoutRate: number;
  /** จำนวนหลักที่ต้องแทง */
  digits: number;
}

/** จำนวนหลักตามรหัสประเภทยี่กี (three_* = 3 · two_* = 2 · run_* = 1) */
function digitsFromTypeKey(typeKey: string): number {
  if (typeKey.startsWith("three")) return 3;
  if (typeKey.startsWith("two")) return 2;
  return 1;
}

/**
 * กติกาประเภทแทงตามตลาด — หวยรัฐบาลใช้ THAI_LOTTO_BET_TYPES · ตลาดอื่นใช้ YIKI_SETTLEMENT_TYPES
 * ต่อ backend: ดึงจากตาราง config ของตลาด/รอบ
 */
export function resolveBetTypeRule(market: LotteryBetMarketId, typeKey: string): BetTypeRule | null {
  if (market === "thai-government") {
    const type = THAI_LOTTO_BET_TYPES.find((item) => item.id === typeKey);
    return type ? { labelKey: type.labelKey, payoutRate: type.payoutRate, digits: type.digits } : null;
  }
  const settlement = YIKI_SETTLEMENT_TYPES[typeKey as keyof typeof YIKI_SETTLEMENT_TYPES];
  return settlement
    ? { labelKey: settlement.labelKey, payoutRate: settlement.payoutRate, digits: digitsFromTypeKey(typeKey) }
    : null;
}

/** รายการแทงที่ผ่านการตรวจแล้ว (route เป็นคนตรวจ) */
export interface ValidatedBetLine {
  typeKey: string;
  number: string;
  amount: number;
  rule: BetTypeRule;
}

/**
 * สร้าง record โพยจากรายการที่ตรวจแล้ว — ใช้ใน POST /api/lottery/bets
 */
export function buildSubmittedSlip(
  input: {
    market: LotteryBetMarketId;
    roundId: string;
    drawLabel: string | null;
    drawCloseAt: string | null;
    note: string | null;
    continuePlayHref: string | null;
    lines: ValidatedBetLine[];
  },
  ids: { slipId: string; reference: string; purchasedAt: string },
): LotterySubmittedSlip {
  const lines: LotterySlipLine[] = input.lines.map((line) => ({
    typeKey: line.typeKey,
    typeLabelKey: line.rule.labelKey,
    number: line.number,
    amount: line.amount,
    payoutRate: line.rule.payoutRate,
    potentialWin: Math.round(line.amount * line.rule.payoutRate),
  }));

  return {
    id: ids.slipId,
    shortId: ids.slipId.slice(0, 8).toLowerCase(),
    reference: ids.reference,
    market: input.market,
    roundId: input.roundId,
    /** ว่าง = ไม่ระบุงวด — หน้าโพยแสดง "งวดปัจจุบัน" ตามภาษาเอง */
    drawLabel: input.drawLabel || "",
    drawAt: input.drawCloseAt || ids.purchasedAt,
    purchasedAt: ids.purchasedAt,
    status: "submitted",
    settledAt: null,
    note: input.note,
    lines,
    totalStake: lines.reduce((sum, line) => sum + line.amount, 0),
    winLoss: null,
    continuePlayHref: input.continuePlayHref || "/lottery",
  };
}
