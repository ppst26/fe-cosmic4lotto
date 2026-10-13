import { DESKTOP_PLAYER_PANEL_MOCK } from "@/app/data/desktopLobbyMockData";
import { HALL_OF_FAME_DATA } from "@/app/data/hallOfFameMockData";
import { LOBBY_ANNOUNCEMENT_MESSAGES } from "@/app/data/lobbyAnnouncementMockData";
import {
  FEATURE_ACTIONS_DATA,
  GAME_SECTIONS_DATA,
  HOME_DESKTOP_PEEK_CAROUSEL_DATA,
  HOME_LOBBY_TOURNAMENT_ITEMS,
  HOME_SLOTS_PROVIDER_ITEMS,
  INTRO_STATS_DATA,
  POPULAR_HIGHLIGHTS_DATA,
  PROMO_CAROUSEL_DATA,
  PROVIDERS_DATA,
  WELCOME_BANNER_SLIDES,
} from "@/app/data/lobbyMockData";
import { MOST_ONLINE_LOBBY_ITEMS } from "@/app/data/mostOnlineLobbyMockData";
import type {
  FeatureActionItem,
  GameItem,
  GameSectionData,
  HallOfFameRow,
  HallOfFameTabId,
  HighlightItem,
  HomeLobbyTournamentItem,
  IntroStats,
  MostOnlineLobbyItem,
  PromoItem,
  ProviderItem,
  WelcomeBannerSlide,
} from "@/app/types/lobby";
import type { ApiResult } from "./http";
import { mockResult } from "./mock";

/**
 * เนื้อหา lobby หน้าแรก (สาธารณะ) — ดึงฝั่ง server ใน app/(lobby)/layout.tsx ผ่าน loadLobbyContent()
 * ต่อ backend: แต่ละฟังก์ชันเปลี่ยนเป็น apiFetch(path) (ต้องตั้ง NEXT_PUBLIC_API_BASE_URL แบบ absolute เพราะเรียกจาก server)
 */

export interface HomeBannersData {
  welcomeSlides: WelcomeBannerSlide[];
  promoCarousel: PromoItem[];
  peek: PromoItem[];
}

export interface HomeGamesData {
  sections: GameSectionData[];
  slotProviders: GameItem[];
}

export type HallOfFameData = Record<HallOfFameTabId, HallOfFameRow[]>;

/** แบนเนอร์ hero / promo / peek desktop — GET /api/lobby/banners */
export function fetchHomeBanners(): Promise<ApiResult<HomeBannersData>> {
  return mockResult({
    welcomeSlides: WELCOME_BANNER_SLIDES,
    promoCarousel: PROMO_CAROUSEL_DATA,
    peek: HOME_DESKTOP_PEEK_CAROUSEL_DATA,
  });
}

/** ไฮไลต์ + สถิติ intro — GET /api/lobby/highlights */
export function fetchHomeHighlights(): Promise<ApiResult<{ highlights: HighlightItem[]; intro: IntroStats }>> {
  return mockResult({ highlights: POPULAR_HIGHLIGHTS_DATA, intro: INTRO_STATS_DATA });
}

/** section เกมหน้าแรก — GET /api/lobby/games */
export function fetchHomeGames(): Promise<ApiResult<HomeGamesData>> {
  return mockResult({ sections: GAME_SECTIONS_DATA, slotProviders: HOME_SLOTS_PROVIDER_ITEMS });
}

/** ค่ายเกมหน้าแรก — GET /api/lobby/providers */
export function fetchHomeProviders(): Promise<ApiResult<ProviderItem[]>> {
  return mockResult(PROVIDERS_DATA);
}

/** การ์ด feature action — GET /api/lobby/feature-actions */
export function fetchHomeFeatureActions(): Promise<ApiResult<FeatureActionItem[]>> {
  return mockResult(FEATURE_ACTIONS_DATA);
}

/** ทัวร์นาเมนต์ — GET /api/lobby/tournaments */
/** แถบออนไลน์มากที่สุดหน้าแรก — GET /api/lobby/most-online */
export function fetchHomeMostOnline(): Promise<ApiResult<MostOnlineLobbyItem[]>> {
  return mockResult(MOST_ONLINE_LOBBY_ITEMS);
}

export function fetchHomeTournaments(): Promise<ApiResult<HomeLobbyTournamentItem[]>> {
  return mockResult(HOME_LOBBY_TOURNAMENT_ITEMS);
}

/** ประกาศวิ่ง — GET /api/lobby/announcements */
export function fetchLobbyAnnouncements(): Promise<ApiResult<readonly string[]>> {
  return mockResult(LOBBY_ANNOUNCEMENT_MESSAGES);
}

/** Hall of Fame รอบแรก — GET /api/lobby/hall-of-fame */
export function fetchHallOfFame(): Promise<ApiResult<HallOfFameData>> {
  return mockResult(HALL_OF_FAME_DATA);
}

/** แผงผู้เล่น desktop — GET /api/lobby/desktop-player (ยังไม่มี UI ใช้) */
export function fetchDesktopPlayerPanel(): Promise<ApiResult<typeof DESKTOP_PLAYER_PANEL_MOCK>> {
  return mockResult(DESKTOP_PLAYER_PANEL_MOCK);
}

/** ทุกอย่างที่หน้า lobby ใช้ — ส่งเป็น props ให้ HomeLobbyPage */
export interface LobbyContent {
  banners: HomeBannersData;
  games: HomeGamesData;
  mostOnline: MostOnlineLobbyItem[];
  tournaments: HomeLobbyTournamentItem[];
  announcements: readonly string[];
  hallOfFame: HallOfFameData;
}

const EMPTY_HALL_OF_FAME: HallOfFameData = { "latest-winner": [], "top-win-multiple": [] };

function orFallback<T>(res: ApiResult<T>, fallback: T, label: string): T {
  if (res.ok) return res.data;
  console.error(`[lobby] โหลด ${label} ไม่สำเร็จ:`, res.error.message);
  return fallback;
}

/**
 * โหลดเนื้อหา lobby พร้อมกัน — ส่วนที่พลาดใช้ค่าว่าง (หน้าไม่พังทั้งหน้า)
 * ใช้ใน app/(lobby)/layout.tsx (server)
 */
export async function loadLobbyContent(): Promise<LobbyContent> {
  const [banners, games, mostOnline, tournaments, announcements, hallOfFame] = await Promise.all([
    fetchHomeBanners(),
    fetchHomeGames(),
    fetchHomeMostOnline(),
    fetchHomeTournaments(),
    fetchLobbyAnnouncements(),
    fetchHallOfFame(),
  ]);
  return {
    banners: orFallback(banners, { welcomeSlides: [], promoCarousel: [], peek: [] }, "banners"),
    games: orFallback(games, { sections: [], slotProviders: [] }, "games"),
    mostOnline: orFallback(mostOnline, [], "most online"),
    tournaments: orFallback(tournaments, [], "tournaments"),
    announcements: orFallback(announcements, [], "announcements"),
    hallOfFame: orFallback(hallOfFame, EMPTY_HALL_OF_FAME, "hall of fame"),
  };
}
