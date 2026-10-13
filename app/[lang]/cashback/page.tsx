"use client";

import { Suspense } from "react";
import { SubPageShell } from "@/components/layout/SubPageShell";
import { CashbackPageContent } from "@/app/components/cashback/CashbackPageContent";
import { useT } from "@/lib/i18n/I18nProvider";

/** หน้าคืนยอด — /cashback (?tab=loss = คืนยอดเสีย · ป้องกันด้วย proxy) */
export default function CashbackPage() {
  const t = useT("cashback");
  return (
    <SubPageShell title={t("pageTitle")}>
      <Suspense fallback={null}>
        <CashbackPageContent />
      </Suspense>
    </SubPageShell>
  );
}
