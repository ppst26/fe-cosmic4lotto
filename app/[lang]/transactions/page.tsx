"use client";

import { Suspense } from "react";
import { SubPageShell } from "@/components/layout/SubPageShell";
import { TransactionsPageContent } from "@/app/components/transactions/TransactionsPageContent";
import { useT } from "@/lib/i18n/I18nProvider";

/** หน้ารายการธุรกรรม — /transactions (ป้องกันด้วย proxy) */
export default function TransactionsPage() {
  const t = useT("transactions");
  return (
    <SubPageShell title={t("title")}>
      <Suspense fallback={<p className="py-16 text-center text-sm text-[var(--text-muted)]">{t("pageLoading")}</p>}>
        <TransactionsPageContent />
      </Suspense>
    </SubPageShell>
  );
}
