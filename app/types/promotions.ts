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
