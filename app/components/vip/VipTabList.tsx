"use client";

import { Crown, Gift, Trophy } from "lucide-react";
import type { VipModalTabId } from "@/app/types/vip";
import { VIP_PAGE_TABS } from "./vipTabConfig";
import { useT } from "@/lib/i18n/I18nProvider";
import { cn } from "@/lib/utils";
import s from "./vip-page.module.css";

interface VipTabListProps {
  activeTab: VipModalTabId;
  onSelect: (tab: VipModalTabId) => void;
}

const TAB_ICON: Record<VipModalTabId, typeof Crown> = {
  "my-level": Crown,
  rank: Trophy,
  benefits: Gift,
};

/** แท็บ VIP — แคปซูลเดียว: ระดับของฉัน / แร็งค์ / สิทธิประโยชน์ */
export function VipTabList({ activeTab, onSelect }: VipTabListProps) {
  const t = useT("vip");
  const activeIndex = Math.max(0, VIP_PAGE_TABS.findIndex((tab) => tab.id === activeTab));
  return (
    <div role="tablist" aria-label={t("tabs.ariaLabel")} className={s.tabs}>
      <span
        aria-hidden
        className={s.tabThumb}
        style={{ width: `${100 / VIP_PAGE_TABS.length}%`, transform: `translateX(${activeIndex * 100}%)` }}
      />
      {VIP_PAGE_TABS.map((tab) => {
        const Icon = TAB_ICON[tab.id];
        const active = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onSelect(tab.id)}
            className={cn(s.tab, active && s.tabActive)}
          >
            <Icon aria-hidden />
            {t(tab.labelKey)}
          </button>
        );
      })}
    </div>
  );
}
