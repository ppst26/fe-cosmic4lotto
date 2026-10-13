"use client";

import React from "react";
import { SubPageShell } from "@/components/layout/SubPageShell";
import { FreespinsPageContent } from "@/app/components/reward/FreespinsPageContent";
import { useT } from "@/lib/i18n/I18nProvider";

/** แลกฟรีสปิน/ชิป — /reward/freespins */
export default function FreespinsPage() {
  const t = useT("rewards");
  return (
    <SubPageShell title={t("freespins.title")} backHref="/reward">
      <FreespinsPageContent />
    </SubPageShell>
  );
}
