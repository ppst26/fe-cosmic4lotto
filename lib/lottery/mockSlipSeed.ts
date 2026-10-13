import { randomBytes } from "node:crypto";
import type { LotterySubmittedSlip } from "@/app/types/lotterySlip";
import { buildSubmittedSlip, resolveBetTypeRule, type ValidatedBetLine } from "./buildSubmittedSlip";

/**
 * ข้อมูลตัวอย่างสำหรับ mock เท่านั้น — ให้หน้าโพย "กำลังดำเนินการ / ประวัติ" มีของให้ดูตั้งแต่ผู้ใช้ยังไม่เคยแทง
 * (mock store อยู่ในหน่วยความจำ · backend จริงไม่มีไฟล์นี้) · ทุกโพยผูกกับผู้ใช้ที่ login อยู่
 */
const MIN = 60 * 1000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

function line(market: string, typeKey: string, number: string, amount: number): ValidatedBetLine {
  const rule = resolveBetTypeRule(market, typeKey);
  if (!rule) throw new Error(`seed: unknown bet type ${market}/${typeKey}`);
  return { typeKey, number, amount, rule };
}

function slipOf(
  now: Date,
  spec: { market: string; purchasedAgoMs: number; drawInMs: number; lines: ValidatedBetLine[] },
): LotterySubmittedSlip {
  const slipId = randomBytes(16).toString("hex");
  const purchasedAt = new Date(now.getTime() - spec.purchasedAgoMs).toISOString();
  return buildSubmittedSlip(
    {
      market: spec.market,
      roundId: `seed-${spec.market}`,
      drawLabel: null,
      drawCloseAt: new Date(now.getTime() + spec.drawInMs).toISOString(),
      note: null,
      continuePlayHref: `/lottery/${spec.market}`,
      lines: spec.lines,
    },
    { slipId, reference: `LY-SEED-${slipId.slice(0, 4).toUpperCase()}`, purchasedAt },
  );
}

/** ตั้งสถานะสรุปผลตรง ๆ (ไม่ผ่าน settleSlipIfDue) — ให้ประวัติมีทั้งถูก / ไม่ถูก / ยกเลิก แน่นอน */
function settled(
  slip: LotterySubmittedSlip,
  result: "won" | "lost" | "void",
  settledAgoMs: number,
  now: Date,
): LotterySubmittedSlip {
  const settledAt = new Date(now.getTime() - settledAgoMs).toISOString();
  if (result === "void") return { ...slip, status: "void", settledAt, winLoss: 0 };
  if (result === "lost") {
    return {
      ...slip,
      status: "lost",
      settledAt,
      lines: slip.lines.map((item) => ({ ...item, won: false, payout: 0 })),
      winLoss: -slip.totalStake,
    };
  }
  const lines = slip.lines.map((item, index) =>
    index === 0 ? { ...item, won: true, payout: item.potentialWin } : { ...item, won: false, payout: 0 },
  );
  const payout = lines.reduce((sum, item) => sum + (item.payout ?? 0), 0);
  return { ...slip, status: "won", settledAt, lines, winLoss: payout - slip.totalStake };
}

export function buildDemoSlips(now: Date): LotterySubmittedSlip[] {
  const thai = "thai-government";
  return [
    // กำลังดำเนินการ — รออกผล / เลยเวลาแล้วรอสรุป / ใกล้ออกผล
    slipOf(now, {
      market: thai,
      purchasedAgoMs: 2 * HOUR,
      drawInMs: 5 * DAY,
      lines: [line(thai, "three_top", "284", 50), line(thai, "two_bottom", "56", 20)],
    }),
    slipOf(now, {
      market: "yiki-15",
      purchasedAgoMs: 40 * MIN,
      drawInMs: -3 * MIN,
      lines: [line("yiki-15", "two_top", "56", 20), line("yiki-15", "run_top", "7", 10)],
    }),
    slipOf(now, {
      market: "yiki-5",
      purchasedAgoMs: 4 * MIN,
      drawInMs: 4 * MIN,
      lines: [line("yiki-5", "three_top", "019", 10)],
    }),
    // ประวัติ — ถูกรางวัล · ไม่ถูก · ยกเลิก · ใกล้ครบ 30 วัน
    settled(
      slipOf(now, {
        market: thai,
        purchasedAgoMs: 2 * DAY + HOUR,
        drawInMs: -2 * DAY,
        lines: [line(thai, "three_top", "731", 100), line(thai, "three_tod", "731", 50)],
      }),
      "won",
      2 * DAY - 20 * MIN,
      now,
    ),
    settled(
      slipOf(now, {
        market: "yiki-30",
        purchasedAgoMs: 5 * DAY + 30 * MIN,
        drawInMs: -5 * DAY,
        lines: [line("yiki-30", "two_top", "12", 30)],
      }),
      "lost",
      5 * DAY - 10 * MIN,
      now,
    ),
    settled(
      slipOf(now, {
        market: "yiki-5",
        purchasedAgoMs: 8 * DAY + 20 * MIN,
        drawInMs: -8 * DAY,
        lines: [line("yiki-5", "two_bottom", "90", 20), line("yiki-5", "run_bottom", "3", 10)],
      }),
      "won",
      8 * DAY - 10 * MIN,
      now,
    ),
    settled(
      slipOf(now, {
        market: thai,
        purchasedAgoMs: 12 * DAY + HOUR,
        drawInMs: -12 * DAY,
        lines: [line(thai, "two_top", "45", 40)],
      }),
      "void",
      12 * DAY - 30 * MIN,
      now,
    ),
    settled(
      slipOf(now, {
        market: "yiki-15",
        purchasedAgoMs: 29 * DAY + HOUR,
        drawInMs: -29 * DAY,
        lines: [line("yiki-15", "three_top", "555", 10)],
      }),
      "lost",
      29 * DAY - 10 * MIN,
      now,
    ),
  ];
}
