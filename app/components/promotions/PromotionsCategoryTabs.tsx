"use client";

import React from "react";
import type {
  PromoHubCategoryFilterId,
  PromoHubMobileCategoryFilterId,
  PromotionsCategoryTab,
} from "@/app/types/promotions";
import { useT } from "@/lib/i18n/I18nProvider";
import type { MessageKey } from "@/lib/i18n/messages";
import { HubTabs } from "./HubTabs";

/** ป้ายแท็บหมวดตาม id — id ที่ไม่รู้จักใช้ label จาก catalog */
const CATEGORY_LABEL_KEYS: Record<
  PromoHubCategoryFilterId | PromoHubMobileCategoryFilterId,
  MessageKey<"promotions">
> = {
  all: "categories.all",
  slots: "categories.slots",
  casino: "categories.casino",
  sport: "categories.sport",
  "new-member": "categories.newMember",
  daily: "categories.daily",
  privilege: "categories.privilege",
};

type PromotionsCategoryTabsProps<T extends string> = {
  activeId: T;
  onSelect: (id: T) => void;
  tabs: PromotionsCategoryTab<T>[];
  className?: string;
};

/** แถบฟิลเตอร์หมวดโปรโมชั่น (ใช้ทั้งหมวด hub และหมวดมือถือ) */
export function PromotionsCategoryTabs<T extends string>({
  activeId,
  onSelect,
  tabs,
  className,
}: PromotionsCategoryTabsProps<T>) {
  const t = useT("promotions");
  const label = (tab: PromotionsCategoryTab) => {
    const key = (CATEGORY_LABEL_KEYS as Record<string, MessageKey<"promotions"> | undefined>)[tab.id];
    return key ? t(key) : tab.label;
  };

  return (
    <HubTabs
      className={className}
      tabs={tabs.map((tab) => ({ id: tab.id, label: label(tab) }))}
      activeId={activeId}
      onSelect={onSelect}
      ariaLabel={t("filterAria")}
    />
  );
}
