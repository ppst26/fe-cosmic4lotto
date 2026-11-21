"use client";

import { useMemo } from "react";
import { PROVIDER_INFO_MAP, getGamesByProvider } from "@/app/data/providerGamesData";
import { GamingFilterSidebar } from "./GamingFilterSidebar";
import { GAMING_CATEGORIES, getGamingProviders, type GamingCategoryId } from "./gaming-category";
import { LobbyProviderGamesView } from "@/app/components/lobby/LobbyProviderGamesView";

/**
 * เกมในค่าย — /slots|fishing|sport|cards/[provider]
 * อยู่ใน (tabs)/layout เดียวกับหน้าแรก/หมวดเกม (header · แบนเนอร์ · เมนูหมวด · bottom nav คงที่) → ไม่เหมือนเปลี่ยนไปหน้าใหม่
 * เปลี่ยนเฉพาะเนื้อหา: แถวหัว (กลับ · ชื่อค่าย · ค้นหา) + กริดเกม
 */
export function LobbyProviderDrilldown({ categoryId, slug }: { categoryId: GamingCategoryId; slug: string }) {
  const meta = GAMING_CATEGORIES[categoryId];
  const providers = useMemo(() => getGamingProviders(categoryId), [categoryId]);
  const providerName = PROVIDER_INFO_MAP[slug]?.name ?? slug.replace(/-/g, " ").toUpperCase();
  const gameCount = useMemo(() => getGamesByProvider(slug).length, [slug]);

  return (
    <>
      <div className="gaming-category-hero" data-category={categoryId}>
        <h2 className="gaming-category-hero__title">
          <span className="gaming-category-hero__th">{meta.th}</span>
          <span className="gaming-category-hero__en">{meta.en}</span>
        </h2>
      </div>

      <div className="gaming-games-layout w-full px-0 py-0 lg:px-4 lg:py-5">
        <GamingFilterSidebar meta={meta} providers={providers} resultCount={gameCount} resultUnit="เกม" />
        <div className="flex min-w-0 flex-1 flex-col">
          <LobbyProviderGamesView key={`${categoryId}-${slug}`} providerId={slug} providerName={providerName} categoryLabel={meta.th} backHref={meta.basePath} />
        </div>
      </div>
    </>
  );
}
