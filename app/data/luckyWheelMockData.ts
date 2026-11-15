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
export const LUCKY_WHEEL_THEME: WheelTheme = {
  /** รัศมีสีทองหมุนช้าด้านหลังวงล้อ (mock) — ปิดด้วย enabled: false หรือไม่ส่ง rays */
  rays: {
    enabled: true,
    count: 16,
    color: "#d4a017",
    opacity: 0.45,
    widthPercent: 45,
    sizePercent: 170,
    rotateSeconds: 60,
    direction: "cw",
  },
};

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

/** mock ผู้ได้รับรางวัลล่าสุด — มีเฉพาะเพชร / เครดิต (ต่อ backend ให้ GET /api/wheel ส่งรูปเดียวกัน) */
export const LUCKY_WHEEL_LIVE_WINNERS: WheelLiveWinnerEntry[] = [
  { id: "lw1", handle: "@ZAB9", maskedPhone: "********7329", prizeKind: "gems", amount: "10.00" },
  { id: "lw2", handle: "@ZAB2", maskedPhone: "********6325", prizeKind: "credit", amount: "50.00" },
  { id: "lw3", handle: "@ZAB3", maskedPhone: "********4258", prizeKind: "gems", amount: "20.00" },
  { id: "lw4", handle: "@ZAB1", maskedPhone: "********9136", prizeKind: "credit", amount: "20.00" },
  { id: "lw5", handle: "@ZAB5", maskedPhone: "********2074", prizeKind: "gems", amount: "5.00" },
  { id: "lw6", handle: "@ZAB7", maskedPhone: "********3318", prizeKind: "credit", amount: "100.00" },
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
