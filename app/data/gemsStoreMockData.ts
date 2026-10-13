import type { GemsStorePackage } from "@/app/types/reward";

/** ข้อมูล mock หน้าร้านค้า Gems */

export const GEMS_STORE_EXCHANGE_RATE_LABEL = "อัตราแลก: 20 Gems = 1 เครดิต";

export const GEMS_STORE_BALANCE_MOCK = 12_500;

/** โควตาแลก mock — แสดงในการ์ดยอดเพชรด้านบน */
export const GEMS_STORE_REDEEM_QUOTA_MOCK = {
  dailyUsed: 1,
  dailyLimit: 3,
  weeklyUsed: 2,
  weeklyLimit: 10,
} as const;

export const GEMS_STORE_RESET_NOTICE =
  "รีเซ็ตรายวัน 00:00 · รีเซ็ตรายสัปดาห์ทุกวันจันทร์ 00:00";

/** ไอคอง Gems หัวหน้าร้าน — public/assets/gems */
export const GEMS_STORE_GEM_ASSET = "/assets/gems/diamond.avif";

/** เรียงจากรางวalıน้อยไปมาก — คู่ละ 2 แพ็กใช้ tier เดียวกัน */
export const GEMS_STORE_COIN_ASSETS = {
  tier1: "/assets/coins/coins1.webp",
  tier2: "/assets/coins/coins2.webp",
  tier3: "/assets/coins/coins3.webp",
  tier4: "/assets/coins/coins4.webp",
} as const;

export const GEMS_STORE_PACKAGES: GemsStorePackage[] = [
  { id: "pkg-50", credits: 50, gemsCost: 1_000, coinSrc: GEMS_STORE_COIN_ASSETS.tier1 },
  { id: "pkg-100", credits: 100, gemsCost: 2_000, coinSrc: GEMS_STORE_COIN_ASSETS.tier1 },
  { id: "pkg-250", credits: 250, gemsCost: 5_000, coinSrc: GEMS_STORE_COIN_ASSETS.tier2 },
  { id: "pkg-500", credits: 500, gemsCost: 10_000, coinSrc: GEMS_STORE_COIN_ASSETS.tier2 },
  { id: "pkg-1000", credits: 1_000, gemsCost: 20_000, coinSrc: GEMS_STORE_COIN_ASSETS.tier3 },
];

export const GEMS_STORE_TERMS: string[] = [
  "Gems ที่แลกแล้วไม่สามารถคืนหรือโอนได้",
  "เครดิตที่ได้รับจะเข้ากระเป๋าหลักทันทีหลังกดแลกสำเร็จ",
  "อัตราแลกและแพ็กเกจอาจเปลี่ยนแปลงตามประกาศของเว็บไซต์",
  "ข้อมูลในหน้านี้เป็นตัวอย่างสำหรับการแสดงผล UI",
];

