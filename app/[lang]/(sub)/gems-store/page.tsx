"use client";

import { SubPageShell } from "@/components/layout/SubPageShell";
import { GemsStorePageContent } from "@/app/components/gems-store/GemsStorePageContent";
import { useT } from "@/lib/i18n/I18nProvider";

/** หน้าร้านค้า Gems (/gems-store) */
export default function GemsStorePage() {
  const t = useT("rewards");
  return (
    <SubPageShell title={t("gemsStore.title")}>
      <GemsStorePageContent />
    </SubPageShell>
  );
}
