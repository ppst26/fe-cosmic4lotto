import { cache } from "react";
import thLottery from "@/lib/i18n/messages/th/lottery.json";
import { fetchLotteryHub, fetchThaiLottoBoard } from "@/lib/api/lotteryContent";
import type { LotteryResultRow } from "@/app/types/lottery";
import type { LottoCardData, ThaiLottoResults } from "./mock-home-data";
import { LOTTO_CARD_META } from "./lotto-card-meta";

/*
 * ผลหวยหน้าแรก — สร้างจากข้อมูลหวยของ glass (lib/api/lotteryContent.ts → LOTTERY_LATEST_RESULTS / THAI_LOTTO_LAST_RESULT)
 * แล้ว map เข้ารูปเดิมของ lotto (LottoCardData / ThaiLottoResults) · ชื่อฟังก์ชันคงเดิม แต่เป็น async
 */

export const BANK_LOTTO_IDS = ["laoslotto", "hanoylotto"] as const;
export const DASHBOARD_LOTTO_IDS = [
  "malaylotto",
  "chinalotto",
  "nikkeilotto",
  "korealotto",
] as const;

const TIME_ZONE = "Asia/Bangkok";

function formatLongDate(iso: string | null): string {
  const date = iso ? new Date(iso) : new Date();
  return date.toLocaleDateString("th-TH", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: TIME_ZONE,
  });
}

function formatShortDate(iso: string | undefined): string {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: TIME_ZONE,
  });
}

/** "markets.laos" → "หวยลาว" (ข้อความไทยของ glass) */
function marketName(titleKey: string): string {
  const key = titleKey.replace(/^markets\./, "") as keyof typeof thLottery.markets;
  return thLottery.markets[key] ?? thLottery.markets.generic;
}

function rowToCard(id: string, rows: LotteryResultRow[]): LottoCardData | null {
  const meta = LOTTO_CARD_META[id];
  if (!meta) return null;
  const row = rows.find((r) => r.id === meta.rowId);
  if (!row) return null;
  return {
    id,
    name: marketName(row.titleKey),
    flagEmoji: meta.flagEmoji,
    periodLabel: formatLongDate(row.drawDate),
    top3: row.top3 || "XXX",
    bottom2: row.bottom2 || "XX",
  };
}

/** cache ต่อ request — layout + page + หลายการ์ดเรียกซ้ำได้โดยยิง API ครั้งเดียว */
const loadLatestRows = cache(async (): Promise<LotteryResultRow[]> => {
  const res = await fetchLotteryHub();
  return res.ok ? res.data.latest : [];
});

/** ผลหวยรัฐบาลไทยงวดล่าสุด · null เมื่อโหลดไม่ได้ (LottoHomePage fallback เป็น thaiLottoMock) */
export const loadThaiLottoFromDump = cache(async (): Promise<ThaiLottoResults | null> => {
  const res = await fetchThaiLottoBoard();
  if (!res.ok) return null;
  const last = res.data.lastResult;
  return {
    dateLabel: formatShortDate(last.drawLabel.kind === "time" ? undefined : last.drawLabel.date),
    prizeFirst: last.firstPrize || "-",
    frontThree: last.front3.length ? last.front3 : ["-", "-"],
    backThree: last.back3.length ? last.back3 : ["-", "-"],
    backTwo: last.bottom2 || "-",
  };
});

export async function loadLottoCardsByIds(ids: readonly string[]): Promise<LottoCardData[]> {
  const rows = await loadLatestRows();
  const out: LottoCardData[] = [];
  for (const id of ids) {
    const card = rowToCard(id, rows);
    if (card) out.push(card);
  }
  return out;
}

export function loadBankLottoFromDump(): Promise<LottoCardData[]> {
  return loadLottoCardsByIds(BANK_LOTTO_IDS);
}

export function loadDashboardLottoFromDump(): Promise<LottoCardData[]> {
  return loadLottoCardsByIds(DASHBOARD_LOTTO_IDS);
}

/** รวมทุกใบ (fallback สำหรับ mock) */
export async function loadLottoCardsFromDump(): Promise<LottoCardData[]> {
  return loadLottoCardsByIds([...BANK_LOTTO_IDS, ...DASHBOARD_LOTTO_IDS]);
}
