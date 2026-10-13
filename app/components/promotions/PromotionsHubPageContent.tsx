"use client";

import React, { useMemo, useState } from "react";
import Link from "@/lib/i18n/navigation";
import { matchesPromoHubCategory } from "@/lib/promotions/promotionFilters";
import type {
  PromoHubCategoryFilterId,
  PromoHubFeaturedItem,
  PromoHubHero,
  PromotionDetailId,
} from "@/app/types/promotions";
import { ErrorState, LoadingState } from "@/app/components/ui/StatusState";
import { PromotionsCategoryTabs } from "./PromotionsCategoryTabs";
import { PromotionsMobileFeed } from "./PromotionsMobileFeed";
import { PromoHubDesktopMasterDetail } from "./PromoHubDesktopMasterDetail";
import { PromotionsCatalogProvider, usePromotionsCatalog } from "./PromotionsCatalogProvider";
import { PromoHubPillLabel, promoCardButtonClass } from "./promoHubCardPrimitives";
import { promotionDetailHref } from "./promotionDetailHref";
import { useT } from "@/lib/i18n/I18nProvider";

/** เนื้อหาหน้าโปรโมชั่น (/promotions) — กดโปรเปิดหน้ารายละเอียด /promotions/[id] */
export function PromotionsHubPageContent({ embedded = false }: { embedded?: boolean }) {
  return (
    <PromotionsCatalogProvider>
      <PromotionsHubPageContentInner embedded={embedded} />
    </PromotionsCatalogProvider>
  );
}

function PromotionsHubPageContentInner({ embedded }: { embedded: boolean }) {
  const t = useT("promotions");
  const { catalog, loading, error: loadError, reload } = usePromotionsCatalog();
  const [categoryFilter, setCategoryFilter] = useState<PromoHubCategoryFilterId>("all");

  const hero = catalog?.hero;
  const featured = catalog?.featured;

  const showHero = useMemo(
    () => (hero ? matchesPromoHubCategory(hero.categories, categoryFilter) : false),
    [hero, categoryFilter],
  );
  const featuredItems = useMemo(
    () => (featured ?? []).filter((item) => matchesPromoHubCategory(item.categories, categoryFilter)),
    [featured, categoryFilter],
  );
  const hasAnyPromo = showHero || featuredItems.length > 0;

  return (
    <>
      {loading ? <LoadingState label={t("loading")} /> : null}
      {!loading && loadError && !catalog ? (
        <div className="flex justify-center">
          <ErrorState
            title={t("loadError")}
            description={t("loadErrorDesc")}
            primaryAction={{ label: t("retry"), onClick: reload }}
          />
        </div>
      ) : null}

      {catalog && embedded ? (
        <div className="hidden pb-2 lg:block">
          <PromoHubDesktopMasterDetail />
        </div>
      ) : null}

      {catalog ? (
        <div className="lg:hidden">
          <PromotionsMobileFeed />
        </div>
      ) : null}

      {catalog && !embedded ? (
        <div className="hidden flex-col gap-5 pb-4 lg:flex">
          <PromotionsCategoryTabs
            activeId={categoryFilter}
            onSelect={setCategoryFilter}
            tabs={catalog.hubCategoryTabs}
          />

          {!hasAnyPromo ? (
            <p className="rounded-2xl border border-white/10 bg-[var(--BG-Surface-Normal)] px-4 py-8 text-center text-sm text-[var(--Text-Icon-Body)]">
              {t("empty.categoryHint")}
            </p>
          ) : null}

          {showHero && hero ? <PromoHubHeroBanner hero={hero} /> : null}

          {featuredItems.length > 0 ? (
            <section aria-labelledby="promo-for-you-heading" className="flex flex-col gap-3">
              <h2
                id="promo-for-you-heading"
                className="text-base font-semibold text-[var(--Text-Icon-Title)] sm:text-lg"
              >
                {t("forYou")}
              </h2>
              <ul className="m-0 flex list-none flex-col gap-3 p-0">
                {featuredItems.map((item) => (
                  <li key={item.id}>
                    <FeaturedPromoCard item={item} />
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      ) : null}
    </>
  );
}

function PromoHubHeroBanner({ hero }: { hero: PromoHubHero }) {
  return (
    <Link
      href={promotionDetailHref(hero.detailId)}
      className={`${promoCardButtonClass("min-h-[168px] sm:min-h-[188px]")} no-underline`}
      aria-label={`${hero.title} — ${hero.ctaLabel}`}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 75% 35%, rgba(255,209,92,0.28) 0%, rgba(46,46,50,0.95) 50%, rgba(26,26,29,1) 100%)",
        }}
      />
      <div className="relative z-[1] flex h-full min-h-[168px] items-stretch sm:min-h-[188px]">
        <div className="flex min-w-0 flex-1 flex-col justify-center px-4 py-4 sm:px-5 sm:py-5">
          <h2 className="text-lg font-semibold leading-snug text-[var(--Text-Icon-Title)] sm:text-xl">
            {hero.title}
          </h2>
          <p className="mt-1 text-xs text-[var(--Text-Icon-Body)] sm:text-sm">{hero.subtitle}</p>
          <div className="mt-3">
            <PromoHubPillLabel label={hero.ctaLabel} />
          </div>
        </div>
        <PromoHeroGraphic className="pointer-events-none w-[42%] max-w-[160px] shrink-0 self-end sm:max-w-[190px]" />
      </div>
    </Link>
  );
}

function FeaturedPromoCard({ item }: { item: PromoHubFeaturedItem }) {
  return (
    <Link
      href={promotionDetailHref(item.detailId)}
      className={`${promoCardButtonClass()} no-underline`}
      aria-label={`${item.title} — ${item.ctaLabel}`}
    >
      <div className="relative z-[1] flex items-center gap-2 px-3 py-3.5 sm:gap-3 sm:px-4 sm:py-4">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold leading-snug text-[var(--Text-Icon-Title)] sm:text-base">
            {item.title}
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-[var(--Text-Icon-Body)] sm:text-[13px]">
            {item.subtitle}
          </p>
          <div className="mt-2.5">
            <PromoHubPillLabel label={item.ctaLabel} />
          </div>
        </div>
        <div className="flex shrink-0 items-center justify-end pr-0.5">
          {featuredGraphicForDetail(item.detailId)}
        </div>
      </div>
    </Link>
  );
}

function featuredGraphicForDetail(detailId: PromotionDetailId) {
  const size = "h-[88px] w-[88px] sm:h-[96px] sm:w-[96px]";
  if (detailId === "promo-cashback") return <CashbackCoinGraphic className={size} />;
  if (detailId === "promo-refer-friends") return <ReferralMegaphoneGraphic className={size} />;
  return <VipShieldGraphic className={size} />;
}

function PromoHeroGraphic({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 220" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="promoHeroGlow" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#ffd15c" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#c9a227" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="120" cy="180" rx="70" ry="18" fill="#000" opacity="0.35" />
      <circle cx="130" cy="90" r="55" fill="url(#promoHeroGlow)" />
      <circle cx="105" cy="72" r="28" fill="#fde7b0" />
      <path d="M78 68 Q105 42 132 68 Q128 95 105 98 Q82 95 78 68 Z" fill="#1a1a1d" />
      <path d="M88 58 Q105 48 122 58" stroke="#ffd15c" strokeWidth="4" fill="none" />
      <ellipse cx="96" cy="72" rx="4" ry="5" fill="#3b2a07" />
      <ellipse cx="114" cy="72" rx="4" ry="5" fill="#3b2a07" />
      <path d="M78 95 L132 95 L125 175 L85 175 Z" fill="#2e2e32" />
      <path d="M85 110 L125 110 L118 140 L92 140 Z" fill="#ffd15c" opacity="0.85" />
      <circle cx="145" cy="55" r="8" fill="#ffd15c" opacity="0.9" />
      <circle cx="160" cy="75" r="6" fill="#ffe082" opacity="0.8" />
      <circle cx="155" cy="100" r="5" fill="#ffd15c" opacity="0.75" />
    </svg>
  );
}

function CashbackCoinGraphic({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
      <circle cx="48" cy="48" r="36" fill="none" stroke="#ffd15c" strokeWidth="3" opacity="0.4" strokeDasharray="8 6" />
      <path d="M48 12 A36 36 0 0 1 84 48" fill="none" stroke="#ffe082" strokeWidth="4" strokeLinecap="round" opacity="0.85" />
      <path d="M48 84 A36 36 0 0 1 12 48" fill="none" stroke="#ffe082" strokeWidth="4" strokeLinecap="round" opacity="0.85" />
      <circle cx="48" cy="48" r="22" fill="url(#cashCoinGrad)" stroke="#ffe082" strokeWidth="2" />
      <path d="M48 38 L51 46 59 46 53 51 55 59 48 54 41 59 43 51 37 46 45 46 Z" fill="#6b4a05" />
      <defs>
        <linearGradient id="cashCoinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffe082" />
          <stop offset="100%" stopColor="#c9a227" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function ReferralMegaphoneGraphic({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
      <path d="M18 40 L48 28 L48 68 L18 56 Z" fill="#c9a227" stroke="#ffe082" strokeWidth="1.5" />
      <path d="M48 32 L72 22 L72 74 L48 64 Z" fill="#ffd15c" />
      <rect x="12" y="44" width="8" height="8" rx="2" fill="#ffe082" />
      <circle cx="78" cy="32" r="6" fill="#ffe082" />
      <circle cx="82" cy="52" r="5" fill="#ffd15c" />
      <circle cx="70" cy="62" r="4" fill="#ffe082" opacity="0.85" />
      <circle cx="62" cy="38" r="7" fill="#2e2e32" stroke="#ffe082" strokeWidth="1.5" />
      <circle cx="62" cy="35" r="3" fill="#fde7b0" />
    </svg>
  );
}

function VipShieldGraphic({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 96 96" className={className} aria-hidden="true">
      <path d="M48 14 L76 26 V48 C76 64 48 82 48 82 C48 82 20 64 20 48 V26 Z" fill="url(#vipShield)" stroke="#ffe082" strokeWidth="2" />
      <path d="M42 48 L46 52 L54 42" stroke="#422006" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M44 34 L48 28 L52 34 L48 38 Z" fill="#ffe082" />
      <path d="M10 78 L48 88 L86 78 L48 92 Z" fill="#1a1a1d" opacity="0.6" />
      <defs>
        <linearGradient id="vipShield" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffe082" />
          <stop offset="100%" stopColor="#a67c00" />
        </linearGradient>
      </defs>
    </svg>
  );
}
