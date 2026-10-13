import type {
  RewardHubShortcut,
  RewardPromoBanner,
  RandomCardDisplayItem,
  ExchangeMoneyPackage,
  FreespinOffer,
} from "@/app/types/reward";

/** ข้อมูล mock ศูนย์สุ่มของรางวัล — อ้างอิง flow /th/reward ของ Z-Gaming */

export const REWARD_POINTS_BALANCE_MOCK = 3_365;

export const REWARD_FREESPINS_COMING_SOON_LABEL = "Coming soon";

/** แถบไอคอน 3 ช่องบนหน้า reward */
export const REWARD_HUB_SHORTCUTS: RewardHubShortcut[] = [
  { id: "lucky-box", labelKey: "shortcuts.luckyBox", href: "/reward/lucky-box", iconId: "lucky-box" },
  { id: "random-card", labelKey: "shortcuts.randomCard", href: "/reward/random-card", iconId: "random-card" },
  {
    id: "freespins",
    labelKey: "shortcuts.freespins",
    href: "/reward/freespins",
    iconId: "freespins",
    comingSoon: true,
  },
];

export const REWARD_HUB_PROMO_BANNERS: RewardPromoBanner[] = [
  {
    id: "banner-lucky-box",
    title: "Lucky Box",
    subtitleKey: "banners.luckyBoxSubtitle",
    href: "/reward/lucky-box",
    imageSrc: "/assets/3d/card-1-mobile.avif",
    termsLabelKey: "banners.termsLabel",
  },
  {
    id: "banner-random-card",
    title: "Redeem Card",
    subtitleKey: "banners.randomCardSubtitle",
    href: "/reward/random-card",
    imageSrc: "/assets/3d/card-2-mobile.avif",
    termsLabelKey: "banners.termsLabel",
  },
];

/** ป้าย Coming soon — กระดานแลกรางวัล (กล่อง · การ์ด) */
export const REWARD_REDEEM_COMING_SOON_LABEL = "Coming soon";

/** ค่าสุ่มต่อครั้ง — แสดงใน UI Lucky Box (mock) */
export const LUCKY_BOX_DRAW_COST_DISPLAY = 10;

/** ภาพกล่องสมบัติ — public/assets */
export const LUCKY_BOX_HERO_IMAGE_SRC = "/assets/3d/card-1-mobile.avif";

export const RANDOM_CARD_COUNT = 5;

/** ค่าสุ่มต่อครั้ง — แสดงใน UI (mock) */
export const RANDOM_CARD_DRAW_COST_DISPLAY = 10;

export const RANDOM_CARD_COMING_SOON_LABEL = REWARD_REDEEM_COMING_SOON_LABEL;

export const RANDOM_CARD_DISPLAY_ITEMS: RandomCardDisplayItem[] = [
  { id: "rc-1", imageSrc: "/assets/gems/diamond.avif", pointsValue: 2000 },
  { id: "rc-2", imageSrc: "/assets/3d/diamond.avif", pointsValue: 0 },
  { id: "rc-3", imageSrc: "/assets/check-in/diamonds.avif", pointsValue: 10000 },
  { id: "rc-4", imageSrc: "/assets/coins/coins3.webp", pointsValue: 5000 },
  { id: "rc-5", imageSrc: "/assets/gems/diamond.avif", pointsValue: 1000 },
];

export const EXCHANGE_MONEY_PACKAGES: ExchangeMoneyPackage[] = [
  { id: "ex-50", credits: 50, pointsCost: 500 },
  { id: "ex-100", credits: 100, pointsCost: 950 },
  { id: "ex-250", credits: 250, pointsCost: 2_300 },
  { id: "ex-500", credits: 500, pointsCost: 4_500 },
];

export const EXCHANGE_MONEY_RATE_LABEL = "อัตราแลก: 10 พอยท์ = 1 เครดิต (โดยประมาณ)";

export const FREESPIN_OFFERS_MOCK: FreespinOffer[] = [
  {
    id: "fs-1",
    gameName: "Cosmic Rush",
    providerLabel: "PG",
    pointsCost: 600,
    spins: 10,
    thumbSrc: "/assets/3d/menuicon/slot.avif",
  },
  {
    id: "fs-2",
    gameName: "Nebula Spins",
    providerLabel: "JILI",
    pointsCost: 900,
    spins: 15,
    thumbSrc: "/assets/3d/menuicon/slot.avif",
  },
  {
    id: "fs-3",
    gameName: "Star Fortune",
    providerLabel: "PP",
    pointsCost: 1_200,
    spins: 20,
    thumbSrc: "/assets/3d/menuicon/slot.avif",
  },
];

export const REWARD_FEATURE_TERMS =
  "รางวัลและพอยท์เป็น mock สำหรับ UI — เงื่อนไขจริงขึ้นกับระบบหลังบ้านเมื่อเชื่อม API";
