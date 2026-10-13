import type { WheelTheme } from "@/app/types/wheelTheme";
/** ข้อมูล mock หน้าวงล้อพารวย (/wheel) */

import type {
  WheelSegment,
  WheelHistoryEntry,
  WheelBenefitCard,
  WheelLiveWinnerEntry,
  WheelPrizeHistoryRow,
} from "@/app/types/reward";

export const LUCKY_WHEEL_INTRO_LEAD: readonly [string, string] = [
  "ของรางวัลสุดพิเศษ รอคุณอยู่",
  "หมุนเลย.. โชคดีอาจเป็นของคุณ!",
];

export const LUCKY_WHEEL_GEMS_PER_SPIN = 10;
export const LUCKY_WHEEL_TICKETS_PER_SPIN = 1;
export const LUCKY_WHEEL_INITIAL_GEMS = 48_931;
export const LUCKY_WHEEL_INITIAL_TICKETS = 0;
export const LUCKY_WHEEL_HISTORY_TOTAL_PAGES = 15;

/**
 * ธีมวงล้อ mock — ว่าง = ดีไซน์เริ่มต้น · backend ส่งค่าตาม WheelTheme เพื่อเปลี่ยนหน้าตาทั้งชุด
 * ตัวอย่างเต็ม: docs/api/wheel-theme.md
 */
export const LUCKY_WHEEL_THEME: WheelTheme = {};

export const LUCKY_WHEEL_SEGMENTS: WheelSegment[] = [
  { id: "w1", label: "เพชร 3", kind: "gems" },
  { id: "w2", label: "10 เครดิต", kind: "credit" },
  { id: "w3", label: "เพชร 10", kind: "gems" },
  { id: "w4", label: "20 เครดิต", kind: "credit" },
  { id: "w5", label: "เพชร 5", kind: "gems" },
  { id: "w6", label: "50 เครดิต", kind: "credit" },
  { id: "w7", label: "เพชร 20", kind: "gems" },
  { id: "w8", label: "100 เครดิต", kind: "credit" },
];

export const LUCKY_WHEEL_BENEFITS: WheelBenefitCard[] = [
  {
    id: "b1",
    titleLines: ["รางวัล", "จัดเต็ม"],
    iconId: "prize",
  },
  {
    id: "b2",
    titleLines: ["เช็คอิน", "หมุนฟรีทุกวัน"],
    iconId: "check-in",
  },
  {
    id: "b3",
    titleLines: ["โชคดีมีสิทธิ์", "ทุกคน"],
    iconId: "crown",
  },
];

export const LUCKY_WHEEL_TAGLINE =
  "ทุกการหมุน คือ โอกาสใหม่ ให้คุณได้มากกว่าเดิม";

export const LUCKY_WHEEL_LIVE_WINNERS: WheelLiveWinnerEntry[] = [
  { id: "lw1", avatarLetter: "M", maskedName: "m*****l", gemsAmount: 10, timeLabel: "เมื่อสักครู่" },
  { id: "lw2", avatarLetter: "N", maskedName: "n*****k", gemsAmount: 3, timeLabel: "1 นาทีที่แล้ว" },
  { id: "lw3", avatarLetter: "I", maskedName: "i*****n", gemsAmount: 20, timeLabel: "2 นาทีที่แล้ว" },
  { id: "lw4", avatarLetter: "P", maskedName: "p*****t", gemsAmount: 5, timeLabel: "3 นาทีที่แล้ว" },
  { id: "lw5", avatarLetter: "A", maskedName: "a*****m", gemsAmount: 10, timeLabel: "5 นาทีที่แล้ว" },
];

export const LUCKY_WHEEL_PRIZE_HISTORY: WheelPrizeHistoryRow[] = [
  {
    id: "ph1",
    atLabel: "18 ก.ย. 13:48",
    prizeKind: "gems",
    prizeName: "เพชร",
    amount: "10.00",
    method: "gems",
  },
  {
    id: "ph2",
    atLabel: "18 ก.ย. 11:02",
    prizeKind: "credit",
    prizeName: "เครดิต",
    amount: "20.00",
    method: "gems",
  },
  {
    id: "ph3",
    atLabel: "17 ก.ย. 21:15",
    prizeKind: "gems",
    prizeName: "เพชร",
    amount: "3.00",
    method: "ticket",
  },
  {
    id: "ph4",
    atLabel: "17 ก.ย. 18:40",
    prizeKind: "gems",
    prizeName: "เพชร",
    amount: "5.00",
    method: "gems",
  },
  {
    id: "ph5",
    atLabel: "16 ก.ย. 09:22",
    prizeKind: "credit",
    prizeName: "เครดิต",
    amount: "50.00",
    method: "gems",
  },
  {
    id: "ph6",
    atLabel: "15 ก.ย. 14:11",
    prizeKind: "gems",
    prizeName: "เพชร",
    amount: "20.00",
    method: "gems",
  },
];

export const LUCKY_WHEEL_HISTORY: WheelHistoryEntry[] = [
  { id: "h1", label: "10 เครดิต", kind: "credit", timeLabel: "วันนี้ · 14:30" },
  { id: "h2", label: "50 Gems", kind: "gems", timeLabel: "12 ก.ย. · 09:15" },
];

export const LUCKY_WHEEL_TERMS: string[] = [
  "ใช้เพชรหรือตั๋วตามวิธีหมุนที่เลือก — ยอดหักตามจำนวนครั้ง",
  "รางวัลเครดิตและเพชรเป็นตัวอย่าง — ยอดจริงขึ้นกับระบบหลังบ้าน",
  "ตั๋วหมุนอาจได้จากเช็คอินหรือโปรโมชัน",
  "ทีมงานขอสงวนสิทธิ์ในการเปลี่ยนแปลงรางวัลและกติกาโดยไม่แจ้งล่วงหน้า",
];
