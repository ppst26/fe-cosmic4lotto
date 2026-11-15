import type { MessageKey } from "@/lib/i18n/messages";
import type { MessageVars } from "@/lib/i18n/translate";

/** สถานะตลาดหวย — เปิดรับ / ปิดรับ */
export type LotteryMarketStatus = "open" | "closed";

/** key ข้อความใน namespace lottery — แปลตอน render ด้วย useT("lottery") */
export type LotteryMessageKey = MessageKey<"lottery">;

/** ข้อความที่แสดงตรง (เช่น countdown "03:29:01") หรือ key + ตัวแปรที่ต้องแปลตอน render */
export type LotteryLabel = string | { key: LotteryMessageKey; vars?: MessageVars };

/**
 * ป้ายงวด/รอบแบบโครงสร้าง — จัดรูปแบบตามภาษาตอน render (lib/lottery/labels.ts)
 * time = รอบยี่กี "HH:MM" · draw = งวดตามวันที่ (ISO) · market = ชื่อตลาด + วันที่
 */
export type LotteryRoundLabel =
  | { kind: "time"; time: string }
  | { kind: "draw"; date: string }
  | { kind: "market"; titleKey: LotteryMessageKey; date: string };

/** โทนสีไอคอนธงของตลาดหวย — map กับ class .lottery-flag--{tone} ใน globals.css */
export type LotteryFlagTone =
  | "th" | "la" | "vn" | "my" | "us" | "cn" | "de" | "ru" | "kr"
  | "jp" | "gb" | "hk" | "tw" | "sg" | "in" | "eg" | "gold";

/** การ์ด feature แถวบน (หวยไทย · ยี่กี) */
export interface LotteryFeaturedItem {
  id: string;
  titleKey: LotteryMessageKey;
  countdownLabel: LotteryLabel;
  href: string;
  visual: "thai-gov" | "yiki";
  yikiMinutes?: 5 | 15 | 30;
}

/** รายการหวยในกริด */
export interface LotteryGridItem {
  id: string;
  titleKey: LotteryMessageKey;
  status: LotteryMarketStatus;
  countdownLabel?: string;
  flagLabel: string;
  flagTone: LotteryFlagTone;
  href: string;
}

/** แถวผลหวยล่าสุด */
export interface LotteryResultRow {
  id: string;
  titleKey: LotteryMessageKey;
  top3: string;
  bottom2: string;
  /** ISO วันออกผล · null = วันนี้ */
  drawDate: string | null;
  flagLabel: string;
  flagTone: LotteryFlagTone;
}

/* ---------- หวยรัฐบาลไทย (/lottery/thai-government) ---------- */

/** กลุ่มจำนวนหลัก — ใช้เป็นแท็บเลือกชุดประเภทการแทง */
export type ThaiLottoDigitGroup = "three" | "two" | "run";

/** ประเภทการแทงหวยรัฐบาลไทย */
export type ThaiLottoBetTypeId =
  | "three_top"
  | "three_tod"
  | "three_front"
  | "three_back"
  | "two_top"
  | "two_bottom"
  | "run_top"
  | "run_bottom";

export interface ThaiLottoBetType {
  id: ThaiLottoBetTypeId;
  labelKey: LotteryMessageKey;
  group: ThaiLottoDigitGroup;
  digits: 1 | 2 | 3;
  /** อัตราจ่ายต่อ 1 บาท */
  payoutRate: number;
}

/** ข้อมูลงวดที่เปิดรับแทง */
export interface ThaiLottoDraw {
  id: string;
  drawLabel: LotteryRoundLabel;
  /** ISO datetime เวลาปิดรับแทง */
  closeAt: string;
  minBet: number;
  maxBet: number;
}

/** ผลรางวัลงวดก่อน */
export interface ThaiLottoResult {
  drawLabel: LotteryRoundLabel;
  firstPrize: string;
  front3: string[];
  back3: string[];
  bottom2: string;
}

/** รายการในโพยแทง */
export interface ThaiLottoBetEntry {
  id: string;
  typeId: ThaiLottoBetTypeId;
  number: string;
  amount: number;
}

/* ---------- เลือกรอบเล่น (step 2) ---------- */

/** รายการใน sidebar เลือกประเภทหวย */
export interface LotteryCatalogEntry {
  slug: string;
  titleKey: LotteryMessageKey;
  flagLabel: string;
  flagTone: LotteryFlagTone;
  /** path หน้ารายการรอบ เช่น /lottery/thai-government */
  roundsHref: string;
  status: LotteryMarketStatus;
  /** ข้อความใต้ชื่อใน sidebar — countdown หรือสถานะ */
  statusLabel: LotteryLabel;
}

/** รอบการเล่น — mock จากตารางจริง (หวยไทย 1/16 · ยี่กี · หวยรายวัน) */
export type LotteryPlayRoundStatus = "open" | "upcoming" | "closed";

export interface LotteryPlayRound {
  id: string;
  drawLabel: LotteryRoundLabel;
  drawAt: string;
  closeAt: string;
  openAt: string;
  status: LotteryPlayRoundStatus;
  minBet: number;
  maxBet: number;
}

/* ── จาก app/data/lotteryMarketsMockData.ts ── */

/** ตลาดหวยหุ้น/ต่างประเทศแบบง่าย (ไม่มีรายการรอบเหมือนยี่กี) — /lottery/[marketId] */
export interface LotteryMarketConfig {
  /** ตรงกับ segment ท้าย href ใน LOTTERY_GRID_ITEMS เช่น "baac", "laos" */
  slug: string;
  titleKey: LotteryMessageKey;
  flagLabel: string;
  flagTone: LotteryFlagTone;
  status: LotteryMarketStatus;
  /** นาทีก่อนปิดรับนับจากตอนนี้ — mock; ติดลบ/0 = ปิดรับแล้ว */
  closesInMinutes: number;
}

/* ---------- หน้าผลรางวัล (/lottery/results) ---------- */

/** หมวดในตัวกรองหน้าผลรางวัล — ยี่กี แยกเป็นส่วนของตัวเอง (ไม่ใช่การ์ดต่อตลาด) */
export type LotteryResultCategory = "government" | "thai-stock" | "foreign-stock" | "laos" | "hanoi";

/** pending = ยังไม่ถึงเวลาออกผล · done = ออกผลแล้ว (backend เป็นผู้ตัดสิน) */
export type LotteryResultStatus = "pending" | "done";

/** ช่องตัวเลขในการ์ดผล — label แปลจาก results.fig.{id} */
export type LotteryResultFigureId = "first" | "drawn" | "top3" | "top2" | "bottom2" | "front3" | "back3";

export interface LotteryResultFigure {
  id: LotteryResultFigureId;
  /** null = ยังไม่ออกผล */
  value: string | null;
  /** จำนวนหลัก — ใช้แสดงขีดแทนตัวเลขตอนยังไม่ออกผล */
  digits: number;
  /** ช่องกว้างเต็มแถว (รางวัลที่ 1 / เลขที่ออก) */
  wide?: boolean;
}

/** ผลของหวยหนึ่งตลาดในหนึ่งวัน */
export interface LotteryDrawResult {
  id: string;
  /** segment หลัง /lottery/ — ใช้แมปไอคอน */
  marketSlug: string;
  titleKey: LotteryMessageKey;
  category: LotteryResultCategory;
  flagLabel: string;
  flagTone: LotteryFlagTone;
  /** วันที่งวด YYYY-MM-DD */
  drawDate: string;
  /** เวลาออกผล HH:MM (เวลาไทย) */
  drawTime: string;
  status: LotteryResultStatus;
  figures: LotteryResultFigure[];
}

export interface LotteryYikiRoundResult {
  /** รอบที่ (เริ่ม 1) */
  round: number;
  /** เวลาออกผล HH:MM */
  time: string;
  status: LotteryResultStatus;
  top3: string | null;
  bottom2: string | null;
}

/** ผลยี่กีของแต่ละความถี่ (5 / 15 / 30 นาที) */
export interface LotteryYikiResults {
  slug: string;
  titleKey: LotteryMessageKey;
  intervalMinutes: number;
  /** จำนวนรอบทั้งวัน */
  total: number;
  /** เรียงจากรอบที่ 1 */
  rounds: LotteryYikiRoundResult[];
}

/** รูปข้อมูลที่ backend ต้องส่ง — GET /api/lottery/results?date=YYYY-MM-DD */
export interface LotteryResultsDay {
  date: string;
  draws: LotteryDrawResult[];
  yiki: LotteryYikiResults[];
}
