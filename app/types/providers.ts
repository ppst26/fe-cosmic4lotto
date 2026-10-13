import type { MessageKey } from "@/lib/i18n/messages";

/* ── จาก app/data/cardsProvidersData.ts ── */

export interface CardsCardItem {
  id: string;
  title: string;
  provider: string;
  badges: ("EXCLUSIVE" | "LIVE" | "HOT" | "POPULAR")[];
  coverSrc?: string;
  bgGradient?: string;
  artType?: string;
  tags: string[];
  href: string;
}

/* ── จาก app/data/casinoProvidersData.ts ── */

export interface CasinoFilterTabItem {
  id: string;
  labelKey: MessageKey<"games">;
  iconId: "gift" | "gamepad" | "cards" | "roulette" | "game-shows" | "dice";
}

export interface CasinoCardItem {
  id: string;
  title: string;
  provider: string;
  badges: ("EXCLUSIVE" | "LIVE" | "HOT" | "POPULAR")[];
  bgGradient?: string;
  artType?: string;
  /** รูปปกจาก public/casino — แสดงเต็มการ์ดแทน SVG */
  coverSrc?: string;
  tags: string[];
  href: string;
}

/* ── จาก app/data/fishingProvidersData.ts ── */

export interface FishingFilterTabItem {
  id: string;
  labelKey: MessageKey<"games">;
  iconId: "gift" | "gamepad" | "water-drop" | "flame" | "trophy";
}

export interface FishingCardItem {
  id: string;
  title: string;
  provider: string;
  badges: ("EXCLUSIVE" | "LIVE" | "HOT" | "POPULAR")[];
  coverSrc?: string;
  bgGradient?: string;
  artType?: string;
  tags: string[];
  href: string;
}

/* ── จาก app/data/sportProvidersData.ts ── */

export interface SportFilterTabItem {
  id: string;
  labelKey: MessageKey<"games">;
  iconId: "gift" | "gamepad" | "football" | "basketball" | "esports" | "boxing" | "tennis";
}

export interface SportCardItem {
  id: string;
  title: string;
  provider: string;
  badges: ("EXCLUSIVE" | "LIVE" | "HOT" | "POPULAR")[];
  /** รูปปกจาก public/sport — แสดงเต็มการ์ดแทน SVG mock */
  coverSrc?: string;
  bgGradient?: string;
  artType?: string;
  tags: string[];
  href: string;
}

/* ── จาก app/data/slotProvidersData.ts ── */

export interface SlotFilterTabItem {
  id: string;
  labelKey: MessageKey<"games">;
  iconId: "gift" | "gamepad" | "water-drop" | "chicken" | "flame" | "trophy" | "sparkle";
}

export interface FeaturedSlotProviderItem {
  id: string;
  name: string;
  slogan: string;
  badge?: string;
  bgGradient: string;
  borderColor: string;
  glowColor: string;
  href: string;
  artType: "jili-skeleton" | "pragmatic-zeus";
  /** รูปจาก public/slots */
  coverSrc?: string;
  tags?: string[];
}

export interface GridSlotProviderItem {
  id: string;
  name: string;
  category: string;
  bgGradient: string;
  borderColor: string;
  href: string;
  artType:
    | "ygr-caishen"
    | "king-midas"
    | "spade-girl"
    | "joker-cards"
    | "fachai-lion"
    | "royal-adventurer"
    | "relax-tropical"
    | "ka-fantasy"
    | "generic";
  /** รูปจาก public/slots */
  coverSrc?: string;
  badge?: string;
  tags?: string[];
}

/* ── จาก app/data/homeProviderLogosData.ts ── */

export interface HomeProviderLogoItem {
  id: string;
  name: string;
  logoSrc: string;
  href: string;
}

/* ── จาก app/data/providerGamesData.ts ── */

export interface ProviderGameItem {
  id: string;
  title: string;
  providerId: string;
  category?: string;
  artType: string;
  bgGradient: string;
  accentColor: string;
  badge?: string;
  isFavorite?: boolean;
}

export interface ProviderInfo {
  id: string;
  name: string;
  slogan?: string;
  totalGames: number;
}
