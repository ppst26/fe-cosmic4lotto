/** สัญญา API โปรโมชั่น — แหล่งข้อมูล mock อยู่ที่ public/promotions (เชื่อม back office ภายหลัง) */

export type PromotionDetailId =
  | "welcome"
  | "promo-cashback"
  | "promo-refer-friends"
  | "promo-vip"
  | "promo-check-in"
  | "promo-wheel";

export type PromotionDetailBlockIcon =
  | "shield"
  | "gift"
  | "info"
  | "coin"
  | "referral"
  | "calendar"
  | "wheel";

export interface PromotionDetailBlock {
  icon: PromotionDetailBlockIcon;
  title: string;
  description?: string;
  bullets?: string[];
  showDividerBefore?: boolean;
}

export interface PromotionDetailContent {
  id: PromotionDetailId;
  bannerTitle: string;
  bannerSubtitle: string;
  /** รูปแบนเนอร์ mock — public/promotions/mock-pro*.avif */
  bannerSrc?: string;
  bannerArt: PromotionDetailBlockIcon;
  blocks: PromotionDetailBlock[];
  footerNote: string;
}

export type PromoHubCategoryId = "slots" | "casino" | "sport";
export type PromoHubCategoryFilterId = "all" | PromoHubCategoryId;

export type PromoHubMobileCategoryId = "new-member" | "daily" | "privilege";
export type PromoHubMobileCategoryFilterId = "all" | PromoHubMobileCategoryId;

export interface PromoHubHero {
  title: string;
  subtitle: string;
  ctaLabel: string;
  detailId: PromotionDetailId;
  categories: PromoHubCategoryId[];
}

export interface PromoHubFeaturedItem {
  id: string;
  title: string;
  subtitle: string;
  detailId: PromotionDetailId;
  ctaLabel: string;
  categories: PromoHubCategoryId[];
}

export interface PromoHubActivityItem {
  id: string;
  title: string;
  subtitle: string;
  detailId: PromotionDetailId;
  ctaLabel: string;
  categories: PromoHubCategoryId[];
}

export interface PromoHubMobileListItem {
  id: string;
  title: string;
  /** บรรทัดรองในการ์ดรายการ (มือถือ) — ไม่ใส่จะใช้ title */
  subtitle?: string;
  detailId: PromotionDetailId;
  bannerSrc: string;
  expiresLabel: string;
  mobileCategories: PromoHubMobileCategoryId[];
}

export interface PromotionsCategoryTab<T extends string = string> {
  id: T;
  label: string;
}

/** GET /api/promotions */
export interface PromotionsCatalogResponse {
  version: number;
  updatedAt: string;
  banners: Record<string, string>;
  mobileCategoryTabs: PromotionsCategoryTab<PromoHubMobileCategoryFilterId>[];
  hubCategoryTabs: PromotionsCategoryTab<PromoHubCategoryFilterId>[];
  hero: PromoHubHero;
  featured: PromoHubFeaturedItem[];
  activities: PromoHubActivityItem[];
  mobileList: PromoHubMobileListItem[];
}

/** GET /api/promotions/[id] */
export interface PromotionDetailResponse {
  detail: PromotionDetailContent;
}

/** GET /api/promotions/[id]/claim */
export interface PromotionClaimStatusResponse {
  ok: true;
  promotionId: PromotionDetailId;
  claimed: boolean;
  claimedAt: string | null;
}

/** POST /api/promotions/[id]/claim — สำเร็จ */
export interface PromotionClaimSubmitResponse {
  ok: true;
  promotionId: PromotionDetailId;
  claimedAt: string;
  message: string;
}

export type PromotionClaimErrorResponse = {
  ok: false;
  error: string;
  code?: "ALREADY_CLAIMED";
  claimedAt?: string;
};

export type MyPromotionStatus = "active" | "completed" | "expired";

export interface MyPromotionProgressMetric {
  current: number;
  target: number;
}

/** โปรที่สมาชิกรับแล้ว — GET /api/promotions/mine */
export interface MyPromotionItem {
  id: string;
  promotionId: PromotionDetailId;
  title: string;
  status: MyPromotionStatus;
  claimedAt: string;
  expiresAt: string;
  deposit: MyPromotionProgressMetric;
  turnover: MyPromotionProgressMetric;
}

export interface MyPromotionsResponse {
  ok: true;
  updatedAt: string;
  items: MyPromotionItem[];
}
