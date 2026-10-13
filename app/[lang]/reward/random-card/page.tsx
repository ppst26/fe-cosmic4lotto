"use client";

import React from "react";
import { SubPageShell } from "@/components/layout/SubPageShell";
import { RandomCardPageContent } from "@/app/components/reward/RandomCardPageContent";
import { useT } from "@/lib/i18n/I18nProvider";

/** แลกการ์ดสุ่ม — /reward/random-card */
export default function RandomCardPage() {
  const t = useT("rewards");
  return (
    <SubPageShell title={t("randomCard.pageTitle")} backHref="/reward">
      <RandomCardPageContent />
    </SubPageShell>
  );
}
