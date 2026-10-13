import type { LotteryMessageKey, LotteryRoundLabel } from "./lottery";

/** กลุ่มจำนวนหลักของหวยยี่กี — ไม่มี "อื่นๆ" ตามที่ผู้ใช้ระบุ */
export type YikiDigitGroup = "three" | "two" | "run";

/** ประเภทผลการจ่ายจริง (ใช้จัดกลุ่มโพยและคำนวณเงินรางวัล) */
export type YikiSettlementTypeId =
  | "three_top"
  | "three_top_tod"
  | "two_top"
  | "two_bottom"
  | "run_top"
  | "run_bottom";

export interface YikiSettlementType {
  id: YikiSettlementTypeId;
  labelKey: LotteryMessageKey;
  payoutRate: number;
}

/** ปุ่มเลือกประเภทการแทง (เลือกได้ทีละปุ่มต่อกลุ่ม) — บางปุ่มกลับเลขหรือรวมสองผลการจ่ายในปุ่มเดียว */
export interface YikiBetType {
  id: string;
  labelKey: LotteryMessageKey;
  group: YikiDigitGroup;
  digits: 1 | 2 | 3;
  /** ผลการจ่ายที่ปุ่มนี้ครอบคลุม — ปุ่มรวม (เช่น "บน/ล่าง") มีมากกว่า 1 */
  settlementTypeIds: YikiSettlementTypeId[];
  /** true = เพิ่มทุกการสลับหลักของเลขที่กดด้วย (เช่น "กลับ") */
  reverse?: boolean;
}

/** งวดแทงหวยยี่กี — ออกทุก 15 นาที */
export interface YikiRound {
  id: string;
  label: LotteryRoundLabel;
  closeAt: string;
}

/** รายการในโพย — ยังไม่มีราคาจนกว่าจะกด "ใส่ราคา" */
export interface YikiBetEntry {
  id: string;
  settlementTypeId: YikiSettlementTypeId;
  number: string;
  amount: number | null;
}
