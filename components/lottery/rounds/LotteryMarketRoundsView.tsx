"use client";

import { useLotteryCatalog, useLotteryPlayRounds, usePrefetchLotteryRounds, useThaiLottoBoard } from "@/app/hooks/api/lottery";
import { EmptyState } from "@/app/components/ui/StatusState";
import { ResourceGate } from "@/app/components/ui/ResourceGate";
import { useT } from "@/lib/i18n/I18nProvider";
import { LotteryMarketShell } from "./LotteryMarketShell";
import { LotteryPlayRoundList } from "./LotteryPlayRoundList";
import { ThaiLottoResultPanel } from "./ThaiLottoResultPanel";

type LotteryMarketRoundsViewProps = {
  marketSlug: string;
};

export function LotteryMarketRoundsView({ marketSlug }: LotteryMarketRoundsViewProps) {
  const t = useT("lottery");
  const catalog = useLotteryCatalog();
  const entry = catalog.data?.find((item) => item.slug === marketSlug);
  /** รอบอิงเวลาจริง — ดึงฝั่ง client ไม่มี SSR snapshot คนละเวลา */
  const roundsResource = useLotteryPlayRounds(marketSlug);
  const rounds = roundsResource.data ?? [];
  const thaiLastResult = useThaiLottoBoard().data?.lastResult ?? null;
  usePrefetchLotteryRounds();

  /** แคตตาล็อกยังไม่มา / โหลดไม่สำเร็จ — ให้ ResourceGate แสดงโหลด/ลองใหม่ (ไม่ขึ้น "ไม่พบตลาด" ผิดพลาด) */
  if (catalog.data === null) {
    return <ResourceGate resource={catalog}>{() => null}</ResourceGate>;
  }

  if (!entry) {
    return (
      <EmptyState
        className="mt-4"
        title={t("market.notFoundTitle")}
        description={t("market.notFoundDescription")}
        primaryAction={{ label: t("market.viewAll"), href: "/lottery" }}
      />
    );
  }

  const openCount = rounds.filter((round) => round.status === "open").length;

  return (
    <div className="lottery-hub-theme space-y-3 max-lg:flex max-lg:min-h-0 max-lg:flex-1 max-lg:flex-col max-lg:space-y-0">
      <LotteryMarketShell activeEntry={entry} roundCount={openCount}>
        <ResourceGate
          resource={roundsResource}
          loadingLabel={t("rounds.loading")}
          errorTitle={t("rounds.loadError")}
        >
          {(list) => (
            <LotteryPlayRoundList rounds={list} marketSlug={marketSlug} basePath={entry.roundsHref} />
          )}
        </ResourceGate>
        {marketSlug === "thai-government" && thaiLastResult ? (
          <div className="lottery-market-rounds__result mt-4 hidden min-w-0 lg:block">
            <ThaiLottoResultPanel result={thaiLastResult} />
          </div>
        ) : null}
      </LotteryMarketShell>
    </div>
  );
}
