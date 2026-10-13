import { cache } from "react";
import thLottery from "@/lib/i18n/messages/th/lottery.json";
import { loadLobbyContent } from "@/lib/api/lobby";
import { LOTTERY_FEATURED_ITEMS } from "@/app/data/lotteryHubMockData";
import { getLotteryIconSrc, lotteryHrefToSlug } from "@/app/data/lotteryIconAssets";
import type { GameItem } from "@/app/types/lobby";

export type LobbyGameItem = {
  id: string;
  title: string;
  image: string;
  isHot?: boolean;
  isNew?: boolean;
  live?: boolean;
  players: number;
  /** ลิงก์ปลายทางของการ์ด — ไม่มีให้ LobbyGameCard สร้าง /play/[id] เอง */
  href?: string;
};

/*
 * การ์ด showcase หน้าแรก — สร้างจาก lobby ของ glass (lib/api/lobby.ts → loadLobbyContent())
 * casino = section-casino · slots = section-slots (ค่ายสล็อต) · sports = ว่าง (ไม่มีหน้า sport) · lotto = ตลาดหวย
 */

const loadGameSections = cache(async () => {
  const content = await loadLobbyContent();
  return content.games.sections;
});

function stablePlayers(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return 1700 + (h % 900);
}

function mapGame(g: GameItem, extra: Partial<LobbyGameItem> = {}): LobbyGameItem | null {
  if (!g.coverSrc) return null;
  return {
    id: g.id,
    title: g.title,
    image: g.coverSrc,
    players: stablePlayers(g.id),
    href: g.href,
    ...extra,
  };
}

async function loadSection(sectionId: string, limit: number, extra: Partial<LobbyGameItem> = {}) {
  const sections = await loadGameSections();
  const section = sections.find((s) => s.id === sectionId);
  const out: LobbyGameItem[] = [];
  for (const g of section?.games ?? []) {
    const item = mapGame(g, extra);
    if (item) out.push(item);
    if (out.length >= limit) break;
  }
  return out;
}

export function loadCasinoShowcase(limit = 24): Promise<LobbyGameItem[]> {
  return loadSection("section-casino", limit, { live: true });
}

export function loadSlotShowcase(limit = 24): Promise<LobbyGameItem[]> {
  return loadSection("section-slots", limit);
}

/** ไม่มีหน้ากีฬาใน XGAMBET — คืนว่างเสมอ (GameShowcaseSection คืน null เมื่อว่าง) */
export async function loadSportsShowcase(_limit = 24): Promise<LobbyGameItem[]> {
  return [];
}

/** ค่ายหวยสุดปัง — 4 ตลาดเด่นของ glass (LOTTERY_FEATURED_ITEMS) ลิงก์ไป /lottery/<slug> */
export const LOTTO_PROVIDER_SHOWCASE: LobbyGameItem[] = LOTTERY_FEATURED_ITEMS.flatMap((item) => {
  const slug = lotteryHrefToSlug(item.href);
  const image = getLotteryIconSrc(slug);
  if (!image) return [];
  const key = item.titleKey.replace(/^markets\./, "") as keyof typeof thLottery.markets;
  return [
    {
      id: item.id,
      title: thLottery.markets[key] ?? thLottery.markets.generic,
      image,
      players: stablePlayers(item.id),
      href: item.href,
    },
  ];
});
