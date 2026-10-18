"use client";

import { SubPageShell } from "@/components/layout/SubPageShell";
import { getLotteryCatalogEntry } from "@/app/data/lotteryCatalogMockData";
import { useT } from "@/lib/i18n/I18nProvider";
import { LotteryMarketRoundsView } from "./LotteryMarketRoundsView";

type LotteryMarketRoundsPageProps = {
  marketSlug: string;
};

export function LotteryMarketRoundsPage({ marketSlug }: LotteryMarketRoundsPageProps) {
  const t = useT("lottery");
  const entry = getLotteryCatalogEntry(marketSlug);
  const title = entry ? t(entry.titleKey) : t("markets.generic");

  return (
    <SubPageShell title={title} backHref="/lottery" fit>
      <LotteryMarketRoundsView marketSlug={marketSlug} />
    </SubPageShell>
  );
}
