"use client";

import { useCallback, useEffect, useState } from "react";
import { SubPageShell } from "@/components/layout/SubPageShell";
import { lotteryPlayMarketMeta } from "@/lib/lottery/resolvePlayRound";
import { useLotteryI18n } from "@/app/components/lottery/useLotteryI18n";
import { LotteryYikiPlayBoard } from "@/app/components/lottery/LotteryYikiPlayBoard";
import { ThaiGovernmentPlayScreen } from "./ThaiGovernmentPlayScreen";

type LotteryPlayPageProps = {
  marketId: string;
  roundId: string;
};

/**
 * Step 3 — หน้าแทง: หวยรัฐบาลใช้กระดาน Thai · ตลาดอื่น/ยี่กี ใช้กระดานยี่กี
 * bottom nav บนมือถือแสดงตอนเลือกเลข · ซ่อนเมื่อเข้าขั้นใส่ราคา (เหมือน LotteryPlayPageShell ของ glass)
 */
export function LotteryPlayPage({ marketId, roundId }: LotteryPlayPageProps) {
  const { t } = useLotteryI18n();
  const isThai = marketId === "thai-government";
  const meta = lotteryPlayMarketMeta(marketId);
  /** หัวหน้า = ชื่อตลาดอย่างเดียว (เหมือน glass) — งวดอยู่ในการ์ดหัวงวดด้านล่างแล้ว */
  const title = t(meta.titleKey);
  const backHref = `/lottery/${marketId}`;

  const [hideBottomNav, setHideBottomNav] = useState(false);
  const onStepChange = useCallback((step: "pick" | "price") => {
    setHideBottomNav(step === "price");
  }, []);

  /** ล็อกเมื่อยังอยู่ขั้นเลือกเลข — ปลดเมื่อเข้าขั้นราคาหรือออกจากหน้า */
  useEffect(() => {
    if (hideBottomNav) return;
    const root = document.documentElement;
    root.classList.add("is-viewport-locked");
    return () => root.classList.remove("is-viewport-locked");
  }, [hideBottomNav]);

  return (
    <SubPageShell title={title} backHref={backHref} fit hideBottomNav={hideBottomNav}>
      <div className="lottery-hub-theme lottery-page-main max-lg:flex max-lg:min-h-0 max-lg:flex-1 max-lg:flex-col">
        {isThai ? (
          <ThaiGovernmentPlayScreen roundId={roundId} onStepChange={onStepChange} />
        ) : (
          <LotteryYikiPlayBoard
            marketSlug={marketId}
            roundId={roundId}
            backHref={backHref}
            onStepChange={onStepChange}
          />
        )}
      </div>
    </SubPageShell>
  );
}
