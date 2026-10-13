import type { LotteryMessageKey } from "@/app/types/lottery";
import type {
  YikiBetType,
  YikiDigitGroup,
  YikiRound,
  YikiSettlementType,
  YikiSettlementTypeId,
} from "@/app/types/yiki";
import {
  BANGKOK_OFFSET_MS,
  dateFromBangkokWall,
  getBangkokWallParts,
} from "@/app/lib/bangkokTime";

/** แท็บกลุ่มจำนวนหลัก — ตามที่ผู้ใช้ระบุ ไม่มี "อื่นๆ" */
export const YIKI_GROUPS: { id: YikiDigitGroup; labelKey: LotteryMessageKey }[] = [
  { id: "three", labelKey: "groups.three" },
  { id: "two", labelKey: "groups.two" },
  { id: "run", labelKey: "groups.run" },
];

/** ผลการจ่ายจริง — ใช้จัดกลุ่มหัวข้อในโพยและคำนวณเงินรางวัล (mock — รอค่าจริงจาก API) */
export const YIKI_SETTLEMENT_TYPES: Record<YikiSettlementTypeId, YikiSettlementType> = {
  three_top: { id: "three_top", labelKey: "betTypes.threeTop", payoutRate: 1000 },
  three_top_tod: { id: "three_top_tod", labelKey: "betTypes.threeTopTod", payoutRate: 150 },
  two_top: { id: "two_top", labelKey: "betTypes.twoTop", payoutRate: 90 },
  two_bottom: { id: "two_bottom", labelKey: "betTypes.twoBottom", payoutRate: 90 },
  run_top: { id: "run_top", labelKey: "betTypes.runTop", payoutRate: 3.2 },
  run_bottom: { id: "run_bottom", labelKey: "betTypes.runBottom", payoutRate: 4.2 },
};

/**
 * ปุ่มเลือกประเภทการแทง — เลือกได้ทีละปุ่มต่อกลุ่ม (single-select ต่างจากหวยรัฐบาลไทยที่เลือกได้หลายปุ่ม)
 * ปุ่ม "กลับ" และปุ่มรวม (+ โต๊ด, บน/ล่าง) ยุบตัวเลือกเดิม (กลับเลข/หลายประเภทพร้อมกัน) ไว้ในปุ่มเดียวตามดีไซน์อ้างอิง
 */
export const YIKI_BET_TYPES: YikiBetType[] = [
  { id: "three_top", labelKey: "betTypes.threeTop", group: "three", digits: 3, settlementTypeIds: ["three_top"] },
  {
    id: "three_top_reverse",
    labelKey: "betTypes.threeTopReverse",
    group: "three",
    digits: 3,
    settlementTypeIds: ["three_top"],
    reverse: true,
  },
  { id: "three_top_tod", labelKey: "betTypes.threeTopTod", group: "three", digits: 3, settlementTypeIds: ["three_top_tod"] },
  {
    id: "three_top_combo_tod",
    labelKey: "betTypes.threeTopComboTod",
    group: "three",
    digits: 3,
    settlementTypeIds: ["three_top", "three_top_tod"],
  },
  { id: "two_top", labelKey: "betTypes.twoTop", group: "two", digits: 2, settlementTypeIds: ["two_top"] },
  {
    id: "two_top_reverse",
    labelKey: "betTypes.twoTopReverse",
    group: "two",
    digits: 2,
    settlementTypeIds: ["two_top"],
    reverse: true,
  },
  { id: "two_bottom", labelKey: "betTypes.twoBottom", group: "two", digits: 2, settlementTypeIds: ["two_bottom"] },
  {
    id: "two_bottom_reverse",
    labelKey: "betTypes.twoBottomReverse",
    group: "two",
    digits: 2,
    settlementTypeIds: ["two_bottom"],
    reverse: true,
  },
  {
    id: "two_top_bottom",
    labelKey: "betTypes.twoTopBottom",
    group: "two",
    digits: 2,
    settlementTypeIds: ["two_top", "two_bottom"],
  },
  {
    id: "two_top_bottom_reverse",
    labelKey: "betTypes.twoTopBottomReverse",
    group: "two",
    digits: 2,
    settlementTypeIds: ["two_top", "two_bottom"],
    reverse: true,
  },
  { id: "run_top", labelKey: "betTypes.runTop", group: "run", digits: 1, settlementTypeIds: ["run_top"] },
  { id: "run_bottom", labelKey: "betTypes.runBottom", group: "run", digits: 1, settlementTypeIds: ["run_bottom"] },
];

/** ปิดรับก่อนงวดออกผล — mock */
const CLOSE_BEFORE_DRAW_MS = 2 * 60 * 1000;

/**
 * สร้างรายการงวดถัดไปจากเวลาปัจจุบัน — จัดรอบตามนาฬิกา Bangkok (ไม่ใช้ timezone ของเครื่อง)
 */
export function generateYikiRounds(count = 8, intervalMin = 15, from = new Date()): YikiRound[] {
  const intervalMs = intervalMin * 60 * 1000;
  const bkkMinute = Math.floor((from.getTime() + BANGKOK_OFFSET_MS) / 60_000);
  const remainder = bkkMinute % intervalMin;
  const nextBkkMinute = bkkMinute - remainder + intervalMin;
  const baseMs = nextBkkMinute * 60_000 - BANGKOK_OFFSET_MS;

  return Array.from({ length: count }, (_, index) => {
    const drawAt = new Date(baseMs + index * intervalMs);
    const closeAt = new Date(drawAt.getTime() - CLOSE_BEFORE_DRAW_MS);
    const { year, month, day, hour, minute } = getBangkokWallParts(drawAt);
    const hh = String(hour).padStart(2, "0");
    const mm = String(minute).padStart(2, "0");
    return {
      id: `${year}${String(month).padStart(2, "0")}${String(day).padStart(2, "0")}${hh}${mm}`,
      label: { kind: "time", time: `${hh}:${mm}` },
      closeAt: closeAt.toISOString(),
    };
  });
}

const ROUND_ID_PATTERN = /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})$/;

/**
 * ถอด roundId (yyyyMMddHHmm) กลับเป็นข้อมูลงวดโดยตรง — ไม่พึ่งเวลา ณ ตอนเรียก
 * ใช้ในหน้าแทง /lottery/yiki-15/[roundId] กัน mismatch กับรายการที่สร้างไว้ในหน้าก่อนหน้า
 */
export function getYikiRoundById(roundId: string): YikiRound | null {
  const match = ROUND_ID_PATTERN.exec(roundId);
  if (!match) return null;
  const [, year, month, day, hour, minute] = match;
  const drawAt = dateFromBangkokWall(
    Number(year),
    Number(month),
    Number(day),
    Number(hour),
    Number(minute),
  );
  if (Number.isNaN(drawAt.getTime())) return null;
  const closeAt = new Date(drawAt.getTime() - CLOSE_BEFORE_DRAW_MS);
  return {
    id: roundId,
    label: { kind: "time", time: `${hour}:${minute}` },
    closeAt: closeAt.toISOString(),
  };
}
