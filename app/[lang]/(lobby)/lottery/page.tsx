"use client";

import { LotteryHubContent } from "@/components/lottery/hub/LotteryHubContent";
import { SubPageShell } from "@/components/layout/SubPageShell";
import { useT } from "@/lib/i18n/I18nProvider";

export default function LotteryPage() {
  const t = useT("lottery");
  return (
    <SubPageShell title={t("hub.title")}>
      <LotteryHubContent showTitle={false} />
    </SubPageShell>
  );
}
