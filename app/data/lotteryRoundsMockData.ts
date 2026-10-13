import type { LotteryPlayRound, ThaiLottoDraw } from "@/app/types/lottery";
import { generateYikiRounds, getYikiRoundById } from "./yikiMockData";
import { getLotteryMarketBySlug } from "./lotteryMarketsMockData";

const BKK_OFFSET_MS = 7 * 60 * 60 * 1000;

function bkkDate(year: number, month: number, day: number, hour: number, minute: number): Date {
  const utc = Date.UTC(year, month - 1, day, hour - 7, minute, 0, 0);
  return new Date(utc);
}

/** วันออกหวยรัฐบาลไทย — วันที่ 1 และ 16 ของเดือน เวลา 16:00 น. */
function enumerateThaiGovernmentDrawDates(from: Date, max: number): Date[] {
  const start = new Date(from.getTime());
  start.setHours(0, 0, 0, 0);
  const results: Date[] = [];

  for (let monthOffset = 0; monthOffset < 36 && results.length < max; monthOffset += 1) {
    const probe = new Date(start.getFullYear(), start.getMonth() + monthOffset, 1);
    const year = probe.getFullYear();
    const month = probe.getMonth() + 1;
    for (const day of [1, 16]) {
      const drawAt = bkkDate(year, month, day, 16, 0);
      if (drawAt.getTime() >= start.getTime() - BKK_OFFSET_MS) {
        results.push(drawAt);
      }
      if (results.length >= max) break;
    }
  }

  return results.sort((a, b) => a.getTime() - b.getTime());
}

function resolveRoundStatus(now: number, openAt: number, closeAt: number): LotteryPlayRound["status"] {
  if (now < openAt) return "upcoming";
  if (now >= closeAt) return "closed";
  return "open";
}

/**
 * สร้างรอบหวยรัฐบาลไทย — งวด 1 และ 16 · ปิดรับ 15:00 · เปิดแทง ~2 วันก่อนงวด
 */
export function generateThaiGovernmentPlayRounds(count = 6, from = new Date()): LotteryPlayRound[] {
  const now = from.getTime();
  const drawDates = enumerateThaiGovernmentDrawDates(from, count);

  const rounds = drawDates.map((drawAt) => {
    const closeAt = bkkDate(
      drawAt.getFullYear(),
      drawAt.getMonth() + 1,
      drawAt.getDate(),
      15,
      0,
    );
    const openAt = new Date(closeAt.getTime() - 2 * 24 * 60 * 60 * 1000);
    openAt.setHours(1, 0, 0, 0);

    const id = `th-gov-${drawAt.getFullYear()}-${String(drawAt.getMonth() + 1).padStart(2, "0")}-${String(drawAt.getDate()).padStart(2, "0")}`;

    return {
      id,
      drawLabel: { kind: "draw" as const, date: drawAt.toISOString() },
      drawAt: drawAt.toISOString(),
      closeAt: closeAt.toISOString(),
      openAt: openAt.toISOString(),
      status: resolveRoundStatus(now, openAt.getTime(), closeAt.getTime()),
      minBet: 1,
      maxBet: 5000,
    };
  });

  if (!rounds.some((round) => round.status === "open")) {
    const next = rounds.find((round) => new Date(round.closeAt).getTime() > now);
    if (next) next.status = "open";
  }

  return rounds;
}

/** หวยต่างประเทศ/ธ.ก.ส. — mock รอบรายวัน (เปิดวันนี้ + คิวถัดไป) */
function generateDailyMarketPlayRounds(slug: string, from = new Date()): LotteryPlayRound[] {
  const market = getLotteryMarketBySlug(slug);
  const titleKey = market?.titleKey ?? "markets.generic";
  const now = from.getTime();

  return [0, 1, 2].map((dayOffset) => {
    const base = new Date(from);
    base.setDate(base.getDate() + dayOffset);
    base.setHours(16, 0, 0, 0);
    const drawAt = base;
    const closeAt = new Date(drawAt.getTime() - 30 * 60 * 1000);
    const openAt = new Date(drawAt);
    openAt.setDate(openAt.getDate() - 1);
    openAt.setHours(1, 0, 0, 0);

    const id = `${slug}-${drawAt.getFullYear()}${String(drawAt.getMonth() + 1).padStart(2, "0")}${String(drawAt.getDate()).padStart(2, "0")}`;

    let status = resolveRoundStatus(now, openAt.getTime(), closeAt.getTime());
    if (market?.status === "closed" && dayOffset === 0) status = "closed";

    return {
      id,
      drawLabel: { kind: "market" as const, titleKey, date: drawAt.toISOString() },
      drawAt: drawAt.toISOString(),
      closeAt: closeAt.toISOString(),
      openAt: openAt.toISOString(),
      status,
      minBet: 1,
      maxBet: 2000,
    };
  });
}

/** จำนวนรอบ mock ต่อประเภทยี่กี — 5 นาทีมีมากกว่า 15/30 */
const YIKI_ROUND_COUNTS: Record<string, { interval: number; count: number }> = {
  "yiki-5": { interval: 5, count: 37 },
  "yiki-15": { interval: 15, count: 37 },
  "yiki-30": { interval: 30, count: 24 },
};

function yikiPlayRounds(intervalMin: number, count: number, from = new Date()): LotteryPlayRound[] {
  const yikiRounds = generateYikiRounds(count, intervalMin, from);
  const now = from.getTime();

  return yikiRounds.map((round, index) => {
    const drawAt = new Date(round.closeAt);
    drawAt.setMinutes(drawAt.getMinutes() + 2);
    const openAt = new Date(drawAt.getTime() - intervalMin * 60 * 1000);

    const stillOpen = now < new Date(round.closeAt).getTime();

    return {
      id: round.id,
      drawLabel: round.label,
      drawAt: drawAt.toISOString(),
      closeAt: round.closeAt,
      openAt: openAt.toISOString(),
      status: stillOpen ? "open" : "closed",
      minBet: 1,
      maxBet: 2000,
    };
  });
}

/**
 * รายการรอบตาม slug ตลาด — เรียกฝั่ง client (ใช้ Date.now)
 */
/** รอบสูงสุดที่แสดงในหน้าเลือกรอบ — ยกเว้นยี่กี (กริด) */
export const LOTTERY_LOW_FREQ_MAX_ROUNDS = 4;

export function getLotteryPlayRounds(slug: string, from = new Date()): LotteryPlayRound[] {
  if (slug === "thai-government") return generateThaiGovernmentPlayRounds(LOTTERY_LOW_FREQ_MAX_ROUNDS, from);
  const yiki = YIKI_ROUND_COUNTS[slug];
  if (yiki) return yikiPlayRounds(yiki.interval, yiki.count, from);
  return generateDailyMarketPlayRounds(slug, from);
}

/** รอบเยอะ (ยี่กี) — แสดงเป็นกริด + ปุ่มขยาย */
export function lotteryMarketUsesRoundGrid(slug: string): boolean {
  return slug.startsWith("yiki-");
}

/** แปลงรอบหวยไทยเป็น ThaiLottoDraw สำหรับ bet board */
export function getThaiLottoDrawFromPlayRound(round: LotteryPlayRound): ThaiLottoDraw {
  return {
    id: round.id,
    drawLabel: round.drawLabel,
    closeAt: round.closeAt,
    minBet: round.minBet,
    maxBet: round.maxBet,
  };
}

export function getThaiLottoDrawByRoundId(roundId: string): ThaiLottoDraw | undefined {
  const match = /^th-gov-(\d{4})-(\d{2})-(\d{2})$/.exec(roundId);
  if (!match) return undefined;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const drawAt = bkkDate(year, month, day, 16, 0);
  const closeAt = bkkDate(year, month, day, 15, 0);
  return {
    id: roundId,
    drawLabel: { kind: "draw", date: drawAt.toISOString() },
    closeAt: closeAt.toISOString(),
    minBet: 1,
    maxBet: 5000,
  };
}

export function getLotteryPlayRoundById(slug: string, roundId: string): LotteryPlayRound | undefined {
  if (slug === "yiki-5" || slug === "yiki-15" || slug === "yiki-30") {
    const yiki = getYikiRoundById(roundId);
    if (!yiki) return undefined;
    const interval = YIKI_ROUND_COUNTS[slug]?.interval ?? 15;
    const drawAt = new Date(yiki.closeAt);
    drawAt.setMinutes(drawAt.getMinutes() + 2);
    return {
      id: yiki.id,
      drawLabel: yiki.label,
      drawAt: drawAt.toISOString(),
      closeAt: yiki.closeAt,
      openAt: new Date(drawAt.getTime() - interval * 60 * 1000).toISOString(),
      status: "open",
      minBet: 1,
      maxBet: 2000,
    };
  }

  if (slug === "thai-government") {
    const draw = getThaiLottoDrawByRoundId(roundId);
    if (!draw) return undefined;
    return {
      id: draw.id,
      drawLabel: draw.drawLabel,
      drawAt: draw.closeAt,
      closeAt: draw.closeAt,
      openAt: draw.closeAt,
      status: "open",
      minBet: draw.minBet,
      maxBet: draw.maxBet,
    };
  }

  return getLotteryPlayRounds(slug).find((round) => round.id === roundId);
}
