"use client";

import React from "react";
import Image from "next/image";
import { useRandomCard, useRewardHub } from "@/app/hooks/api/member";
import { ResourceGate } from "@/app/components/ui/ResourceGate";
import { RewardHubShortcutRow } from "./RewardHubShortcutRow";
import { RewardRedeemBoard } from "./RewardRedeemBoard";
import { REWARD_GEM_ICON_SRC } from "./rewardAssets";
import type { RandomCardDisplayItem } from "@/app/types/reward";
import { cn } from "@/lib/utils";
import { formatRewardPoints } from "@/lib/format";
import { useT } from "@/lib/i18n/I18nProvider";

function PrizeTile({ card }: { card: RandomCardDisplayItem }) {
  const empty = card.pointsValue === 0;
  return (
    <article className="flex w-24 flex-col items-center gap-1 sm:w-28">
      <div className="relative aspect-[3/4] w-full">
        <Image
          src={card.imageSrc}
          alt=""
          fill
          sizes="(max-width: 640px) 28vw, 120px"
          className={cn("object-contain object-center", empty && "opacity-35 grayscale")}
        />
      </div>
      <p className="flex items-center gap-1 text-xs font-semibold text-[var(--text-on-light)]">
        <Image src={REWARD_GEM_ICON_SRC} alt="" width={12} height={12} className="h-3 w-3 object-contain" />
        <span className="tabular-nums">{formatRewardPoints(card.pointsValue)}</span>
      </p>
    </article>
  );
}

/** แลกการ์ดสุ่ม — /reward/random-card (Coming soon) */
export function RandomCardPageContent() {
  const t = useT("rewards");
  const hub = useRewardHub();
  const randomCard = useRandomCard();

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 pb-6">
      <ResourceGate resource={hub} loadingLabel={t("hub.pointsLoading")} errorTitle={t("hub.pointsLoadError")}>
        {(hubData) => (
          <ResourceGate resource={randomCard} loadingLabel={t("randomCard.loading")} errorTitle={t("randomCard.loadError")}>
            {({ displayCards, drawCost, comingSoonLabel, terms }) => (
              <>
                <RewardHubShortcutRow shortcuts={hubData.shortcuts} />
                <RewardRedeemBoard
                  heading="Redeem Card"
                  pointsBalance={hubData.pointsBalance}
                  drawCost={drawCost}
                  comingSoonLabel={comingSoonLabel}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex justify-center gap-2">
                      {displayCards.slice(0, 3).map((c) => (
                        <PrizeTile key={c.id} card={c} />
                      ))}
                    </div>
                    <div className="flex justify-center gap-2">
                      {displayCards.slice(3, 5).map((c) => (
                        <PrizeTile key={c.id} card={c} />
                      ))}
                    </div>
                  </div>
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
