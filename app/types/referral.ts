/* ── จาก app/data/referralMockData.ts ── */

import type { MessageKey } from "@/lib/i18n/messages";

/** key ใน namespace referral — แปลตอน render ด้วย useT("referral") */
export type ReferralMessageKey = MessageKey<"referral">;

/** ข้อมูล mock หน้าแนะนำเพื่อน */
export interface ReferralStatsMock {
  friendsCount: number;
  totalTurnoverThb: number;
  totalEarningsThb: number;
}

export interface ReferralCommissionTier {
  id: string;
  titleKey: ReferralMessageKey;
  subtitleKey: ReferralMessageKey;
  rateLabel: string;
  rateHintKey: ReferralMessageKey;
}

/** แถวรายชื่อเพื่อนที่สมัครผ่านลิงก์ — ใช้ในแท็บ Referral users */
export interface ReferralUserRow {
  id: string;
  username: string;
  /** ISO 8601 */
  registeredAt: string;
}

/** สรุปโบนัสแท็บ Earning */
export interface ReferralEarningSummaryMock {
  bonusReceivedThb: number;
  bonusClaimableThb: number;
}

export interface ReferralEarningHistoryRow {
  id: string;
  amountThb: number;
  occurredAt: string;
}

/** ช่วงเวลาฟิลเตอร์รายได้ — dialog desktop แนะนำเพื่อน */
export type ReferralEarningPeriodId = "all" | "today" | "week" | "month";
