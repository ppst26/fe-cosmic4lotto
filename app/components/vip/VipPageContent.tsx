"use client";

import React, { useState } from "react";
import type { VipModalTabId, VipPlayerState, VipRankTier } from "@/app/types/vip";
import { usePrefetchVipTabs, useVipPlayer, useVipRanks } from "@/app/hooks/api/member";
import { ResourceGate } from "@/app/components/ui/ResourceGate";
import { useUrlTab } from "@/app/hooks/useUrlTab";
import { parseVipPageTab, VIP_PAGE_TAB_QUERY_KEY } from "@/lib/vipRoutes";
import { VipTabPanels } from "./VipTabPanels";
import { VipTabList } from "./VipTabList";
import { useT } from "@/lib/i18n/I18nProvider";

interface VipPageContentProps {
  /** ใน hub modal — สลับแท็บเป็น state ในเครื่อง ไม่เขียน URL */
  embedded?: boolean;
  /** แท็บเริ่มต้นของโหมด embedded */
  initialTab?: VipModalTabId;
}

/**
 * เนื้อหาหน้า VIP — โหลดข้อมูลผู้เล่น + ตารางระดับ แล้วส่งต่อให้ VipPageContentInner
 */
export function VipPageContent({ embedded = false, initialTab = "my-level" }: VipPageContentProps) {
  const player = useVipPlayer();
  const ranks = useVipRanks();
  usePrefetchVipTabs();
  const t = useT("vip");

  /** สลับแท็บทันที (state) แล้วสะท้อนลง ?tab= ผ่าน history.replaceState — embedded ใช้ state ในเครื่อง */
  const [urlTab, selectUrlTab] = useUrlTab<VipModalTabId>(VIP_PAGE_TAB_QUERY_KEY, parseVipPageTab, "my-level");
  const [localTab, setLocalTab] = useState<VipModalTabId>(initialTab);
  const tab = embedded ? localTab : urlTab;
  const selectTab = embedded ? setLocalTab : selectUrlTab;

  return (
    <ResourceGate resource={player} loadingLabel={t("status.playerLoading")} errorTitle={t("status.playerError")}>
      {(playerData) => (
        <ResourceGate resource={ranks} loadingLabel={t("status.ranksLoading")} errorTitle={t("status.ranksError")}>
          {(ranksData) => (
            <VipPageContentInner tab={tab} onSelectTab={selectTab} player={playerData} vipRankTiers={ranksData.tiers} />
          )}
        </ResourceGate>
      )}
    </ResourceGate>
  );
}

/** แท็บ · เนื้อหา — mount หลังมีข้อมูลแล้ว (useState ตั้งแรงค์เริ่มจาก player ได้ตรง) */
function VipPageContentInner({
  tab,
  onSelectTab,
  player,
  vipRankTiers,
}: {
  tab: VipModalTabId;
  onSelectTab: (tab: VipModalTabId) => void;
  player: VipPlayerState;
  vipRankTiers: VipRankTier[];
}) {
  const currentRankIndex = vipRankTiers.findIndex((tier) => tier.id === player.currentRankId);
  const [rankFocusIndex, setRankFocusIndex] = useState(currentRankIndex >= 0 ? currentRankIndex : 0);

  return (
    <div className="flex min-h-0 flex-col gap-4">
      <VipTabList activeTab={tab} onSelect={onSelectTab} />

      <div key={tab} className="min-h-0 animate-fade-in pb-1">
        <VipTabPanels
          tab={tab}
          player={player}
          vipRankTiers={vipRankTiers}
          rankFocusIndex={rankFocusIndex}
          onRankFocusChange={setRankFocusIndex}
        />
      </div>
    </div>
  );
}
