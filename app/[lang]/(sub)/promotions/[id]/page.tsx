"use client";

import { useParams } from "next/navigation";
import { PromotionDetailPageContent } from "@/app/components/promotions/PromotionDetailPageContent";
import { SubPageShell } from "@/components/layout/SubPageShell";
import { usePromotionDetail } from "@/app/hooks/api/promotions";
import type { PromotionDetailId } from "@/app/types/promotions";
import { useT } from "@/lib/i18n/I18nProvider";

/** หน้ารายละเอียดโปรโมชั่น (/promotions/[id]) */
export default function PromotionDetailPage() {
  const t = useT("promotions");
  const params = useParams<{ id: string }>();
  const id = decodeURIComponent(params.id);
  const detail = usePromotionDetail(id as PromotionDetailId);

  return (
    <SubPageShell
      title={t("detail.title")}
      hideTitle
      nav="promo"
      backHref="/promotions"
      parentLabel={t("title")}
      breadcrumbLabel={detail.data?.bannerTitle ?? t("detail.title")}
    >
      <PromotionDetailPageContent id={id} />
    </SubPageShell>
  );
}
