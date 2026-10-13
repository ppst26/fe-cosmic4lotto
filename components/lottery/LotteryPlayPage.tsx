"use client";

import { SubPageShell } from "@/components/layout/SubPageShell";
import { getThaiLottoDrawByRoundId } from "@/app/data/lotteryRoundsMockData";
import { lotteryPlayMarketMeta, resolveLotteryPlayRound } from "@/lib/lottery/resolvePlayRound";
import { useLotteryI18n } from "@/app/components/lottery/useLotteryI18n";
import { LotteryYikiPlayBoard } from "@/app/components/lottery/LotteryYikiPlayBoard";
import { ThaiGovernmentPlayScreen } from "./ThaiGovernmentPlayScreen";

type LotteryPlayPageProps = {
  marketId: string;
  roundId: string;
};

/** Step 3 — หน้าแทง: หวยรัฐบาลใช้กระดาน Thai · ตลาดอื่น/ยี่กี ใช้กระดานยี่กี */
export function LotteryPlayPage({ marketId, roundId }: LotteryPlayPageProps) {
  const { t, roundLabel } = useLotteryI18n();
  const isThai = marketId === "thai-government";
  const meta = lotteryPlayMarketMeta(marketId);
  const drawLabel = isThai
    ? getThaiLottoDrawByRoundId(roundId)?.drawLabel
    : resolveLotteryPlayRound(marketId, roundId)?.label;
  const name = t(meta.titleKey);
  const title = drawLabel ? `${name} · ${roundLabel(drawLabel)}` : name;
  const backHref = `/lottery/${marketId}`;

  return (
    <SubPageShell title={title} backHref={backHref}>
      <div className="lottery-hub-theme">
        {isThai ? (
          <ThaiGovernmentPlayScreen roundId={roundId} />
        ) : (
          <LotteryYikiPlayBoard marketSlug={marketId} roundId={roundId} backHref={backHref} />
        )}
      </div>
    </SubPageShell>
  );
}
