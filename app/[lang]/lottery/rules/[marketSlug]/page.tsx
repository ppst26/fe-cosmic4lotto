"use client";

import { useParams } from "next/navigation";
import { SubPageShell } from "@/components/layout/SubPageShell";
import { LotteryRulesContent } from "@/app/components/lottery/LotteryRulesContent";
import { useT } from "@/lib/i18n/I18nProvider";

/** หน้ากติกา / อัตราการจ่ายหวย (/lottery/rules/[marketSlug]) — เปิดจากการ์ดหัวงวดในหน้าแทง */
export default function LotteryRulesPage() {
  const t = useT("lottery");
  const params = useParams<{ marketSlug: string }>();
  const marketSlug = decodeURIComponent(params.marketSlug ?? "");

  return (
    <SubPageShell
      title={t("market.rules")}
      backHref={marketSlug ? `/lottery/${marketSlug}` : "/lottery"}
      compactBar
    >
      <LotteryRulesContent marketSlug={marketSlug} />
    </SubPageShell>
  );
}
