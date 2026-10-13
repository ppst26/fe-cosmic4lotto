"use client";

import type { VipModalTabId } from "@/app/types/vip";
import { SoftLineTabs } from "../ui/SoftLineTabs";
import { VIP_PAGE_TABS } from "./vipTabConfig";
import { useT } from "@/lib/i18n/I18nProvider";

interface VipTabListProps {
  activeTab: VipModalTabId;
  onSelect: (tab: VipModalTabId) => void;
}

/** แท็บ VIP — ระดับของฉัน / แร็งค์ / สิทธิประโยชน์ */
export function VipTabList({ activeTab, onSelect }: VipTabListProps) {
  const t = useT("vip");
  return (
    <SoftLineTabs
      tabs={VIP_PAGE_TABS.map((tab) => ({ id: tab.id, label: t(tab.labelKey) }))}
      activeId={activeTab}
      onSelect={onSelect}
      ariaLabel={t("tabs.ariaLabel")}
    />
  );
}
