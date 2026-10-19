"use client";

import { SubPageShell } from "@/components/layout/SubPageShell";
import { DailyCheckInPageContent } from "@/app/components/missions/DailyCheckInPageContent";
import { useT } from "@/lib/i18n/I18nProvider";

/** หน้าเช็คอินรายวัน (/missions/check-in) */
export default function DailyCheckInPage() {
  const t = useT("rewards");
  return (
    <SubPageShell title={t("checkIn.title")}>
      <DailyCheckInPageContent />
    </SubPageShell>
  );
}
