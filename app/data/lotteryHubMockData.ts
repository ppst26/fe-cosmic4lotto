import type {
  LotteryFeaturedItem,
  LotteryGridItem,
  LotteryResultRow,
} from "@/app/types/lottery";

/** การ์ด feature — หวยไทย · ยี่กี 15 · ยี่กี 30 นาที */
export const LOTTERY_FEATURED_ITEMS: LotteryFeaturedItem[] = [
  {
    id: "lottery-feature-thai",
    titleKey: "markets.thaiGovernment",
    countdownLabel: { key: "hub.daysLeft", vars: { count: 13 } },
    href: "/lottery/thai-government",
    visual: "thai-gov",
  },
  {
    id: "lottery-feature-yiki-5",
    titleKey: "markets.yiki5",
    countdownLabel: "00:03:24",
    href: "/lottery/yiki-5",
    visual: "yiki",
    yikiMinutes: 5,
  },
  {
    id: "lottery-feature-yiki-15",
    titleKey: "markets.yiki15",
    countdownLabel: "03:29:01",
    href: "/lottery/yiki-15",
    visual: "yiki",
    yikiMinutes: 15,
  },
  {
    id: "lottery-feature-yiki-30",
    titleKey: "markets.yiki30",
    countdownLabel: "12:04:18",
    href: "/lottery/yiki-30",
    visual: "yiki",
    yikiMinutes: 30,
  },
];

/** กริดประเภทหวย — mock ตาม lobby หวย */
export const LOTTERY_GRID_ITEMS: LotteryGridItem[] = [
  { id: "lottery-baac", titleKey: "markets.baac", status: "open", countdownLabel: "03:29:01", flagLabel: "TH", flagTone: "th", href: "/lottery/baac" },
  { id: "lottery-laos", titleKey: "markets.laos", status: "open", countdownLabel: "03:29:01", flagLabel: "LA", flagTone: "la", href: "/lottery/laos" },
  { id: "lottery-hanoi", titleKey: "markets.hanoi", status: "open", countdownLabel: "03:29:01", flagLabel: "VN", flagTone: "vn", href: "/lottery/hanoi" },
  { id: "lottery-malaysia", titleKey: "markets.malaysia", status: "open", countdownLabel: "03:29:01", flagLabel: "MY", flagTone: "my", href: "/lottery/malaysia" },
  { id: "lottery-dow", titleKey: "markets.dowJones", status: "open", countdownLabel: "03:29:01", flagLabel: "US", flagTone: "us", href: "/lottery/dow-jones" },
  { id: "lottery-china", titleKey: "markets.china", status: "open", countdownLabel: "03:29:01", flagLabel: "CN", flagTone: "cn", href: "/lottery/china" },
  { id: "lottery-germany", titleKey: "markets.germany", status: "open", countdownLabel: "03:29:01", flagLabel: "DE", flagTone: "de", href: "/lottery/germany" },
  { id: "lottery-russia", titleKey: "markets.russia", status: "open", countdownLabel: "03:29:01", flagLabel: "RU", flagTone: "ru", href: "/lottery/russia" },
  { id: "lottery-korea", titleKey: "markets.korea", status: "open", countdownLabel: "03:29:01", flagLabel: "KR", flagTone: "kr", href: "/lottery/korea" },
  { id: "lottery-nikkei", titleKey: "markets.nikkei", status: "open", countdownLabel: "03:29:01", flagLabel: "JP", flagTone: "jp", href: "/lottery/nikkei" },
  { id: "lottery-uk", titleKey: "markets.uk", status: "open", countdownLabel: "03:29:01", flagLabel: "GB", flagTone: "gb", href: "/lottery/uk" },
  { id: "lottery-hk", titleKey: "markets.hongKong", status: "open", countdownLabel: "03:29:01", flagLabel: "HK", flagTone: "hk", href: "/lottery/hong-kong" },
  { id: "lottery-tw", titleKey: "markets.taiwan", status: "closed", flagLabel: "TW", flagTone: "tw", href: "/lottery/taiwan" },
  { id: "lottery-sg", titleKey: "markets.singapore", status: "open", countdownLabel: "03:29:01", flagLabel: "SG", flagTone: "sg", href: "/lottery/singapore" },
  { id: "lottery-india", titleKey: "markets.india", status: "open", countdownLabel: "03:29:01", flagLabel: "IN", flagTone: "in", href: "/lottery/india" },
  { id: "lottery-egypt", titleKey: "markets.egypt", status: "open", countdownLabel: "03:29:01", flagLabel: "EG", flagTone: "eg", href: "/lottery/egypt" },
];

/** ผลหวยล่าสุด — mock (drawDate null = วันนี้) */
export const LOTTERY_LATEST_RESULTS: LotteryResultRow[] = [
  { id: "res-my", titleKey: "markets.malaysia", top3: "584", bottom2: "27", drawDate: null, flagLabel: "MY", flagTone: "my" },
  { id: "res-cn", titleKey: "markets.china", top3: "672", bottom2: "08", drawDate: null, flagLabel: "CN", flagTone: "cn" },
  { id: "res-hn", titleKey: "markets.hanoi", top3: "903", bottom2: "62", drawDate: null, flagLabel: "VN", flagTone: "vn" },
  { id: "res-th", titleKey: "markets.thaiGovernment", top3: "842", bottom2: "56", drawDate: "2026-08-01T16:00:00+07:00", flagLabel: "TH", flagTone: "th" },
  { id: "res-jp", titleKey: "markets.nikkei", top3: "514", bottom2: "72", drawDate: "2026-08-01T16:00:00+07:00", flagLabel: "JP", flagTone: "jp" },
  { id: "res-kr", titleKey: "markets.korea", top3: "829", bottom2: "04", drawDate: "2026-08-01T16:00:00+07:00", flagLabel: "KR", flagTone: "kr" },
  { id: "res-us", titleKey: "markets.dowJones", top3: "319", bottom2: "41", drawDate: "2026-07-31T16:00:00+07:00", flagLabel: "US", flagTone: "us" },
  { id: "res-la", titleKey: "markets.laos", top3: "428", bottom2: "15", drawDate: "2026-07-31T16:00:00+07:00", flagLabel: "LA", flagTone: "la" },
];
