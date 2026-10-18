import { CARDS_ITEMS } from "@/app/data/cardsProvidersData";
import { CASINO_ITEMS } from "@/app/data/casinoProvidersData";
import { FISHING_ITEMS } from "@/app/data/fishingProvidersData";
import { SPORT_ITEMS } from "@/app/data/sportProvidersData";
import { FEATURED_SLOT_PROVIDERS, GRID_SLOT_PROVIDERS } from "@/app/data/slotProvidersData";

export type GamingCategoryId = "slots" | "casino" | "fishing" | "sports" | "cards";

export type GamingProviderEntry = {
  key: string;
  title: string;
  href: string;
  image?: string;
};

export type GamingCategoryMeta = {
  id: GamingCategoryId;
  /** ชื่อหน้า (hero) — ไทยใหญ่ · อังกฤษเล็ก */
  th: string;
  en: string;
  basePath: string;
  /** แสดงโลโก้ค่ายใน sidebar ตัวกรอง (สล็อต/ยิงปลา/เกมไพ่) — คาสิโน/กีฬาไม่มี */
  showLogos: boolean;
};

export const GAMING_CATEGORIES: Record<GamingCategoryId, GamingCategoryMeta> = {
  slots: { id: "slots", th: "สล็อต", en: "Slots", basePath: "/slots", showLogos: true },
  casino: { id: "casino", th: "คาสิโน", en: "Live Casino", basePath: "/casino", showLogos: false },
  fishing: { id: "fishing", th: "ยิงปลา", en: "Fishing", basePath: "/fishing", showLogos: true },
  sports: { id: "sports", th: "กีฬา", en: "Sports", basePath: "/sport", showLogos: false },
  cards: { id: "cards", th: "เกมไพ่", en: "Card Games", basePath: "/cards", showLogos: true },
};

type CardItem = { id: string; title: string; href: string; coverSrc?: string };

const fromCards = (items: CardItem[]): GamingProviderEntry[] =>
  items.map((item) => ({ key: item.id, title: item.title, href: item.href, image: item.coverSrc }));

/** รายการค่ายของหมวด — ข้อมูลชุดเดียวกับหน้ารวมค่ายเดิม (สล็อตตัดค่ายซ้ำระหว่าง featured + grid) */
export function getGamingProviders(categoryId: GamingCategoryId): GamingProviderEntry[] {
  switch (categoryId) {
    case "casino":
      return fromCards(CASINO_ITEMS);
    case "fishing":
      return fromCards(FISHING_ITEMS);
    case "sports":
      return fromCards(SPORT_ITEMS);
    case "cards":
      return fromCards(CARDS_ITEMS);
    case "slots": {
      const seen = new Set<string>();
      return [...FEATURED_SLOT_PROVIDERS, ...GRID_SLOT_PROVIDERS]
        .filter((p) => (seen.has(p.id) ? false : (seen.add(p.id), true)))
        .map((p) => ({ key: p.id, title: p.name, href: p.href || `/slots/${p.id}`, image: p.coverSrc }));
    }
  }
}
