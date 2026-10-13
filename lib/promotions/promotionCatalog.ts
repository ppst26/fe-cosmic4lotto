import { readFile } from "fs/promises";
import path from "path";
import type {
  PromotionDetailContent,
  PromotionDetailId,
  PromotionsCatalogResponse,
} from "@/app/types/promotions";

const CATALOG_REL = path.join("public", "promotions", "catalog.json");
const DETAILS_REL = path.join("public", "promotions", "details.json");

let catalogCache: PromotionsCatalogResponse | null = null;
let detailsCache: Record<string, PromotionDetailContent> | null = null;

/**
 * โหลด catalog จาก public/promotions — mock แทน back office list API
 */
export async function loadPromotionsCatalog(): Promise<PromotionsCatalogResponse> {
  if (process.env.NODE_ENV === "production" && catalogCache) {
    return catalogCache;
  }
  const filePath = path.join(process.cwd(), CATALOG_REL);
  const raw = await readFile(filePath, "utf8");
  const parsed = JSON.parse(raw) as PromotionsCatalogResponse;
  if (process.env.NODE_ENV === "production") {
    catalogCache = parsed;
  }
  return parsed;
}

/**
 * โหลดรายละเอียดโปรตาม id — mock แทน back office detail API
 */
export async function loadPromotionDetail(
  id: string,
): Promise<PromotionDetailContent | null> {
  if (!detailsCache || process.env.NODE_ENV !== "production") {
    const filePath = path.join(process.cwd(), DETAILS_REL);
    const raw = await readFile(filePath, "utf8");
    detailsCache = JSON.parse(raw) as Record<string, PromotionDetailContent>;
  }
  const detail = detailsCache[id];
  return detail ?? null;
}

const KNOWN_DETAIL_IDS: PromotionDetailId[] = [
  "welcome",
  "promo-cashback",
  "promo-refer-friends",
  "promo-vip",
  "promo-check-in",
  "promo-wheel",
];

export function isPromotionDetailId(id: string): id is PromotionDetailId {
  return KNOWN_DETAIL_IDS.includes(id as PromotionDetailId);
}
