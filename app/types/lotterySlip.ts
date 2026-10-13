import type { LotteryBetMarketId } from "./lotteryBetApi";
import type { LotteryMessageKey } from "./lottery";

export type LotterySlipStatus = "submitted" | "won" | "lost" | "void";

export interface LotterySlipLine {
  typeKey: string;
  /** key ชื่อประเภทแทงใน namespace lottery — แปลตอน render */
  typeLabelKey: LotteryMessageKey;
  number: string;
  amount: number;
  payoutRate: number;
  potentialWin: number;
  /** ผลรายบรรทัด — มีเฉพาะโพยที่สรุปผลแล้ว (won / lost) · void ไม่มี */
  won?: boolean;
  /** เงินรางวัลของบรรทัดนี้ (0 = ไม่ถูก) */
  payout?: number;
}

export interface LotterySubmittedSlip {
  id: string;
  shortId: string;
  reference: string;
  market: LotteryBetMarketId;
  roundId: string;
  /** ป้ายงวดที่ client ส่งมาตอนแทง · ว่าง = ไม่ระบุ (แสดง "งวดปัจจุบัน") */
  drawLabel: string;
  /** ISO — วันเวลาปิดรับ / ออกรางวัล (แสดงเป็นงวด) */
  drawAt: string;
  purchasedAt: string;
  status: LotterySlipStatus;
  /** ISO — เวลาสรุปผล · null = ยังไม่สรุป (status submitted) · ประวัติเก็บ 30 วันนับจากเวลานี้ */
  settledAt: string | null;
  note: string | null;
  lines: LotterySlipLine[];
  totalStake: number;
  winLoss: number | null;
  continuePlayHref: string;
}

/* ── รายการโพย: กำลังดำเนินการ / ประวัติ (GET /api/lottery/slips) ── */

/** pending = ยังไม่สรุปผล (submitted) · history = สรุปผลแล้ว (won / lost / void) */
export type LotterySlipScope = "pending" | "history";

/** ตัวกรองผลในประวัติ */
export type LotterySlipResult = "won" | "lost" | "void";

export interface LotterySlipListQuery {
  scope: LotterySlipScope;
  /** slug ตลาด — ไม่ใส่ = ทุกตลาด */
  market?: string;
  /** เฉพาะ history */
  result?: LotterySlipResult;
  /** ISO — เฉพาะ history · server บังคับไม่เกิน 30 วันย้อนหลัง */
  from?: string;
  to?: string;
  cursor?: string;
  limit?: number;
}

/** สรุปตามตัวกรองปัจจุบัน (ทั้งชุด ไม่ใช่เฉพาะหน้าที่โหลด) */
export interface LotterySlipListSummary {
  count: number;
  totalStake: number;
  /** ได้/เสียสุทธิ — เฉพาะ history · pending = null */
  totalWinLoss: number | null;
  /** ตลาดที่มีโพยในขอบเขต scope นี้ (ไม่ผูกกับตัวกรองตลาด) — ใช้สร้างตัวเลือกตลาด */
  markets: string[];
}

export interface LotterySlipListResponse {
  slips: LotterySubmittedSlip[];
  /** cursor หน้าถัดไป · null = หมดแล้ว */
  nextCursor: string | null;
  summary: LotterySlipListSummary;
}
