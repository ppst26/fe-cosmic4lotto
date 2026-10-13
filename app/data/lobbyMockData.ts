import {
  CategoryId,
  CategoryItem,
  PromoItem,
  WelcomeBannerSlide,
  HighlightItem,
  IntroStats,
  GameSectionData,
  GameItem,
  ProviderItem,
  FeatureActionItem,
  HomeLobbyTournamentItem,
  LobbyTournamentSectionItem,
  BottomNavItem,
} from "../types/lobby";
import type { MessageKey } from "@/lib/i18n/messages";
import { CASINO_FEATURED_ITEMS } from "./casinoFeaturedData";
import { SPORT_FEATURED_ITEMS } from "./sportFeaturedData";
import { FISHING_FEATURED_ITEMS } from "./fishingFeaturedData";
import { HOT_GAMES_FEATURED_ITEMS } from "./hotGamesFeaturedData";
import { GRID_SLOT_PROVIDERS } from "./slotProvidersData";

/** รูปทัวร์นาเมนต์ใน public/tournament */
export const TOURNAMENT_IMAGE_PATHS = {
  esport: "/tournament/esport.webp",
  esport2: "/tournament/esport2.webp",
  slotWin: "/tournament/slot-win.avif",
  sportWin: "/tournament/sport-win.avif",
} as const;

/** แถว SLOTS หน้าแรก — รูปค่ายจาก public/slots (สูงสุด 15 ใบต่อ carousel) */
export const HOME_SLOTS_PROVIDER_ITEMS: GameItem[] = GRID_SLOT_PROVIDERS.slice(0, 15).map(
  (provider) => ({
    id: `home-slots-${provider.id}`,
    title: provider.name,
    provider: provider.name,
    href: provider.href,
    coverSrc: provider.coverSrc,
  }),
);

/**
 * ข้อมูลจำลองหมวดหมู่เกม — แถบ CategoryNav / sidebar desktop
 */
/** แถบนำทาง header desktop (Dexsport-style pills) — Header.tsx */
export const HEADER_DESKTOP_NAV = [
  { id: "promotions", labelKey: "header.promotions", href: "/promotions", showBadge: true },
] as const satisfies readonly { labelKey: MessageKey<"nav">; [field: string]: unknown }[];

export const CATEGORIES_DATA: CategoryItem[] = [
  { id: "home", labelKey: "categories.home", href: "/" },
  { id: "casino", labelKey: "categories.casino", href: "/casino" },
  { id: "slots", labelKey: "categories.slots", href: "/slots" },
  { id: "fishing", labelKey: "categories.fishing", href: "/fishing" },
  { id: "sports", labelKey: "categories.sports", href: "/sport" },
  { id: "lottery", labelKey: "categories.lottery", href: "/lottery" },
  { id: "cards", labelKey: "categories.cards", href: "/cards" },
];

/** ไอคอน 3D หมวดเกม — แหล่งเดียวกับเมนู (menuIconAssets) */
export { CATEGORY_MENU_ICON_SRC as CATEGORY_3D_ICONS } from "@/app/data/menuIconAssets";

/**
 * แบนเนอร์โปรโมหน้าแรก — public/HomeProBanner (เรียงตาม PROMO_CAROUSEL_DATA 4 ใบแรก)
 */
export const HOME_PRO_BANNER_ASSETS = [
  "/HomeProBanner/HomeProBanner1.webp",
  "/HomeProBanner/HomeProBanner2.webp",
  "/HomeProBanner/HomeProBanner3.webp",
  "/HomeProBanner/HomeProBanner4.webp",
] as const;

/** แบนเนอร์ Welcome Pack หน้าแรก */
export const MAIN_HOME_BANNER_SRC = "/HomeProBanner/MainHomeBannner.webp";

/** แบนเนอร์ carousel บนสุดมือถือ — WelcomeBanner (public/HomeProBanner) */
export const WELCOME_BANNER_MOBILE_ASSETS = [
  "/HomeProBanner/welcome1.avif",
  "/HomeProBanner/welcome2.avif",
] as const;

/**
 * สไลด์ Welcome Hero — WelcomeBanner carousel มือถือ (HomeLobbyPage lg:hidden)
 * ถูกเรียกใช้ผ่าน fetchHomeBanners() → loadLobbyContent() → WelcomeBanner
 */
export const WELCOME_BANNER_SLIDES: WelcomeBannerSlide[] = [
  {
    id: "welcome-mobile-1",
    bannerSrc: WELCOME_BANNER_MOBILE_ASSETS[0],
    title: "แบนเนอร์ต้อนรับ",
    subtitle: "",
  },
  {
    id: "welcome-mobile-2",
    bannerSrc: WELCOME_BANNER_MOBILE_ASSETS[1],
    title: "แบนเนอร์โปรโมชัน",
    subtitle: "",
  },
];

/** รูป PromoCarousel มือถือ (ใต้ประกาศ) — public/HomeProBanner ProBan11–33 */
export const HOME_PROMO_CAROUSEL_BANNER_SRCS = [
  "/HomeProBanner/ProBan11.avif",
  "/HomeProBanner/ProBan22.avif",
  "/HomeProBanner/ProBan33.avif",
] as const;

/**
 * ข้อมูลจำลองสำหรับ Promotional Carousel แบนเนอร์โปรโมชัน
 * ถูกเรียกใช้โดย PromoCarousel.tsx
 */
export const PROMO_CAROUSEL_DATA: PromoItem[] = [
  {
    id: "promo-loyalty-v2",
    title: "Loyalty v2.0",
    subtitle: "Easy start & more rewards",
    href: "/promotions/loyalty-v2",
    bannerSrc: HOME_PROMO_CAROUSEL_BANNER_SRCS[0],
  },
  {
    id: "promo-gift-cards",
    title: "Play with ...",
    subtitle: "Buy Gift Cards",
    href: "/promotions/gift-cards",
    bannerSrc: HOME_PROMO_CAROUSEL_BANNER_SRCS[1],
  },
  {
    id: "promo-vip-cashback",
    title: "VIP Cashback",
    subtitle: "Up to 25% weekly rebate",
    href: "/promotions/cashback",
    bannerSrc: HOME_PROMO_CAROUSEL_BANNER_SRCS[2],
  },
];

/** ขนาดจริง ProBan*.avif — ใช้คำนวณอัตราส่วนใน HomeDesktopPeekCarousel */
export const HOME_DESKTOP_PEEK_BANNER_SIZE = {
  width: 800,
  height: 342,
} as const;

/** แบนเนอร์ peek carousel บน desktop lobby — public/HomeProBanner ProBan*.avif */
export const HOME_DESKTOP_PEEK_BANNER_SRCS = [
  "/HomeProBanner/ProBan00.avif",
  "/HomeProBanner/ProBan11.avif",
  "/HomeProBanner/ProBan22.avif",
  "/HomeProBanner/ProBan33.avif",
] as const;

/**
 * สไลด์ HomeDesktopPeekCarousel — 4 ใบแรกของ PROMO + รูป ProBan
 * ถูกเรียกใช้ใน HomeLobbyPage.tsx (แถบใต้ header desktop)
 */
export const HOME_DESKTOP_PEEK_CAROUSEL_DATA: PromoItem[] =
  HOME_DESKTOP_PEEK_BANNER_SRCS.map((bannerSrc, index) => {
    const promo = PROMO_CAROUSEL_DATA[index];
    if (promo) {
      return { ...promo, bannerSrc };
    }
    return {
      id: `peek-proban-${index}`,
      title: "โปรโมชัน",
      subtitle: "",
      href: "#",
      bannerSrc,
    };
  });

/**
 * ตัวเลขตัวอย่างสำหรับ Cosmic Intro — ไม่ใช่สถิติยืนยัน ต้องแทนด้วยข้อมูลจริงจาก API
 * ถูกเรียกใช้โดย CosmicIntro.tsx
 */
export const INTRO_STATS_DATA: IntroStats = {
  gamesCount: 15000,
  providersCount: 120,
};

/**
 * ข้อมูลจำลองสำหรับส่วน "ยอดนิยม" (Popular Highlights)
 * ประกอบด้วย Swipe Bet และ DEXY RACE
 * ถูกเรียกใช้โดย PopularHighlights.tsx
 */
export const POPULAR_HIGHLIGHTS_DATA: HighlightItem[] = [
  {
    id: "highlight-swipe-bet",
    title: "Swipe Bet",
    type: "swipe_bet",
    href: "/games/swipe-bet",
    imageSrc: "/HomeProBanner/left.webp",
  },
  {
    id: "highlight-dexy-race",
    title: "DEXY RACE",
    type: "event_banner",
    href: "/events/dexy-race",
    imageSrc: "/HomeProBanner/right.webp",
  },
];

/**
 * ข้อมูลจำลองสำหรับหมวดเกม 5 แถว (เกมยอดฮิต / SLOTS / คาสิโน / ยิงปลา / กีฬา)
 * รายชื่อเกมและค่ายถอดจากภาพตัวอย่างเพื่อจัดวางเท่านั้น — หมวดจริงต้องอ้าง taxonomy ของระบบ
 * ถูกเรียกใช้โดย GameSection.tsx ผ่าน app/page.tsx
 */
export const GAME_SECTIONS_DATA: GameSectionData[] = [
  {
    id: "section-hot",
    title: "เกมยอดฮิต",
    titleKey: "sections.hotGames",
    icon: "flame",
    viewAllHref: "/games?filter=hot",
    games: HOT_GAMES_FEATURED_ITEMS,
    carouselMax: HOT_GAMES_FEATURED_ITEMS.length,
  },
  {
    id: "section-slots",
    title: "SLOTS",
    titleKey: "sections.slots",
    icon: "cherries",
    viewAllHref: "/slots",
    games: HOME_SLOTS_PROVIDER_ITEMS,
  },
  {
    id: "section-casino",
    title: "คาสิโน",
    titleKey: "sections.casino",
    icon: "cards",
    viewAllHref: "/casino",
    games: CASINO_FEATURED_ITEMS,
  },
  {
    id: "section-fishing",
    title: "ยิงปลา",
    titleKey: "sections.fishing",
    icon: "fish",
    viewAllHref: "/fishing",
    games: FISHING_FEATURED_ITEMS,
  },
  {
    id: "section-sports",
    title: "กีฬา",
    titleKey: "sections.sports",
    icon: "football",
    viewAllHref: "/sport",
    games: SPORT_FEATURED_ITEMS,
  },
];

/**
 * ข้อมูลจำลองสำหรับส่วน Providers — เฉพาะค่ายที่เห็นในภาพตัวอย่าง ไม่เติมรายการซ้ำ
 * ถูกเรียกใช้โดย ProvidersSection.tsx
 */
export const PROVIDERS_DATA: ProviderItem[] = [
  { id: "provider-pragmatic-play", name: "Pragmatic Play", href: "/providers/pragmatic-play" },
  { id: "provider-hacksaw-gaming", name: "Hacksaw Gaming", href: "/providers/hacksaw-gaming" },
  { id: "provider-nolimit-city", name: "Nolimit City", href: "/providers/nolimit-city" },
];

/**
 * การ์ดฟีเจอร์ — ร้านค้าเพชร / ภารกิจ / วงล้อ
 * ถูกเรียกใช้โดย FeatureActionCards.tsx
 */
export const FEATURE_ACTIONS_DATA: FeatureActionItem[] = [
  {
    id: "feature-diamond-shop",
    title: "ร้านค้าเพชร",
    description: "แลก Gems เป็นของรางวัล โบนัส และสิทธิพิเศษสำหรับสมาชิก",
    href: "/gems-store",
    icon: "diamond-shop",
    ctaPrimaryLabel: "เข้าร้านค้า",
    ctaSecondaryLabel: "ดูรายการแลก",
  },
  {
    id: "feature-missions",
    title: "ภารกิจ",
    description: "เช็คอินรายวันและทำภารกิจสะสมเพื่อปลดล็อกรางวัล",
    href: "/missions/check-in",
    icon: "missions",
    ctaPrimaryLabel: "เช็คอินเลย",
    ctaSecondaryLabel: "กติกากิจกรรม",
    secondaryHref: "/event",
  },
  {
    id: "feature-prize-wheel",
    title: "วงล้อ",
    description: "หมุนลุ้นเครดิตและของรางวัล — ใช้สิทธิ์ตามเงื่อนไขแต่ละรอบ",
    href: "/wheel",
    icon: "prize-wheel",
    ctaPrimaryLabel: "หมุนเลย",
    ctaSecondaryLabel: "วิธีเล่น",
  },
];

/**
 * กิจกรรมทัวร์นาเมนต์บน lobby — รูปจาก public/tournament
 * ถูกเรียกใช้โดย JackpotSection.tsx
 */
export const HOME_LOBBY_TOURNAMENT_ITEMS: HomeLobbyTournamentItem[] = [
  {
    id: "tournament-esport",
    title: "ทัวร์นาเมนต์อีสปอร์ต",
    imageSrc: TOURNAMENT_IMAGE_PATHS.esport,
    href: "/event",
  },
  {
    id: "tournament-sport",
    title: "ทัวร์นาเมนต์กีฬา",
    imageSrc: TOURNAMENT_IMAGE_PATHS.sportWin,
    href: "/event",
  },
  {
    id: "tournament-slot",
    title: "ทัวร์นาเมนต์สล็อต",
    imageSrc: TOURNAMENT_IMAGE_PATHS.slotWin,
    href: "/event",
  },
  {
    id: "tournament-esport-2",
    title: "ทัวร์นาเมนต์อีสปอร์ต",
    imageSrc: TOURNAMENT_IMAGE_PATHS.esport2,
    href: "/event",
  },
];

/**
 * กิจกรรม — section หลัง Hall of Fame · รูปจาก public/tournament
 * ถูกเรียกใช้โดย TournamentsSection.tsx
 */
export const LOBBY_TOURNAMENTS_SECTION_ITEMS: LobbyTournamentSectionItem[] = [
  {
    id: "tournament-endorphina",
    brandLabel: "Endorphina",
    badge: "9,999 ways to win",
    description: "€100,000 Prize Pool · 9,999 Winning Places",
    imageSrc: TOURNAMENT_IMAGE_PATHS.slotWin,
    href: "/event",
  },
  {
    id: "tournament-tennis",
    brandLabel: "Tennis",
    badge: "AUGUST 30 – SEPTEMBER 13",
    description: "Place US Open Bets, GET 5% BACK!",
    imageSrc: TOURNAMENT_IMAGE_PATHS.sportWin,
    href: "/event",
  },
  {
    id: "tournament-dota",
    brandLabel: "Dota 2",
    badge: "The International 2026",
    description: "Follow the Biggest Dota 2 Event of the Year in freebets",
    imageSrc: TOURNAMENT_IMAGE_PATHS.esport,
    href: "/event",
  },
  {
    id: "tournament-cs2",
    brandLabel: "CS2",
    badge: "CS2 Pick'em Challenge",
    description: "Follow Every Match. Make Your Picks.",
    imageSrc: TOURNAMENT_IMAGE_PATHS.esport2,
    href: "/event",
  },
];

export { HALL_OF_FAME_DATA } from "./hallOfFameMockData";

/**
 * เมนูล่าง — ถอน / ฝาก / เมนู (กลาง) / คืนยอด / ติดต่อ
 * ถูกเรียกใช้โดย FloatingBottomNav.tsx
 */
export const BOTTOM_NAV_DATA: BottomNavItem[] = [
  { id: "nav-withdraw", labelKey: "bottomNav.withdraw", href: "/withdraw", icon: "withdraw" },
  { id: "nav-deposit", labelKey: "bottomNav.deposit", href: "/deposit", icon: "deposit" },
  { id: "nav-menu", labelKey: "bottomNav.menu", href: "#menu", icon: "menu" },
  { id: "nav-cashback", labelKey: "bottomNav.cashback", href: "/cashback", icon: "cashback" },
  { id: "nav-contact", labelKey: "bottomNav.contact", href: "/support", icon: "contact" },
];
