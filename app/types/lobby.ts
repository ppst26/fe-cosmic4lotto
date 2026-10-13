/**
 * Types และ Interfaces สำหรับหน้าหลัก Cosmicbet Lobby
 * ถูกนำไปใช้ร่วมกับ Component ใน app/components/home และ app/data/lobbyMockData.ts
 */

import type { MessageKey } from "@/lib/i18n/messages";

export type CategoryId =
  | "home"
  | "casino"
  | "slots"
  | "fishing"
  | "sports"
  | "lottery"
  | "cards";

export interface CategoryItem {
  id: CategoryId;
  /** key แปลชื่อหมวด — render ด้วย useT("home")(labelKey) */
  labelKey: MessageKey<"home">;
  href: string;
}

export interface PromoItem {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  accentColor?: string;
  /** รูปแบนเนอร์เต็มการ์ด — จาก public/HomeProBanner */
  bannerSrc?: string;
}

/** สไลด์ Welcome Hero หน้าแรก — WelcomeBanner carousel */
export interface WelcomeBannerSlide {
  id: string;
  bannerSrc: string;
  title: string;
  subtitle: string;
  ctaText?: string;
}

/** สไลด์ Welcome Hero หน้าแรก — WelcomeBanner.tsx */
export interface WelcomeBannerSlide {
  id: string;
  bannerSrc: string;
  title: string;
  subtitle: string;
  ctaText?: string;
}

export interface HighlightItem {
  id: string;
  title: string;
  type: "swipe_bet" | "event_banner";
  href: string;
  tag?: string;
  /** รูปการ์ดเต็มช่อง — public/HomeProBanner */
  imageSrc?: string;
}

/**
 * สถิติที่แสดงใน Cosmic Intro (อาณาจักรแห่งความมันส์)
 * ตัวเลขต้องมาจากแหล่งข้อมูลจริง — ค่าใน mock เป็นตัวอย่างจัดวางเท่านั้น
 */
export interface IntroStats {
  gamesCount: number;
  providersCount: number;
}

/**
 * ไอคอนประจำหัวข้อ section — แมปเป็น SVG ใน app/components/ui/Icons.tsx ผ่าน SectionIcon
 */
export type SectionIconId =
  | "sparkle"
  | "flame"
  | "cherries"
  | "cards"
  | "fish"
  | "football"
  | "network";

/**
 * โทนสีของ placeholder ปกเกมเมื่อยังไม่มี asset จริง
 * ค่าสีจริงกำหนดครั้งเดียวใน app/globals.css (.cover-tone-*)
 */
export type CoverTone =
  | "indigo"
  | "rose"
  | "emerald"
  | "amber"
  | "sky"
  | "violet";

export interface GameItem {
  id: string;
  title: string;
  provider: string;
  href: string;
  /** path รูปปกจริง — ถ้าไม่มีให้ GameCard แสดง placeholder ตาม coverTone */
  coverSrc?: string;
  coverTone?: CoverTone;
  /** ป้ายกำกับเล็กบนการ์ด เช่น EXCLUSIVE */
  badge?: string;
}

export interface GameSectionData {
  id: string;
  title: string;
  /** key แปลหัวข้อ section (mock) — ไม่มีใช้ title จาก backend */
  titleKey?: MessageKey<"home">;
  icon: SectionIconId;
  viewAllHref: string;
  games: GameItem[];
  /** จำกัดการ์ดใน carousel — default จาก HOME_LOBBY_GAME_CAROUSEL_MAX */
  carouselMax?: number;
}

export interface ProviderItem {
  id: string;
  name: string;
  href: string;
  /** path โลโก้จริง — ถ้าไม่มีให้ ProviderCard แสดงชื่อค่ายแทน */
  logoSrc?: string;
}

/** การ์ดค่าย/เกมในแถบ «ออนไลน์มากที่สุด» หน้าแรก — MostOnlineProvidersSection */
export interface MostOnlineLobbyItem {
  id: string;
  brandName: string;
  tagline: string;
  href: string;
  coverSrc: string;
  onlineCount: number;
  showHot?: boolean;
}

/** ไอคอนประจำการ์ดฟีเจอร์ — ร้านค้าเพชร / ภารกิจ / วงล้อ */
export type FeatureActionIconId = "diamond-shop" | "missions" | "prize-wheel";

export interface FeatureActionItem {
  id: string;
  title: string;
  /** คำอธิบายสั้นใต้หัวข้อ — FeatureActionCard */
  description: string;
  href: string;
  icon: FeatureActionIconId;
  /** ปุ่ม CTA ขาวหลัก */
  ctaPrimaryLabel: string;
  /** ปุ่มรองโปร่งแสง */
  ctaSecondaryLabel: string;
  /** ลิงก์ปุ่มรอง — ไม่ระบุใช้ href หลัก */
  secondaryHref?: string;
}

export type JackpotCategory = "casino" | "sports" | "slots";

/** ผู้ชนะ Jackpot — ข้อมูล mock สำหรับจัดวาง */
export interface JackpotWinner {
  id: string;
  maskedUsername: string;
  amount: number;
  currency: string;
  categoryLabel: string;
  gameName: string;
  providerName: string;
  category: JackpotCategory;
}

/** การ์ดกิจกรรม/ทัวร์นาเมนต์บน lobby มือถือ — รูปจาก public/tournament */
export interface HomeLobbyTournamentItem {
  id: string;
  title: string;
  imageSrc: string;
  href?: string;
}

/** การ์ดกิจกรรมรูปเต็ม — ข้อความอยู่ในไฟล์ภาพ; brand/badge/description ใช้กับ aria-label */
export interface LobbyTournamentSectionItem {
  id: string;
  brandLabel: string;
  badge: string;
  description: string;
  imageSrc: string;
  href?: string;
}

export type HallOfFameTabId = "latest-winner" | "top-win-multiple";

/** แถว Hall of Fame — แท็บ Latest Winner (payout) / Top Win Multiple (winMultiple) */
export interface HallOfFameRow {
  id: string;
  gameName: string;
  /** ชื่อผู้เล่นปิดบัง เช่น mfx***832 */
  playerMasked: string;
  payout?: number;
  winMultiple?: number;
  /** เวลาชนะ — ทั้งสองแท็บ (รูปแบบ DD/MM/YYYY HH:mm:ss) */
  wonAtLabel?: string;
  /** รูปเกมมุมซ้าย — ไม่มีใช้ gameIcon + coverTone */
  coverSrc?: string;
  coverTone?: "indigo" | "rose" | "emerald" | "amber" | "sky" | "violet";
  gameIcon: SectionIconId;
}

export interface BottomNavItem {
  id: string;
  /** key ใน dictionary nav — render ด้วย useT("nav")(labelKey) */
  labelKey: MessageKey<"nav">;
  href: string;
  icon: "menu" | "deposit" | "withdraw" | "cashback" | "contact";
}
