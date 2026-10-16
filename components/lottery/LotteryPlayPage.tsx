"use client";

import { SubPageShell } from "@/components/layout/SubPageShell";
import { lotteryPlayMarketMeta } from "@/lib/lottery/resolvePlayRound";
import { useLotteryI18n } from "@/app/components/lottery/useLotteryI18n";
import { LotteryYikiPlayBoard } from "@/app/components/lottery/LotteryYikiPlayBoard";
import { ThaiGovernmentPlayScreen } from "./ThaiGovernmentPlayScreen";

type LotteryPlayPageProps = {
  marketId: string;
  roundId: string;
};

/** Step 3 — หน้าแทง: หวยรัฐบาลใช้กระดาน Thai · ตลาดอื่น/ยี่กี ใช้กระดานยี่กี */
export function LotteryPlayPage({ marketId, roundId }: LotteryPlayPageProps) {
  const { t } = useLotteryI18n();
  const isThai = marketId === "thai-government";
  const meta = lotteryPlayMarketMeta(marketId);
  /** หัวหน้า = ชื่อตลาดอย่างเดียว (เหมือน glass) — งวดอยู่ในการ์ดหัวงวดด้านล่างแล้ว */
  const title = t(meta.titleKey);
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
