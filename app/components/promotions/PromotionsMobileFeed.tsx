"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "@/lib/i18n/navigation";
import { matchesPromoHubMobileCategory } from "@/lib/promotions/promotionFilters";
import type { PromoHubMobileListItem, PromoHubMobileCategoryFilterId } from "@/app/types/promotions";
import { PromotionsCategoryTabs } from "./PromotionsCategoryTabs";
import { usePromotionsCatalog } from "./PromotionsCatalogProvider";
import { promotionDetailHref } from "./promotionDetailHref";
import { useT } from "@/lib/i18n/I18nProvider";

/**
 * รายการโปรโมชั่น (ทุกขนาดจอ) — แท็บหมวด + กริดการ์ด: ภาพ thumbnail ด้านบน · ชื่อโปรใต้ภาพ · ปุ่ม «อ่านรายละเอียดโปรโมชั่น»
 * มือถือ 1 คอลัมน์ · ≥640 2 คอลัมน์ · ≥1024 3 คอลัมน์ · กดการ์ด → /promotions/[id]
 */
export function PromotionsMobileFeed() {
  const t = useT("promotions");
  const { catalog } = usePromotionsCatalog();
  const [categoryFilter, setCategoryFilter] = useState<PromoHubMobileCategoryFilterId>("all");

  const mobileList = useMemo(() => catalog?.mobileList ?? [], [catalog]);
  const mobileTabs = catalog?.mobileCategoryTabs ?? [];

  const items = useMemo(
    () =>
      mobileList.filter((item) =>
        matchesPromoHubMobileCategory(item.mobileCategories, categoryFilter),
      ),
    [mobileList, categoryFilter],
  );

  if (!catalog) return null;

  return (
    <div className="flex flex-col gap-3 pb-2">
      <PromotionsCategoryTabs
        activeId={categoryFilter}
        onSelect={setCategoryFilter}
        tabs={mobileTabs}
      />

      {items.length === 0 ? (
        <p className="border border-white/10 bg-[var(--BG-Surface-Normal)] rounded-2xl p-4 text-center text-sm text-[var(--Text-Icon-Body)]">
          {t("empty.category")}
        </p>
      ) : (
        <ul className="m-0 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li key={item.id} className="min-w-0">
              <PromotionsMobileListCard item={item} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function PromotionsMobileListCard({ item }: { item: PromoHubMobileListItem }) {
  const t = useT("promotions");
  return (
    <Link
      href={promotionDetailHref(item.detailId)}
      className="group border border-white/10 bg-[var(--Card-Normal)] flex h-full w-full flex-col overflow-hidden rounded-2xl text-left no-underline transition-[filter] hover:brightness-105"
      aria-label={t("mobile.readTermsAria", { title: item.title })}
    >
      <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden bg-[var(--BG-Surface-Darker)]">
        <Image
          src={item.bannerSrc}
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 420px"
          className="object-cover object-center"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1 px-3 pb-3 pt-2.5">
        <h2 className="m-0 text-sm font-semibold leading-snug text-[var(--Text-Icon-Title)] sm:text-base">{item.title}</h2>
        <span className="text-xs text-[var(--Text-Icon-Body)]">{t("mobile.expires", { date: item.expiresLabel })}</span>
        <span
          className="soft-btn-primary mt-auto flex h-10 items-center justify-center rounded-xl px-3 text-sm font-semibold"
          aria-hidden="true"
        >
          {t("mobile.readTerms")}
        </span>
      </div>
    </Link>
  );
}
