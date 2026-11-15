import type {
  LotteryDrawResult,
  LotteryFlagTone,
  LotteryMessageKey,
  LotteryResultCategory,
  LotteryResultFigure,
  LotteryResultsDay,
  LotteryResultStatus,
  LotteryYikiResults,
} from "@/app/types/lottery";
import { bangkokMinutes, bangkokToday, minutesToTime, shiftIsoDate, timeToMinutes } from "@/lib/lottery/resultDates";

/** รูปแบบช่องตัวเลขของตลาด — gov = หวยรัฐบาล · baac = ธ.ก.ส. · stock = หุ้น/ต่างประเทศ */
type ResultKind = "gov" | "baac" | "stock";

interface ResultScheduleEntry {
  slug: string;
  titleKey: LotteryMessageKey;
  category: LotteryResultCategory;
  kind: ResultKind;
  /** เวลาออกผลของวัน (HH:MM เวลาไทย) — mock */
  time: string;
  flagLabel: string;
  flagTone: LotteryFlagTone;
}

/**
 * ตารางเวลาออกผลต่อตลาด (mock) — ต่อ backend: ส่งเวลาจริงมากับ GET /api/lottery/results
 * ลำดับในหมวดเรียงตามเวลาออกผล
 */
export const LOTTERY_RESULT_SCHEDULE: readonly ResultScheduleEntry[] = [
  { slug: "thai-government", titleKey: "markets.thaiGovernment", category: "government", kind: "gov", time: "15:20", flagLabel: "TH", flagTone: "th" },
  { slug: "baac", titleKey: "markets.baac", category: "government", kind: "baac", time: "09:00", flagLabel: "TH", flagTone: "th" },
  { slug: "thai-stock", titleKey: "markets.thaiStock", category: "thai-stock", kind: "stock", time: "16:20", flagLabel: "TH", flagTone: "th" },
  { slug: "nikkei", titleKey: "markets.nikkei", category: "foreign-stock", kind: "stock", time: "09:20", flagLabel: "JP", flagTone: "jp" },
  { slug: "china", titleKey: "markets.china", category: "foreign-stock", kind: "stock", time: "10:00", flagLabel: "CN", flagTone: "cn" },
  { slug: "hong-kong", titleKey: "markets.hongKong", category: "foreign-stock", kind: "stock", time: "10:50", flagLabel: "HK", flagTone: "hk" },
  { slug: "taiwan", titleKey: "markets.taiwan", category: "foreign-stock", kind: "stock", time: "12:00", flagLabel: "TW", flagTone: "tw" },
  { slug: "korea", titleKey: "markets.korea", category: "foreign-stock", kind: "stock", time: "12:40", flagLabel: "KR", flagTone: "kr" },
  { slug: "nikkei-pm", titleKey: "markets.nikkeiPm", category: "foreign-stock", kind: "stock", time: "12:50", flagLabel: "JP", flagTone: "jp" },
  { slug: "china-pm", titleKey: "markets.chinaPm", category: "foreign-stock", kind: "stock", time: "13:30", flagLabel: "CN", flagTone: "cn" },
  { slug: "hong-kong-pm", titleKey: "markets.hongKongPm", category: "foreign-stock", kind: "stock", time: "14:50", flagLabel: "HK", flagTone: "hk" },
  { slug: "singapore", titleKey: "markets.singapore", category: "foreign-stock", kind: "stock", time: "15:50", flagLabel: "SG", flagTone: "sg" },
  { slug: "india", titleKey: "markets.india", category: "foreign-stock", kind: "stock", time: "16:40", flagLabel: "IN", flagTone: "in" },
  { slug: "malaysia", titleKey: "markets.malaysia", category: "foreign-stock", kind: "stock", time: "17:30", flagLabel: "MY", flagTone: "my" },
  { slug: "egypt", titleKey: "markets.egypt", category: "foreign-stock", kind: "stock", time: "18:00", flagLabel: "EG", flagTone: "eg" },
  { slug: "russia", titleKey: "markets.russia", category: "foreign-stock", kind: "stock", time: "22:00", flagLabel: "RU", flagTone: "ru" },
  { slug: "germany", titleKey: "markets.germany", category: "foreign-stock", kind: "stock", time: "22:00", flagLabel: "DE", flagTone: "de" },
  { slug: "uk", titleKey: "markets.uk", category: "foreign-stock", kind: "stock", time: "22:00", flagLabel: "GB", flagTone: "gb" },
  { slug: "dow-jones", titleKey: "markets.dowJones", category: "foreign-stock", kind: "stock", time: "23:55", flagLabel: "US", flagTone: "us" },
  { slug: "laos-super", titleKey: "markets.laosSuper", category: "laos", kind: "stock", time: "18:30", flagLabel: "LA", flagTone: "la" },
  { slug: "laos", titleKey: "markets.laos", category: "laos", kind: "stock", time: "20:00", flagLabel: "LA", flagTone: "la" },
  { slug: "hanoi-special", titleKey: "markets.hanoiSpecial", category: "hanoi", kind: "stock", time: "17:00", flagLabel: "VN", flagTone: "vn" },
  { slug: "hanoi", titleKey: "markets.hanoi", category: "hanoi", kind: "stock", time: "18:00", flagLabel: "VN", flagTone: "vn" },
  { slug: "hanoi-vip", titleKey: "markets.hanoiVip", category: "hanoi", kind: "stock", time: "19:00", flagLabel: "VN", flagTone: "vn" },
];

/** ยี่กีแต่ละความถี่ — จำนวนรอบตามกติกา (เปิดรอบแรก 06:00 ของวันก่อนหน้า ถึงรอบสุดท้ายก่อน 04:00) */
const YIKI_SCHEDULE = [
  { slug: "yiki-5", titleKey: "markets.yiki5" as LotteryMessageKey, interval: 5, total: 262 },
  { slug: "yiki-15", titleKey: "markets.yiki15" as LotteryMessageKey, interval: 15, total: 88 },
  { slug: "yiki-30", titleKey: "markets.yiki30" as LotteryMessageKey, interval: 30, total: 44 },
] as const;

/** รอบแรกของยี่กีเริ่ม 06:00 (นับจากวันก่อนหน้า) */
const YIKI_FIRST_ROUND_MINUTES = 6 * 60;

/** เลขสุ่มแบบกำหนดผลซ้ำได้ (วันเดียวกัน = ผลเดิม) — mock เท่านั้น */
function seededRandom(seed: string): () => number {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const digits = (rand: () => number, count: number): string =>
  Array.from({ length: count }, () => Math.floor(rand() * 10)).join("");

function buildFigures(kind: ResultKind, rand: () => number, done: boolean): LotteryResultFigure[] {
  const pick = (count: number) => (done ? digits(rand, count) : null);
  if (kind === "gov") {
    const first = pick(6);
    return [
      { id: "first", value: first, digits: 6, wide: true },
      { id: "top3", value: first ? first.slice(-3) : null, digits: 3 },
      { id: "bottom2", value: pick(2), digits: 2 },
      { id: "front3", value: pick(3), digits: 3 },
      { id: "back3", value: pick(3), digits: 3 },
    ];
  }
  if (kind === "baac") {
    const drawn = pick(6);
    return [
      { id: "drawn", value: drawn, digits: 6, wide: true },
      { id: "top3", value: drawn ? drawn.slice(-3) : null, digits: 3 },
      { id: "bottom2", value: pick(2), digits: 2 },
    ];
  }
  const top3 = pick(3);
  return [
    { id: "top3", value: top3, digits: 3 },
    { id: "top2", value: top3 ? top3.slice(-2) : null, digits: 2 },
    { id: "bottom2", value: pick(2), digits: 2 },
  ];
}

/**
 * ผลรางวัลทุกตลาดของวันที่ระบุ (mock) — วันที่ผ่านมา = ออกครบ · วันนี้ = ออกตามเวลาปัจจุบัน
 * ต่อ backend: GET /api/lottery/results?date=YYYY-MM-DD ส่งรูปเดียวกัน (LotteryResultsDay)
 */
export function buildLotteryResultsForDate(date: string, now: Date = new Date()): LotteryResultsDay {
  const today = bangkokToday(now);
  const nowMinutes = bangkokMinutes(now);
  const isToday = date === today;
  const isFuture = date > today;

  const draws: LotteryDrawResult[] = LOTTERY_RESULT_SCHEDULE.map((entry) => {
    const done = !isFuture && (!isToday || timeToMinutes(entry.time) <= nowMinutes);
    const status: LotteryResultStatus = done ? "done" : "pending";
    return {
      id: `${entry.slug}-${date}`,
      marketSlug: entry.slug,
      titleKey: entry.titleKey,
      category: entry.category,
      flagLabel: entry.flagLabel,
      flagTone: entry.flagTone,
      drawDate: date,
      drawTime: entry.time,
      status,
      figures: buildFigures(entry.kind, seededRandom(`${date}:${entry.slug}`), done),
    };
  });

  /** ยี่กีของวัน D = รอบที่เริ่ม 06:00 ของ D-1 ถึงก่อน 04:00 ของ D — นับนาทีจากจุดเริ่มนั้น */
  const yikiElapsed = isFuture ? -1 : isToday ? nowMinutes + 1440 - YIKI_FIRST_ROUND_MINUTES : Number.POSITIVE_INFINITY;
  const yiki: LotteryYikiResults[] = YIKI_SCHEDULE.map((entry) => {
    const rand = seededRandom(`${date}:${entry.slug}`);
    const rounds = Array.from({ length: entry.total }, (_, index) => {
      const offset = index * entry.interval;
      const done = offset <= yikiElapsed;
      return {
        round: index + 1,
        time: minutesToTime(YIKI_FIRST_ROUND_MINUTES + offset),
        status: (done ? "done" : "pending") as LotteryResultStatus,
        top3: done ? digits(rand, 3) : null,
        bottom2: done ? digits(rand, 2) : null,
      };
    });
    return { slug: entry.slug, titleKey: entry.titleKey, intervalMinutes: entry.interval, total: entry.total, rounds };
  });

  return { date, draws, yiki };
}

/** วันที่เก่าสุดที่ดูย้อนหลังได้ใน mock (วัน) */
export const LOTTERY_RESULTS_MAX_DAYS_BACK = 90;

/** ขอบเขตวันที่เลือกได้ — [เก่าสุด, วันนี้] */
export function lotteryResultsDateBounds(now: Date = new Date()): { min: string; max: string } {
  const max = bangkokToday(now);
  return { min: shiftIsoDate(max, -LOTTERY_RESULTS_MAX_DAYS_BACK), max };
}
