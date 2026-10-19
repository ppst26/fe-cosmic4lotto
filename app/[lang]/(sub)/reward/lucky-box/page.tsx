"use client";

import React from "react";
import { SubPageShell } from "@/components/layout/SubPageShell";
import { LuckyBoxPageContent } from "@/app/components/reward/LuckyBoxPageContent";
import { useT } from "@/lib/i18n/I18nProvider";

/** แลกกล่องสุ่ม — /reward/lucky-box */
export default function LuckyBoxPage() {
  const t = useT("rewards");
  return (
    <SubPageShell title={t("luckyBox.pageTitle")} backHref="/reward">
      <LuckyBoxPageContent />
    </SubPageShell>
  );
}
