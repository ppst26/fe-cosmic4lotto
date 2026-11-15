"use client";

import { SubPageShell } from "@/components/layout/SubPageShell";
import { LotteryResultsPage } from "@/app/components/lottery/LotteryResultsPage";
import { useLotteryI18n } from "@/app/components/lottery/useLotteryI18n";

/**
 * ผลรางวัล (/lottery/results) — ผลหวยทุกตลาดของแต่ละวัน · ลิงก์มาจาก「หน้าผลหวย >>」ในหน้า hub
 */
export default function LotteryResultsRoutePage() {
  const { t } = useLotteryI18n();

  return (
    <SubPageShell title={t("resultsPage.title")} backHref="/lottery" compactBar>
      <LotteryResultsPage />
    </SubPageShell>
  );
}
