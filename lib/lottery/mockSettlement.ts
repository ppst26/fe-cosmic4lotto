import type { LotterySubmittedSlip } from "@/app/types/lotterySlip";

/** mock: สรุปผลหลังเวลาออกผลกี่นาที — backend จริงเป็นคนสรุปผล หน้าเว็บไม่ต้องเปลี่ยน */
export const MOCK_SETTLE_DELAY_MS = 10 * 60 * 1000;

/** ค่า 0–99 จาก id (hex) — ใช้ให้ผลสรุปของแต่ละโพยคงที่ทุกครั้งที่อ่าน */
function bucketOf(id: string): number {
  const n = Number.parseInt(id.slice(0, 8), 16);
  return Number.isFinite(n) ? n % 100 : 0;
}

/**
 * mock สรุปผลโพยที่เลยเวลาออกผล + ช่วงหน่วง (deterministic จาก id: ~25% ถูก · ~70% ไม่ถูก · ~5% ยกเลิก)
 * โพยที่ยังไม่ถึงเวลา / สรุปแล้ว คืนค่าเดิม — ไม่แก้ object ที่ส่งเข้ามา
 */
export function settleSlipIfDue(slip: LotterySubmittedSlip, now: Date): LotterySubmittedSlip {
  if (slip.status !== "submitted") return slip;
  const settleAtMs = new Date(slip.drawAt).getTime() + MOCK_SETTLE_DELAY_MS;
  if (Number.isNaN(settleAtMs) || now.getTime() < settleAtMs) return slip;

  const settledAt = new Date(settleAtMs).toISOString();
  const bucket = bucketOf(slip.id);

  if (bucket >= 95) {
    return { ...slip, status: "void", settledAt, winLoss: 0 };
  }

  if (bucket < 25 && slip.lines.length > 0) {
    const winningIndex = bucket % slip.lines.length;
    const lines = slip.lines.map((line, index) =>
      index === winningIndex
        ? { ...line, won: true, payout: line.potentialWin }
        : { ...line, won: false, payout: 0 },
    );
    const payout = lines.reduce((sum, line) => sum + (line.payout ?? 0), 0);
    return { ...slip, status: "won", settledAt, lines, winLoss: payout - slip.totalStake };
  }

  return {
    ...slip,
    status: "lost",
    settledAt,
    lines: slip.lines.map((line) => ({ ...line, won: false, payout: 0 })),
    winLoss: -slip.totalStake,
  };
}
