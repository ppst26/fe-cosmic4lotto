"use client";

import { Suspense } from "react";
import { SubPageShell } from "@/components/layout/SubPageShell";
import { VipPageContent } from "@/app/components/vip/VipPageContent";
import { useT } from "@/lib/i18n/I18nProvider";

/** หน้า VIP — /vip (?tab=rank|benefits · ป้องกันด้วย proxy) */
export default function VipPage() {
  const t = useT("vip");
  return (
    <SubPageShell title="VIP">
      <Suspense fallback={<p className="py-16 text-center text-sm text-[var(--text-muted)]">{t("status.loading")}</p>}>
        <VipPageContent />
      </Suspense>
    </SubPageShell>
  );
}
