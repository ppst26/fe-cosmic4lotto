"use client";

import React from "react";
import { REWARD_FREESPINS_COMING_SOON_LABEL } from "@/app/data/rewardFeaturesMockData";
import { useRewardHub } from "@/app/hooks/api/member";
import { ResourceGate } from "@/app/components/ui/ResourceGate";
import { RewardHubShortcutRow } from "./RewardHubShortcutRow";
import { RewardPointsBar } from "./RewardPointsBar";
import { useT } from "@/lib/i18n/I18nProvider";

/** แลกฟรีสปิน / ชิป — ปิดชั่วคราว (Coming soon) */
export function FreespinsPageContent() {
  const t = useT("rewards");
  const hub = useRewardHub();

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 pb-6">
      <ResourceGate resource={hub} loadingLabel={t("hub.pointsLoading")} errorTitle={t("hub.pointsLoadError")}>
        {(data) => (
          <>
            <RewardPointsBar pointsBalance={data.pointsBalance} />
            <RewardHubShortcutRow shortcuts={data.shortcuts} />
          </>
        )}
      </ResourceGate>

      <div className="soft-panel flex flex-col items-center gap-2 px-4 py-10 text-center" role="status">
        <p className="text-sm font-medium text-[var(--text-on-light)]">{t("freespins.title")}</p>
        <p className="text-xs uppercase tracking-wide text-[var(--brand-strong)]">
          {REWARD_FREESPINS_COMING_SOON_LABEL}
        </p>
        <p className="mt-1 max-w-[16rem] text-[11px] leading-relaxed text-[var(--text-muted)]">
          {t("freespins.comingSoonDesc")}
        </p>
      </div>
    </div>
  );
}
