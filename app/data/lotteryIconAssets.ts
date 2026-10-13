/** path รูปประเภทหวยใน public/lottery — ใช้กับ LotteryMarketIcon */
const LOTTERY_ICON_BASE = "/lottery";

/** slug จาก URL /lottery/{slug} → ไฟล์ webp */
export const LOTTERY_ICON_BY_SLUG: Record<string, string> = {
  "thai-government": `${LOTTERY_ICON_BASE}/ic-government-effect.webp`,
  "yiki-5": `${LOTTERY_ICON_BASE}/ic-stock_yk5-effect.webp`,
  "yiki-15": `${LOTTERY_ICON_BASE}/ic-stock_yk15-effect.webp`,
  /** ยังไม่มี asset แยก 30 นาที — ใช้ชุด 15 ชั่วคราว */
  "yiki-30": `${LOTTERY_ICON_BASE}/ic-stock_yk15-effect.webp`,
  baac: `${LOTTERY_ICON_BASE}/ic-baac-effect.webp`,
  laos: `${LOTTERY_ICON_BASE}/ic-laos-effect.webp`,
  hanoi: `${LOTTERY_ICON_BASE}/ic-hanoi-effect.webp`,
  malaysia: `${LOTTERY_ICON_BASE}/ic-malay-effect.webp`,
  "dow-jones": `${LOTTERY_ICON_BASE}/ic-stock_dow_jones-effect.webp`,
  china: `${LOTTERY_ICON_BASE}/ic-stock_china-effect.webp`,
  germany: `${LOTTERY_ICON_BASE}/ic-stock_germany-effect.webp`,
  russia: `${LOTTERY_ICON_BASE}/ic-stock_russia-effect.webp`,
  korea: `${LOTTERY_ICON_BASE}/ic-stock_korea-effect.webp`,
  nikkei: `${LOTTERY_ICON_BASE}/ic-stock_japan-effect.webp`,
  uk: `${LOTTERY_ICON_BASE}/ic-stock_england-effect.webp`,
  "hong-kong": `${LOTTERY_ICON_BASE}/ic-stock_hongkong-effect.webp`,
  taiwan: `${LOTTERY_ICON_BASE}/ic-stock_taiwan-effect.webp`,
  singapore: `${LOTTERY_ICON_BASE}/ic-stock_singapore-effect.webp`,
  india: `${LOTTERY_ICON_BASE}/ic-stock_india-effect.webp`,
  egypt: `${LOTTERY_ICON_BASE}/ic-stock_egypt-effect.webp`,
};

/** แถวผลหวยล่าสุด — map id แถว → slug ตลาด */
export const LOTTERY_RESULT_ROW_ICON_SLUG: Record<string, string> = {
  "res-my": "malaysia",
  "res-cn": "china",
  "res-hn": "hanoi",
  "res-th": "thai-government",
  "res-jp": "nikkei",
  "res-kr": "korea",
  "res-us": "dow-jones",
  "res-la": "laos",
};

/** ดึง slug จาก href หวย เช่น /lottery/yiki-5 → yiki-5 */
export function lotteryHrefToSlug(href: string): string {
  const trimmed = href.replace(/\/$/, "");
  const prefix = "/lottery/";
  if (!trimmed.startsWith(prefix)) return trimmed;
  return trimmed.slice(prefix.length);
}

/** คืน path รูปจาก slug ตลาด — ไม่มีในแมปคืน undefined */
export function getLotteryIconSrc(slug: string): string | undefined {
  return LOTTERY_ICON_BY_SLUG[slug];
}

/** รูปจาก href หรือ id แถวผลหวย */
export function getLotteryIconSrcFromHref(href: string): string | undefined {
  return getLotteryIconSrc(lotteryHrefToSlug(href));
}

export function getLotteryIconSrcForResultRow(rowId: string): string | undefined {
  const slug = LOTTERY_RESULT_ROW_ICON_SLUG[rowId];
  return slug ? getLotteryIconSrc(slug) : undefined;
}
