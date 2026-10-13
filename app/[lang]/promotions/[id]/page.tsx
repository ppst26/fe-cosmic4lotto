"use client";

import { useParams } from "next/navigation";
import { PromotionDetailPageContent } from "@/app/components/promotions/PromotionDetailPageContent";
import { SubPageShell } from "@/components/layout/SubPageShell";
import { useT } from "@/lib/i18n/I18nProvider";

/** หน้ารายละเอียดโปรโมชั่น (/promotions/[id]) */
export default function PromotionDetailPage() {
  const t = useT("promotions");
  const params = useParams<{ id: string }>();

  return (
    <SubPageShell title={t("detail.title")} nav="promo" backHref="/promotions">
      <PromotionDetailPageContent id={decodeURIComponent(params.id)} />
    </SubPageShell>
  );
}
