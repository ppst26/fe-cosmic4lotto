"use client";

import { LotteryHubContent } from "@/components/lottery/hub/LotteryHubContent";
import { SubPageShell } from "@/components/layout/SubPageShell";
import type { LotteryHubData } from "@/lib/api/lotteryContent";
import { useT } from "@/lib/i18n/I18nProvider";

export function LotteryHubPage({ hub }: { hub?: LotteryHubData }) {
  const t = useT("lottery");
  return (
    <SubPageShell title={t("hub.title")}>
      <div className="category-bg-page" data-category="lottery">
      <LotteryHubContent
        showTitle={false}
        featured={hub?.featured}
        gridItems={hub?.grid}
        results={hub?.latest}
      />
      </div>
    </SubPageShell>
  );
}
