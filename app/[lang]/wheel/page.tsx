"use client";

import { SubPageShell } from "@/components/layout/SubPageShell";
import { LuckyWheelPageContent } from "@/app/components/wheel/LuckyWheelPageContent";
import { useT } from "@/lib/i18n/I18nProvider";

/** หน้าวงล้อพารวย — /wheel */
export default function WheelPage() {
  const t = useT("rewards");
  return (
    <SubPageShell title={t("wheel.title")}>
      <LuckyWheelPageContent />
    </SubPageShell>
  );
}
