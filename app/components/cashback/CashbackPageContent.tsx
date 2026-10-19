"use client";

import React, { useMemo, useState } from "react";
import type { CashbackPanelsData } from "@/lib/api/cashback";
import { useCashbackPanels, usePrefetchCashbackTabs } from "@/app/hooks/api/member";
import { useUrlTab } from "@/app/hooks/useUrlTab";
import { ResourceGate } from "@/app/components/ui/ResourceGate";
import { TabPanelTransition } from "@/app/components/ui/TabPanelTransition";
import { SoftLineTabs } from "@/app/components/ui/SoftLineTabs";
import { CashbackLossRebateExtraSections } from "./CashbackLossRebateExtraSections";
import {
  CashbackClaimRow,
  CashbackHighlightCard,
  CashbackInsightPeriodTabs,
  CashbackPanelHeader,
  CashbackPanelShell,
  CashbackRulesTableSection,
  type CashbackInsightPeriodId,
} from "./CashbackPageLayout";
import { formatCashbackCurrency, formatCashbackPercent } from "@/lib/format";
import type { CashbackPanelMock, CashbackTabId } from "@/app/types/cashback";
import { useWallet } from "@/app/hooks/api/account";
import { useT } from "@/lib/i18n/I18nProvider";

/** อ่านแท็บจาก ?tab= (loss = คืนยอดเสีย · อื่น ๆ = คืนยอดเล่น) */
function parseCashbackTab(value: string | null): CashbackTabId {
  return value === "loss" ? "loss" : "play";
}

interface CashbackPageContentProps {
  /** ใน hub modal — แท็บเป็น state ในเครื่อง ไม่เขียน URL และซ่อนกรอบซ้ำกับ chrome modal */
  embedded?: boolean;
  /** แท็บเริ่มต้นของโหมด embedded */
  initialTab?: CashbackTabId;
}

/**
 * เนื้อหาหน้าคืนยอด — แท็บเล่น / เสีย (?tab=loss)
 * ใช้ใน app/[lang]/cashback/page.tsx และ hub modal
 */
export function CashbackPageContent({ embedded = false, initialTab = "play" }: CashbackPageContentProps) {
  const cashbackPanels = useCashbackPanels();
  usePrefetchCashbackTabs();
  const t = useT("cashback");

  const [urlTab, selectUrlTab] = useUrlTab<CashbackTabId>("tab", parseCashbackTab, "play");
  const [localTab, setLocalTab] = useState<CashbackTabId>(initialTab);
  const tab = embedded ? localTab : urlTab;
  const setTab = embedded ? setLocalTab : selectUrlTab;

  return (
    <ResourceGate
      resource={cashbackPanels}
      loadingLabel={t("status.panelsLoading")}
      errorTitle={t("status.panelsError")}
    >
      {(data) => <CashbackPanelsView cashbackPanels={data} tab={tab} onSelectTab={setTab} embedded={embedded} />}
    </ResourceGate>
  );
}

/** เนื้อหาหลังโหลดเสร็จ — panel เริ่มต้นมาจาก API แล้วอัปเดตในเครื่องหลังกดรับ */
function CashbackPanelsView({
  cashbackPanels,
  tab,
  onSelectTab,
  embedded,
}: {
  cashbackPanels: CashbackPanelsData;
  tab: CashbackTabId;
  onSelectTab: (tab: CashbackTabId) => void;
  embedded: boolean;
}) {
  const wallet = useWallet();
  const t = useT("cashback");
  const [insightPeriod, setInsightPeriod] = useState<CashbackInsightPeriodId>("all");
  const [refreshing, setRefreshing] = useState(false);
  const [playPanel, setPlayPanel] = useState(cashbackPanels.play);
  const [lossPanel, setLossPanel] = useState(cashbackPanels.loss);

  const panel = tab === "play" ? playPanel : lossPanel;

  const ruleRows = useMemo(
    () => [
      { id: "rate", label: t("rules.rate"), value: formatCashbackPercent(panel.ratePercent) },
      { id: "min", label: t("rules.min"), value: formatCashbackCurrency(panel.minThb) },
      { id: "max", label: t("rules.maxPerClaim"), value: formatCashbackCurrency(panel.maxPerClaimThb) },
      { id: "cycle", label: t("rules.cycle"), value: t(panel.cycleLabelKey) },
    ],
    [panel, t],
  );

  const handleClaim = () => {
    if (!panel.canClaim || panel.claimableThb <= 0) return;
    const reset = (prev: CashbackPanelMock) => ({
      ...prev,
      claimableThb: 0,
      canClaim: false,
      statusHintKey: "panel.claimed" as const,
      claimButtonLabelKey: "panel.claimed" as const,
    });
    if (tab === "play") setPlayPanel(reset);
    else setLossPanel(reset);
    // TODO(api): POST claim cashback แล้วใช้ panels จาก response · ยอดที่รับเข้ากระเป๋าหลัก
    wallet.refresh();
  };

  const handleRefresh = () => {
    setRefreshing(true);
    wallet.refresh();
    window.setTimeout(() => setRefreshing(false), 400);
  };

  return (
    <div className="flex flex-col gap-5 pb-6">
      <SoftLineTabs
        tabs={cashbackPanels.tabs.map((item) => ({ id: item.id, label: t(item.labelKey) }))}
        activeId={tab}
        onSelect={onSelectTab}
        ariaLabel={t("tabs.ariaLabel")}
      />

      <TabPanelTransition tabKey={tab} order={["play", "loss"]} className="flex flex-col gap-5">
        <CashbackPanelShell embedded={embedded}>
          <CashbackPanelHeader title={t(panel.titleKey)} subtitle={t(panel.subtitleKey)} />

          <CashbackClaimRow
            amountLabel={t("panel.claimableAmount")}
            amount={formatCashbackCurrency(panel.claimableThb)}
            statusHint={t(panel.statusHintKey)}
            claimLabel={t(panel.claimButtonLabelKey)}
            canClaim={panel.canClaim && panel.claimableThb > 0}
            onClaim={handleClaim}
            onRefresh={handleRefresh}
            refreshing={refreshing}
          />

          <CashbackInsightPeriodTabs activeId={insightPeriod} onSelect={setInsightPeriod} />

          <CashbackHighlightCard
            primaryLabel={t("panel.accumulatedThisCycle")}
            primaryValue={formatCashbackCurrency(panel.claimableThb)}
            secondaryValue={formatCashbackPercent(panel.ratePercent)}
            secondaryHint={t("rules.rate")}
          />

          <CashbackRulesTableSection title={t("rules.title")} rows={ruleRows} />
        </CashbackPanelShell>

        {tab === "loss" ? <CashbackLossRebateExtraSections /> : null}
      </TabPanelTransition>
    </div>
  );
}
