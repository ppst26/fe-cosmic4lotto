"use client";

import React from "react";
import Image from "next/image";
import { useLuckyBox, useRewardHub } from "@/app/hooks/api/member";
import { ResourceGate } from "@/app/components/ui/ResourceGate";
import { RewardHubShortcutRow } from "./RewardHubShortcutRow";
import { RewardRedeemBoard } from "./RewardRedeemBoard";
import { useT } from "@/lib/i18n/I18nProvider";

/** แลกกล่องสุ่ม — /reward/lucky-box (Coming soon) */
export function LuckyBoxPageContent() {
  const t = useT("rewards");
  const hub = useRewardHub();
  const luckyBox = useLuckyBox();

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 pb-6">
      <ResourceGate resource={hub} loadingLabel={t("hub.pointsLoading")} errorTitle={t("hub.pointsLoadError")}>
        {(hubData) => (
          <ResourceGate resource={luckyBox} loadingLabel={t("luckyBox.loading")} errorTitle={t("luckyBox.loadError")}>
            {({ heroImageSrc, drawCost, comingSoonLabel, terms }) => (
              <>
                <RewardHubShortcutRow shortcuts={hubData.shortcuts} />
                <RewardRedeemBoard
                  heading="Lucky Box"
                  pointsBalance={hubData.pointsBalance}
                  drawCost={drawCost}
                  comingSoonLabel={comingSoonLabel}
                >
                  <Image src={heroImageSrc} alt="" width={280} height={280} priority className="h-52 w-52 object-contain" />
                </RewardRedeemBoard>
                <p className="px-4 text-center text-[11px] text-[var(--text-muted)]">{terms}</p>
              </>
            )}
          </ResourceGate>
        )}
      </ResourceGate>
    </div>
  );
}
