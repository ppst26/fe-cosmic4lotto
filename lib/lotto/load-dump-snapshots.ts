import fs from "fs";
import path from "path";
import type { LottoCardData, ThaiLottoResults } from "./mock-home-data";
import { LOTTO_CARD_META } from "./lotto-card-meta";

const DUMP_API = path.join(process.cwd(), "../dump/bblotto.iltx.cc/_api");

/** ลำดับตาม dump home (BankLotto + LottoDashboard) */
export const BANK_LOTTO_IDS = ["laoslotto", "hanoylotto"] as const;
export const DASHBOARD_LOTTO_IDS = [
  "gsblotto",
  "baaclotto",
  "laoslottoextra",
  "laoslottotv",
  "laoslottohd",
  "hanoylottostar",
] as const;

type DrawRow = {
  Date?: string;
  Name?: string;
  Result?: {
    "1"?: {
      data?: {
        top3?: string[];
        top6?: string[];
        bottom2?: string[];
        bottom3?: string[];
      };
    };
    data?: { top3?: string[]; bottom2?: string[] };
  };
};

function readApiBody(filename: string): unknown | null {
  const file = path.join(DUMP_API, filename);
  if (!fs.existsSync(file)) return null;
  const raw = JSON.parse(fs.readFileSync(file, "utf8")) as { body: string };
  return JSON.parse(raw.body);
}

function findDrawResultsPayload(): Record<string, unknown> | null {
  if (!fs.existsSync(DUMP_API)) return null;
  for (const name of fs.readdirSync(DUMP_API)) {
    if (!name.endsWith(".json")) continue;
    const raw = JSON.parse(
      fs.readFileSync(path.join(DUMP_API, name), "utf8"),
    ) as { url?: string; body: string };
    if (!raw.url?.includes("getdrawresultnew")) continue;
    const body = JSON.parse(raw.body) as { data?: Record<string, unknown> };
    if (body.data?.thailotto) return body.data;
  }
  return null;
}

function formatDate(iso?: string): string {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("th-TH", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function pickTop3(data?: { top3?: string[] }): string {
  const v = data?.top3?.[0];
  if (v && String(v).length > 0) return v;
  return "XXX";
}

function pickBottom2(data?: { bottom2?: string[] }): string {
  const v = data?.bottom2?.[0];
  if (v && String(v).length > 0) return v;
  return "XX";
}

function rowToCard(id: string, row: DrawRow): LottoCardData | null {
  const meta = LOTTO_CARD_META[id];
  if (!meta) return null;
  const data = row.Result?.["1"]?.data ?? row.Result?.data;
  return {
    id,
    name: meta.name,
    flagEmoji: meta.flagEmoji,
    periodLabel: formatDate(row.Date),
    top3: pickTop3(data),
    bottom2: pickBottom2(data),
  };
}

function indexDrawData(data: Record<string, unknown>) {
  const byName = new Map<string, DrawRow>();

  for (const key of ["gsblotto", "baaclotto", "thailotto"] as const) {
    const arr = data[key];
    if (Array.isArray(arr) && arr[0]) {
      byName.set(key, arr[0] as DrawRow);
    }
  }

  const lottoArr = data.lotto;
  if (Array.isArray(lottoArr)) {
    for (const row of lottoArr) {
      const name = (row as DrawRow).Name;
      if (name) byName.set(name, row as DrawRow);
    }
  }

  return byName;
}

export function loadThaiLottoFromDump(): ThaiLottoResults | null {
  const data = findDrawResultsPayload();
  const row = data ? indexDrawData(data).get("thailotto") : null;
  const th = row?.Result?.["1"]?.data;
  if (!th) return null;
  const bottom3 = th.bottom3 ?? [];
  return {
    dateLabel: row?.Date
      ? new Date(row.Date).toLocaleDateString("th-TH", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "-",
    prizeFirst: th.top6?.[0] ?? th.top3?.[0] ?? "-",
    frontThree: bottom3.slice(0, 2).length ? bottom3.slice(0, 2) : ["-", "-"],
    backThree: bottom3.slice(2, 4).length ? bottom3.slice(2, 4) : ["-", "-"],
    backTwo: th.bottom2?.[0] ?? "-",
  };
}

function cardsForIds(
  byName: Map<string, DrawRow>,
  ids: readonly string[],
): LottoCardData[] {
  const out: LottoCardData[] = [];
  for (const id of ids) {
    const row = byName.get(id);
    if (!row) continue;
    const card = rowToCard(id, row);
    if (card) out.push(card);
  }
  return out;
}

export function loadLottoCardsByIds(ids: readonly string[]): LottoCardData[] {
  const data = findDrawResultsPayload();
  if (!data) return [];
  return cardsForIds(indexDrawData(data), ids);
}

export function loadBankLottoFromDump(): LottoCardData[] {
  const data = findDrawResultsPayload();
  if (!data) return [];
  return cardsForIds(indexDrawData(data), BANK_LOTTO_IDS);
}

export function loadDashboardLottoFromDump(): LottoCardData[] {
  const data = findDrawResultsPayload();
  if (!data) return [];
  return cardsForIds(indexDrawData(data), DASHBOARD_LOTTO_IDS);
}

/** รวมทุกใบ (fallback สำหรับ mock) */
export function loadLottoCardsFromDump(): LottoCardData[] {
  return [...loadBankLottoFromDump(), ...loadDashboardLottoFromDump()];
}
