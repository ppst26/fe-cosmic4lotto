"use client";

import React, { useEffect, useMemo, useState } from "react";
import { matchesPromoHubCategory } from "@/lib/promotions/promotionFilters";
import type {
  PromotionDetailContent,
  PromotionDetailId,
  PromoHubCategoryFilterId,
} from "@/app/types/promotions";
import { PromotionDetailPanel } from "./PromotionDetailPanel";
import { LoadingState } from "@/app/components/ui/StatusState";
import { PromotionsCategoryTabs } from "./PromotionsCategoryTabs";
import { usePromotionsCatalog } from "./PromotionsCatalogProvider";
import { useT } from "@/lib/i18n/I18nProvider";

interface PromoMasterListItem {
  id: string;
  title: string;
  subtitle: string;
  detailId: PromotionDetailId;
}

/** Master–detail โปรโมชั่นบน desktop hub (embedded + lg+) */
export function PromoHubDesktopMasterDetail() {
  const t = useT("promotions");
  const { catalog, fetchDetail, getCachedDetail } = usePromotionsCatalog();
  const [categoryFilter, setCategoryFilter] = useState<PromoHubCategoryFilterId>("all");
  const [pickedItemId, setSelectedItemId] = useState<string | null>(null);
  const [fetchedDetail, setFetchedDetail] = useState<{
    id: PromotionDetailId;
    content: PromotionDetailContent | null;
  } | null>(null);

  const listItems = useMemo(() => {
    const items: PromoMasterListItem[] = [];
    if (!catalog) return items;
    const { hero, featured, activities } = catalog;
    if (matchesPromoHubCategory(hero.categories, categoryFilter)) {
      items.push({
        id: "hero-welcome",
        title: hero.title,
        subtitle: hero.subtitle,
        detailId: hero.detailId,
      });
    }
    for (const row of [...featured, ...activities]) {
      if (!matchesPromoHubCategory(row.categories, categoryFilter)) continue;
      items.push({ id: row.id, title: row.title, subtitle: row.subtitle, detailId: row.detailId });
    }
    return items;
  }, [catalog, categoryFilter]);

  const selectedItem = listItems.find((item) => item.id === pickedItemId) ?? listItems[0] ?? null;
  const selectedItemId = selectedItem?.id ?? null;
  const selectedDetailId = selectedItem?.detailId ?? null;

  useEffect(() => {
    if (!selectedDetailId || getCachedDetail(selectedDetailId)) return;

    let cancelled = false;
    fetchDetail(selectedDetailId)
      .catch(() => null)
      .then((detail) => {
        if (!cancelled) setFetchedDetail({ id: selectedDetailId, content: detail });
      });

    return () => {
      cancelled = true;
    };
  }, [selectedDetailId, fetchDetail, getCachedDetail]);

  const detailContent = selectedDetailId
    ? (getCachedDetail(selectedDetailId) ??
      (fetchedDetail?.id === selectedDetailId ? fetchedDetail.content : null))
    : null;

  if (!catalog) return null;

  return (
    <div className="flex min-h-0 flex-col gap-3">
      <PromotionsCategoryTabs
        activeId={categoryFilter}
        onSelect={setCategoryFilter}
        tabs={catalog.hubCategoryTabs}
      />

      {listItems.length === 0 ? (
        <p className="py-10 text-center text-sm text-[var(--Text-Icon-Body)]">{t("empty.categoryHint")}</p>
      ) : (
        <div className="grid min-h-[min(58dvh,520px)] gap-4 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:items-stretch">
          <nav
            className="scrollbar-none flex min-h-0 flex-col gap-2 overflow-y-auto"
            aria-label={t("hub.promotionsListAria")}
          >
            {listItems.map((item) => {
              const selected = item.id === selectedItemId;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedItemId(item.id)}
                  aria-current={selected ? "true" : undefined}
                  className={`w-full rounded-2xl border bg-[var(--Card-Normal)] p-3 text-left transition-colors hover:border-[var(--Main-Primary)]/40 ${selected ? "border-[var(--Main-Primary)]" : "border-white/10"}`}
                >
                  <span className="block font-semibold leading-snug text-[var(--Text-Icon-Title)]">{item.title}</span>
                  <span className="mt-1 line-clamp-2 text-sm leading-relaxed text-[var(--Text-Icon-Body)]">
                    {item.subtitle}
                  </span>
                </button>
              );
            })}
          </nav>

          <div
            className="scrollbar-none min-h-0 overflow-y-auto"
            aria-live="polite"
            aria-label={t("hub.selectedDetailAria")}
          >
            {detailContent ? (
              <PromotionDetailPanel key={detailContent.id} content={detailContent} variant="hub" />
            ) : (
              <LoadingState label={t("detail.loading")} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
