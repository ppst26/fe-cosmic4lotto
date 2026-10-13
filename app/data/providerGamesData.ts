/**
 * Mock Data และ Helper สำหรับหน้ารายการเกมของค่าย (/slots/[provider])
 * โดยเฉพาะค่าย PRAGMATIC PLAY 20 เกมตามภาพตัวอย่างของผู้ใช้
 */

import type { ProviderGameItem, ProviderInfo } from "@/app/types/providers";

/**
 * ข้อมูลค่ายเกมสำหรับหน้ารายการเกม
 */
export const PROVIDER_INFO_MAP: Record<string, ProviderInfo> = {
  pragmatic: {
    id: "pragmatic",
    name: "PRAGMATIC PLAY",
    slogan: "PLAY BEYOND LIMITS",
    totalGames: 350,
  },
  jili: {
    id: "jili",
    name: "JILI",
    slogan: "PLAY FOR A BRIGHTER TOMORROW",
    totalGames: 120,
  },
  ygr: {
    id: "ygr",
    name: "YGR",
    slogan: "WEALTH & FORTUNE",
    totalGames: 85,
  },
  "king-midas": {
    id: "king-midas",
    name: "KING MIDAS",
    slogan: "GOLDEN TOUCH SLOTS",
    totalGames: 60,
  },
  spadegaming: {
    id: "spadegaming",
    name: "SPADEGAMING",
    slogan: "INNOVATIVE GAMING",
    totalGames: 140,
  },
  joker: {
    id: "joker",
    name: "JOKER",
    slogan: "LUCKY SMILES",
    totalGames: 180,
  },
  "fa-chai": {
    id: "fa-chai",
    name: "FA CHAI",
    slogan: "ORIENTAL RICHES",
    totalGames: 95,
  },
  "royal-slot-gaming": {
    id: "royal-slot-gaming",
    name: "ROYAL SLOT GAMING",
    slogan: "ROYAL ENTERTAINMENT",
    totalGames: 70,
  },
  "relax-gaming": {
    id: "relax-gaming",
    name: "RELAX GAMING",
    slogan: "REFRESHING SLOTS",
    totalGames: 110,
  },
  "ka-gaming": {
    id: "ka-gaming",
    name: "KA GAMING",
    slogan: "KICK-ASS GAMES",
    totalGames: 220,
  },
  "pg-soft": {
    id: "pg-soft",
    name: "PG SOFT",
    slogan: "DIFFERENCE MAKES A DIFFERENCE",
    totalGames: 150,
  },
};

/**
 * 20 เกมยอดนิยมของ PRAGMATIC PLAY ตามภาพตัวอย่างของผู้ใช้
 */
export const PRAGMATIC_GAMES: ProviderGameItem[] = [
  {
    id: "gates-of-olympus",
    title: "Gates of Olympus",
    providerId: "pragmatic",
    artType: "zeus",
    bgGradient: "from-[#1e1438] via-[#2d1b54] to-[#120a24]",
    accentColor: "#fbbf24",
    isFavorite: true,
  },
  {
    id: "sweet-bonanza",
    title: "Sweet Bonanza",
    providerId: "pragmatic",
    artType: "candy",
    bgGradient: "from-[#3b1228] via-[#5c1c42] to-[#250818]",
    accentColor: "#f43f5e",
    isFavorite: false,
  },
  {
    id: "the-dog-house",
    title: "The Dog House",
    providerId: "pragmatic",
    artType: "dog",
    bgGradient: "from-[#1f170c] via-[#3d2712] to-[#140e06]",
    accentColor: "#f59e0b",
    isFavorite: false,
  },
  {
    id: "big-bass-bonanza",
    title: "Big Bass Bonanza",
    providerId: "pragmatic",
    artType: "bass",
    bgGradient: "from-[#08202d] via-[#0c384f] to-[#04121a]",
    accentColor: "#06b6d4",
    isFavorite: false,
  },
  {
    id: "sugar-rush",
    title: "Sugar Rush",
    providerId: "pragmatic",
    artType: "gumball",
    bgGradient: "from-[#35103a] via-[#581861] to-[#200824]",
    accentColor: "#d946ef",
    isFavorite: false,
  },
  {
    id: "starlight-princess",
    title: "Starlight Princess",
    providerId: "pragmatic",
    artType: "princess",
    bgGradient: "from-[#111f3d] via-[#1b3469] to-[#0a1226]",
    accentColor: "#38bdf8",
    isFavorite: false,
  },
  {
    id: "wild-west-gold",
    title: "Wild West Gold",
    providerId: "pragmatic",
    artType: "cowboy",
    bgGradient: "from-[#28170c] via-[#472710] to-[#170c05]",
    accentColor: "#ea580c",
    isFavorite: false,
  },
  {
    id: "fruit-party",
    title: "Fruit Party",
    providerId: "pragmatic",
    artType: "fruit",
    bgGradient: "from-[#152e18] via-[#1f4723] to-[#0c1c0e]",
    accentColor: "#22c55e",
    isFavorite: false,
  },
  {
    id: "sweet-bonanza-1000",
    title: "Sweet Bonanza 1000",
    providerId: "pragmatic",
    artType: "candy-1000",
    bgGradient: "from-[#3d0f28] via-[#61123d] to-[#240616]",
    accentColor: "#ec4899",
    badge: "1000",
    isFavorite: true,
  },
  {
    id: "gates-of-olympus-1000",
    title: "Gates of Olympus 1000",
    providerId: "pragmatic",
    artType: "zeus-1000",
    bgGradient: "from-[#22103b] via-[#3b156b] to-[#130724]",
    accentColor: "#eab308",
    badge: "1000",
    isFavorite: false,
  },
  {
    id: "the-dog-house-megaways",
    title: "The Dog House Megaways",
    providerId: "pragmatic",
    artType: "dog-megaways",
    bgGradient: "from-[#26180a] via-[#4a2e10] to-[#170e04]",
    accentColor: "#d97706",
    badge: "MEGAWAYS",
    isFavorite: false,
  },
  {
    id: "big-bass-splash",
    title: "Big Bass Splash",
    providerId: "pragmatic",
    artType: "bass-splash",
    bgGradient: "from-[#08222b] via-[#0b3d4f] to-[#04151c]",
    accentColor: "#14b8a6",
    isFavorite: false,
  },
  {
    id: "sugar-rush-1000",
    title: "Sugar Rush 1000",
    providerId: "pragmatic",
    artType: "gumball-1000",
    bgGradient: "from-[#380e3b] via-[#5c1363] to-[#210624]",
    accentColor: "#c026d3",
    badge: "1000",
    isFavorite: false,
  },
  {
    id: "wisdom-of-athena",
    title: "Wisdom of Athena",
    providerId: "pragmatic",
    artType: "athena",
    bgGradient: "from-[#2d140e] via-[#4d1f14] to-[#1c0a06]",
    accentColor: "#f97316",
    isFavorite: false,
  },
  {
    id: "power-of-thor-megaways",
    title: "Power of Thor Megaways",
    providerId: "pragmatic",
    artType: "thor",
    bgGradient: "from-[#0d1f3b] via-[#123161] to-[#071326]",
    accentColor: "#3b82f6",
    badge: "MEGAWAYS",
    isFavorite: false,
  },
  {
    id: "aztec-gems",
    title: "Aztec Gems",
    providerId: "pragmatic",
    artType: "aztec",
    bgGradient: "from-[#1e260c] via-[#354512] to-[#121906]",
    accentColor: "#84cc16",
    isFavorite: false,
  },
  {
    id: "madame-destiny",
    title: "Madame Destiny",
    providerId: "pragmatic",
    artType: "madame",
    bgGradient: "from-[#220e36] via-[#3b1461] to-[#130621]",
    accentColor: "#a855f7",
    isFavorite: false,
  },
  {
    id: "5-lions-megaways",
    title: "5 Lions Megaways",
    providerId: "pragmatic",
    artType: "lion",
    bgGradient: "from-[#2e1708] via-[#52250a] to-[#1c0c03]",
    accentColor: "#f59e0b",
    badge: "MEGAWAYS",
    isFavorite: false,
  },
  {
    id: "floating-dragon",
    title: "Floating Dragon",
    providerId: "pragmatic",
    artType: "dragon",
    bgGradient: "from-[#0b2130] via-[#0e3b57] to-[#061521]",
    accentColor: "#0284c7",
    isFavorite: false,
  },
  {
    id: "the-hand-of-midas",
    title: "The Hand of Midas",
    providerId: "pragmatic",
    artType: "midas",
    bgGradient: "from-[#2b1f09] via-[#4a340b] to-[#1a1203]",
    accentColor: "#eab308",
    isFavorite: false,
  },
];

/**
 * ดึงข้อมูลเกมสำหรับค่ายที่ระบุ
 * หากเป็น pragmatic จะคืนค่า 20 เกมตามภาพ
 * หากเป็นค่ายอื่น จะสร้าง Mock เกมคุณภาพสูงตามธีมของค่ายนั้น
 */
export function getGamesByProvider(providerId: string): ProviderGameItem[] {
  if (providerId === "pragmatic") {
    return PRAGMATIC_GAMES;
  }

  // Generic Mock Games สำหรับค่ายอื่น ๆ
  const genericTitles = [
    "Fortune Riches",
    "Dragon Gold",
    "Lucky Panda",
    "Mega Phoenix",
    "Mystic Treasures",
    "Wild Safari",
    "Temple of Gold",
    "Ocean Pearl",
    "Gemstone Rush",
    "Golden Empire",
    "Super Ace",
    "Boxing King",
    "Roma X",
    "Ali Baba",
    "Crazy Hunter",
    "Money Coming",
  ];

  return genericTitles.map((title, idx) => {
    const artTypes = ["zeus", "candy", "dog", "bass", "gumball", "princess", "cowboy", "fruit"];
    const artType = artTypes[idx % artTypes.length];

    return {
      id: `${providerId}-game-${idx + 1}`,
      title,
      providerId,
      artType,
      bgGradient: "from-[#19183b] via-[#121127] to-[#090b18]",
      accentColor: "#a78bfa",
      isFavorite: idx === 0 || idx === 3,
    };
  });
}
