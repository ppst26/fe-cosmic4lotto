"use client";

import React from "react";
import { useRewardHub } from "@/app/hooks/api/member";
import { ResourceGate } from "@/app/components/ui/ResourceGate";
import { RewardHubSummaryCard } from "./RewardHubSummaryCard";
import { RewardHubShortcutRow } from "./RewardHubShortcutRow";
import { RewardPromoBannerCard } from "./RewardPromoBannerCard";
import { useT } from "@/lib/i18n/I18nProvider";

/** หน้าหลักสุ่มของรางวัล — /reward */
export function RewardHubPageContent() {
  const t = useT("rewards");
  const hub = useRewardHub();

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 pb-6">
      <ResourceGate resource={hub} loadingLabel={t("hub.loading")} errorTitle={t("hub.loadError")}>
        {(data) => (
          <>
            <RewardHubSummaryCard pointsBalance={data.pointsBalance} />
            <RewardHubShortcutRow shortcuts={data.shortcuts} />
            <section className="flex flex-col gap-4" aria-label={t("hub.bannersAria")}>
              {data.banners.map((banner) => (
                <RewardPromoBannerCard key={banner.id} banner={banner} termsText={data.terms} />
              ))}
            </section>
            <p className="px-4 text-center text-[11px] text-[var(--text-muted)]">{data.terms}</p>
          </>
        )}
      </ResourceGate>
    </div>
  );
}
