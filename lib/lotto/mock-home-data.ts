export type ThaiLottoResults = {
  dateLabel: string;
  prizeFirst: string;
  frontThree: string[];
  backThree: string[];
  backTwo: string;
};

export type LottoCardData = {
  id: string;
  name: string;
  periodLabel: string;
  top3: string;
  bottom2: string;
  flagEmoji: string;
};

export const thaiLottoMock: ThaiLottoResults = {
  dateLabel: "1 ต.ค. 2569",
  prizeFirst: "402701",
  frontThree: ["791", "912"],
  backThree: ["058", "396"],
  backTwo: "70",
};

export const bankLottoMock: LottoCardData[] = [
  {
    id: "laoslotto",
    name: "หวยลาว",
    periodLabel: "วันจันทร์ที่ 5 ตุลาคม 2569",
    top3: "XXX",
    bottom2: "XX",
    flagEmoji: "🇱🇦",
  },
  {
    id: "hanoylotto",
    name: "ฮานอย",
    periodLabel: "วันจันทร์ที่ 5 ตุลาคม 2569",
    top3: "XXX",
    bottom2: "XX",
    flagEmoji: "🇻🇳",
  },
];

export const dashboardLottoMock: LottoCardData[] = [
  {
    id: "gsblotto",
    name: "หวย ออมสิน",
    periodLabel: "วันพฤหัสบดีที่ 1 ตุลาคม 2569",
    top3: "591",
    bottom2: "60",
    flagEmoji: "🏦",
  },
  {
    id: "baaclotto",
    name: "หวย ธกส.",
    periodLabel: "วันพุธที่ 16 กันยายน 2569",
    top3: "762",
    bottom2: "57",
    flagEmoji: "🏦",
  },
  {
    id: "laoslottoextra",
    name: "หวยลาว Extra",
    periodLabel: "วันจันทร์ที่ 5 ตุลาคม 2569",
    top3: "XXX",
    bottom2: "XX",
    flagEmoji: "🇱🇦",
  },
  {
    id: "laoslottotv",
    name: "หวยลาว TV",
    periodLabel: "วันจันทร์ที่ 5 ตุลาคม 2569",
    top3: "XXX",
    bottom2: "XX",
    flagEmoji: "🇱🇦",
  },
  {
    id: "laoslottohd",
    name: "หวยลาว HD",
    periodLabel: "วันจันทร์ที่ 5 ตุลาคม 2569",
    top3: "XXX",
    bottom2: "XX",
    flagEmoji: "🇱🇦",
  },
  {
    id: "hanoylottostar",
    name: "ฮานอย Star",
    periodLabel: "วันจันทร์ที่ 5 ตุลาคม 2569",
    top3: "XXX",
    bottom2: "XX",
    flagEmoji: "🇻🇳",
  },
];

/** @deprecated ใช้ bankLottoMock + dashboardLottoMock */
export const otherLottoMock: LottoCardData[] = [
  ...bankLottoMock,
  ...dashboardLottoMock,
];

export type BottomNavItem = {
  id: string;
  label: string;
  href: string;
  active?: boolean;
  center?: boolean;
};

export const bottomNavItems: BottomNavItem[] = [
  { id: "home", label: "หน้าหลัก", href: "/", active: true },
  { id: "promo", label: "โปรโมชั่น", href: "/promotion" },
  { id: "bet", label: "แทงหวย", href: "/enterlotto", center: true },
  { id: "activity", label: "กิจกรรม", href: "/events" },
  { id: "deposit", label: "ฝาก/ถอน", href: "/deposit" },
];
