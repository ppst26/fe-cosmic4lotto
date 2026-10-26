"use client";

import React, { useState } from "react";
import type { VipModalTabId, VipPlayerState, VipRankTier } from "@/app/types/vip";
import { usePrefetchVipTabs, useVipPlayer, useVipRanks } from "@/app/hooks/api/member";
import { TabPanelTransition } from "@/app/components/ui/TabPanelTransition";
import { ResourceGate } from "@/app/components/ui/ResourceGate";
import { useUrlTab } from "@/app/hooks/useUrlTab";
import { parseVipPageTab, VIP_PAGE_TAB_QUERY_KEY } from "@/lib/vipRoutes";
import { VipTabPanels } from "./VipTabPanels";
import { VipTabList } from "./VipTabList";
import { VIP_PAGE_TABS } from "./vipTabConfig";
import { useT } from "@/lib/i18n/I18nProvider";
import { getVipRankTier } from "@/app/data/vipMockData";
import { VipRankEmblem } from "./VipRankEmblem";
import s from "./vip-page.module.css";

const HERO_DUST = [
  { "--x": "-52px", "--drift": "-10px", "--s": "3px", "--t": "4.2s", "--d": "0s" },
  { "--x": "-30px", "--drift": "8px", "--s": "2px", "--t": "5.1s", "--d": "0.9s" },
  { "--x": "-12px", "--drift": "-6px", "--s": "2.5px", "--t": "3.8s", "--d": "1.7s" },
  { "--x": "6px", "--drift": "12px", "--s": "2px", "--t": "4.6s", "--d": "0.4s" },
  { "--x": "24px", "--drift": "-14px", "--s": "3px", "--t": "5.4s", "--d": "2.3s" },
  { "--x": "42px", "--drift": "6px", "--s": "2px", "--t": "4s", "--d": "1.2s" },
  { "--x": "58px", "--drift": "-8px", "--s": "2.5px", "--t": "4.9s", "--d": "2.9s" },
  { "--x": "-40px", "--drift": "16px", "--s": "1.5px", "--t": "5.8s", "--d": "3.4s" },
  { "--x": "16px", "--drift": "-18px", "--s": "1.5px", "--t": "4.4s", "--d": "2s" },
  { "--x": "36px", "--drift": "10px", "--s": "2px", "--t": "5s", "--d": "0.2s" },
];


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
  const t = useT("vip");
  const currentTier = getVipRankTier(player.currentRankId);
  const nextTier = player.nextRankId ? getVipRankTier(player.nextRankId) : null;

  return (
    <div className={s.root}>
      <section className={s.hero}>
        <div className={s.heroText}>
          <h2 className={s.heroVip}>VIP</h2>
          <p className={s.heroTag}>{t("hero.tagline")}</p>
          <p className={s.heroSub}>{t("hero.sub")}</p>
        </div>
        <div
          className={s.heroEmblem}
          aria-label={t("level.currentAriaLabel")}
          style={{ "--vip-glow": currentTier.accent } as React.CSSProperties}
        >
          <span className={s.dust} aria-hidden>
            {HERO_DUST.map((p, i) => (
              <i key={i} style={p as React.CSSProperties} />
            ))}
          </span>
          <div className={s.emblemWrap}>
            <VipRankEmblem rankId={player.currentRankId} size="xl" />
          </div>
          <div className={s.pedestal} aria-hidden />
          <div className={s.heroPlate}>
            <p className={s.heroRank} style={{ "--rank-accent": currentTier.accent } as React.CSSProperties}>
              <span className={s.heroRankText}>{currentTier.label}</span>
            </p>
            {nextTier ? (
              <p className={s.heroNext}>
                {t("level.next")} <b>{nextTier.label}</b>
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <VipTabList activeTab={tab} onSelect={onSelectTab} />

      <TabPanelTransition tabKey={tab} order={VIP_PAGE_TABS.map((item) => item.id)} className="min-h-0 pb-1">
        <VipTabPanels
          tab={tab}
          player={player}
          vipRankTiers={vipRankTiers}
          rankFocusIndex={rankFocusIndex}
          onRankFocusChange={setRankFocusIndex}
          onSelectTab={onSelectTab}
        />
      </TabPanelTransition>
    </div>
  );
}
