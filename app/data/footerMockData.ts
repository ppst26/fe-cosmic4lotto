import type {
  FooterBrandLink,
  FooterNavLink,
  FooterLinkColumn,
  FooterSocialIcon,
  FooterPaymentBank,
} from "@/app/types/footer";
import type { MessageKey } from "@/lib/i18n/messages";

/** ข้อมูล mock ส่วนท้ายเว็บ (CosmicFooter) — ป้ายเก็บเป็น key ของ dictionary nav */

export const FOOTER_PARTNER_NAMES: readonly string[] = [
  "EVOPLAY",
  "CQ9",
  "JILI",
  "PLAYSTAR",
  "JOKER",
  "EBET",
  "PG SOFT",
  "PRAGMATIC PLAY",
];

/** คอลัมน์ลิงก์ footer desktop — href จริงจาก route ในแอป · ที่ไม่มีใช้ /support */
export const FOOTER_DESKTOP_COLUMNS: FooterLinkColumn[] = [
  {
    titleKey: "footer.columns.platform",
    links: [
      { labelKey: "footer.link.profile", href: "/profile" },
      { labelKey: "footer.link.transactions", href: "/transactions" },
      { labelKey: "footer.link.lotterySlips", href: "/lottery/slips" },
      { labelKey: "footer.link.accountSettings", href: "/profile/account" },
      { labelKey: "footer.link.dailyCheckIn", href: "/missions/check-in" },
      { labelKey: "footer.link.gemStore", href: "/gems-store" },
      { labelKey: "footer.link.leaderboard", href: "/support" },
      { labelKey: "footer.link.predictions", href: "/support" },
    ],
  },
  {
    titleKey: "footer.columns.sports",
    links: [
      { labelKey: "footer.link.liveSports", href: "/sport" },
      { labelKey: "footer.link.sports", href: "/sport" },
      { labelKey: "footer.link.esports", href: "/sport" },
      { labelKey: "footer.link.tournaments", href: "/event" },
      { labelKey: "footer.link.football", href: "/sport" },
      { labelKey: "footer.link.basketball", href: "/sport" },
      { labelKey: "footer.link.tennis", href: "/support" },
      { labelKey: "footer.link.cricket", href: "/support" },
    ],
  },
  {
    titleKey: "footer.columns.casino",
    links: [
      { labelKey: "footer.link.lobby", href: "/casino" },
      { labelKey: "footer.link.popularGames", href: "/" },
      { labelKey: "footer.link.liveCasino", href: "/casino" },
      { labelKey: "footer.link.newGames", href: "/slots" },
      { labelKey: "footer.link.crashGames", href: "/support" },
      { labelKey: "footer.link.tableGames", href: "/cards" },
      { labelKey: "footer.link.slots", href: "/slots" },
      { labelKey: "footer.link.bonusBuy", href: "/support" },
      { labelKey: "footer.link.roulette", href: "/casino" },
      { labelKey: "footer.link.providers", href: "/slots" },
    ],
  },
  {
    titleKey: "footer.columns.promotions",
    links: [
      { labelKey: "footer.link.allPromotions", href: "/promotions" },
      { labelKey: "footer.link.sportsWelcome", href: "/promotions" },
      { labelKey: "footer.link.casinoWelcome", href: "/promotions" },
      { labelKey: "footer.link.weeklyCashback", href: "/cashback" },
      { labelKey: "footer.link.sportsClub", href: "/sport" },
      { labelKey: "footer.link.vipClub", href: "/profile" },
      { labelKey: "footer.link.referFriends", href: "/referral" },
    ],
  },
  {
    titleKey: "footer.columns.info",
    links: [
      { labelKey: "footer.link.aboutUs", href: "/support" },
      { labelKey: "footer.link.events", href: "/event" },
      { labelKey: "footer.link.tournaments", href: "/activities" },
      { labelKey: "footer.link.careers", href: "/support" },
      { labelKey: "footer.link.contactUs", href: "/support" },
      { labelKey: "footer.link.brand", href: "/support" },
      { labelKey: "footer.link.responsibleGaming", href: "/support" },
    ],
  },
  {
    titleKey: "footer.columns.services",
    links: [
      { labelKey: "footer.link.helpCenter", href: "/support" },
      { labelKey: "footer.link.guide", href: "/support" },
      { labelKey: "footer.link.luckyWheel", href: "/wheel" },
      { labelKey: "footer.link.lottery", href: "/lottery" },
      { labelKey: "footer.link.fishing", href: "/fishing" },
      { labelKey: "footer.link.lossRebate", href: "/loss-rebate" },
    ],
  },
];

export const FOOTER_DESKTOP_SOCIAL: FooterSocialIcon[] = [
  { label: "Telegram", href: "/support", icon: "telegram" },
  { label: "X", href: "/support", icon: "x" },
  { label: "Discord", href: "/support", icon: "discord" },
  { label: "Instagram", href: "/support", icon: "instagram" },
  { label: "YouTube", href: "/support", icon: "youtube" },
  { label: "LINE", href: "/support", icon: "line" },
];

/** แถวไอคอนโซเชียล footer มือถือ (Dexsport-style) */
export const FOOTER_MOBILE_SOCIAL: FooterSocialIcon[] = [
  { label: "Medium", href: "/support", icon: "medium" },
  { label: "Telegram", href: "/support", icon: "telegram" },
  { label: "X", href: "/support", icon: "x" },
  { label: "Discord", href: "/support", icon: "discord" },
  { label: "LinkedIn", href: "/support", icon: "linkedin" },
  { label: "Reddit", href: "/support", icon: "reddit" },
  { label: "Instagram", href: "/support", icon: "instagram" },
  { label: "YouTube", href: "/support", icon: "youtube" },
  { label: "TikTok", href: "/support", icon: "tiktok" },
];

export const FOOTER_TRUST_BADGES: readonly { labelKey: MessageKey<"nav">; name: string }[] = [
  { labelKey: "footer.auditedBy", name: "CERTIK" },
  { labelKey: "footer.auditedBy", name: "PESSIMISTIC" },
  { labelKey: "footer.approvedBy", name: "ECHELON" },
];

export const FOOTER_EXTERNAL_MOCK_LINKS: FooterBrandLink[] = [
  { label: "CoinMarketCap", href: "/support" },
  { label: "CoinGecko", href: "/support" },
  { label: "DEXTools", href: "/support" },
];

export const FOOTER_DISCLAIMER_KEY: MessageKey<"nav"> = "footer.disclaimer";

export const FOOTER_GAME_LINKS: FooterNavLink[] = [
  { labelKey: "footer.link.casino", href: "/casino" },
  { labelKey: "footer.link.slots", href: "/slots" },
  { labelKey: "footer.link.fishing", href: "/fishing" },
  { labelKey: "footer.link.sports", href: "/sport" },
  { labelKey: "footer.link.lottery", href: "/lottery" },
];

export const FOOTER_INFO_LINKS: FooterNavLink[] = [
  { labelKey: "footer.link.promotions", href: "/promotions" },
  { labelKey: "footer.link.events", href: "/event" },
  { labelKey: "footer.link.vipLevel", href: "/profile" },
  { labelKey: "footer.link.referFriends", href: "/referral" },
];

export const FOOTER_SOCIAL_LINKS: FooterBrandLink[] = [
  { label: "LINE", href: "/support" },
  { label: "Telegram", href: "/support" },
];

export const FOOTER_PAYMENT_BANKS: readonly FooterPaymentBank[] = [
  { id: "bbl", name: "ธนาคารกรุงเทพ", logoSrc: "/assets/bank-logo/BBL.webp" },
  { id: "kbank", name: "ธนาคารกสิกรไทย", logoSrc: "/assets/bank-logo/KBANK.webp" },
  { id: "ktb", name: "ธนาคารกรุงไทย", logoSrc: "/assets/bank-logo/KTB.webp" },
  { id: "ttb", name: "ธนาคารทหารไทยธนชาต", logoSrc: "/assets/bank-logo/TTB.webp" },
  { id: "scb", name: "ธนาคารไทยพาณิชย์", logoSrc: "/assets/bank-logo/SCB.webp" },
  { id: "bay", name: "ธนาคารกรุงศรีอยุธยา", logoSrc: "/assets/bank-logo/BAY.webp" },
  { id: "gsb", name: "ธนาคารออมสิน", logoSrc: "/assets/bank-logo/GSB.webp" },
  { id: "tmn", name: "TrueMoney Wallet", logoSrc: "/assets/bank-logo/TMN.webp" },
  { id: "baac", name: "ธ.ก.ส.", logoSrc: "/assets/bank-logo/BAAC.webp" },
  { id: "ghb", name: "ธนาคารอาคารสงเคราะห์", logoSrc: "/assets/bank-logo/GHB.webp" },
  { id: "kkp", name: "ธนาคารเกียรตินาคินภัทร", logoSrc: "/assets/bank-logo/KKP.webp" },
  { id: "lhfg", name: "ธนาคารแลนด์ แอนด์ เฮ้าส์", logoSrc: "/assets/bank-logo/LHFG.webp" },
  { id: "cimb", name: "ธนาคารซีไอเอ็มบี", logoSrc: "/assets/bank-logo/CIMBT.webp" },
  { id: "uob", name: "ธนาคารยูโอบี", logoSrc: "/assets/bank-logo/UOBT.webp" },
  { id: "tisco", name: "ธนาคารทิสโก้", logoSrc: "/assets/bank-logo/TISCO.webp" },
  { id: "tcd", name: "ธนาคารไทยเครดิต", logoSrc: "/assets/bank-logo/TCD.webp" },
];

export const FOOTER_PAYMENT_LABELS: readonly string[] = ["PromptPay", "TrueMoney", "ธนาคาร"];

export const FOOTER_LEGAL_LINKS: FooterNavLink[] = [
  { labelKey: "footer.link.privacy", href: "/support" },
  { labelKey: "footer.link.terms", href: "/support" },
  { labelKey: "footer.link.feedback", href: "/support" },
  { labelKey: "footer.link.sitemap", href: "/support" },
];

export const FOOTER_COPYRIGHT = "Copyright © CM-SaturnLotto, since 2021";

export const FOOTER_TAGLINE_KEY: MessageKey<"nav"> = "footer.tagline";
