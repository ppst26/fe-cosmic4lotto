"use client";

import { SubPageShell } from "@/components/layout/SubPageShell";
import { useLotteryCatalog } from "@/app/hooks/api/lottery";
import { useT } from "@/lib/i18n/I18nProvider";
import { LotteryMarketRoundsView } from "./LotteryMarketRoundsView";

type LotteryMarketRoundsPageProps = {
  marketSlug: string;
};

export function LotteryMarketRoundsPage({ marketSlug }: LotteryMarketRoundsPageProps) {
  const t = useT("lottery");
  const entry = useLotteryCatalog().data?.find((item) => item.slug === marketSlug);
  const title = entry ? t(entry.titleKey) : t("markets.generic");

  return (
    <SubPageShell title={title} backHref="/lottery" fit>
      <LotteryMarketRoundsView marketSlug={marketSlug} />
    </SubPageShell>
  );
}
