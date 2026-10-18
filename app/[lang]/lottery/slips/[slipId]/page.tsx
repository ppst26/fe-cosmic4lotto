"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { SubPageShell } from "@/components/layout/SubPageShell";
import { LotterySlipSummary } from "@/app/components/lottery/LotterySlipSummary";
import { fetchLotterySlip } from "@/lib/lottery/fetchLotterySlip";
import type { LotterySubmittedSlip } from "@/app/types/lotterySlip";
import { EmptyState, LoadingState } from "@/app/components/ui/StatusState";
import { useT } from "@/lib/i18n/I18nProvider";

/** รับเฉพาะ path ภายในเว็บ — กัน open redirect เช่น ?continue=https://evil.com หรือ //evil.com */
function toSafeInternalHref(href: string | null): string | null {
  if (!href || !href.startsWith("/") || href.startsWith("//") || href.startsWith("/\\")) {
    return null;
  }
  return href;
}

/** หน้าสรุปโพยหลังส่งแทง — /lottery/slips/[slipId] */
export default function LotterySlipSummaryPage() {
  const t = useT("lottery");
  const urlParams = useParams();
  const searchParams = useSearchParams();
  const slipId = (urlParams?.slipId as string) || "";
  const continuePlayHref = toSafeInternalHref(searchParams.get("continue"));

  /** ผลโหลดผูกกับ slipId — loading คำนวณตอน render ไม่ต้อง set ใน effect */
  const [fetched, setFetched] = useState<{
    id: string;
    slip: LotterySubmittedSlip | null;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    void fetchLotterySlip(slipId)
      .catch(() => null)
      .then((data) => {
        if (!cancelled) setFetched({ id: slipId, slip: data });
      });
    return () => {
      cancelled = true;
    };
  }, [slipId]);

  const loading = fetched?.id !== slipId;
  const slip = loading ? null : fetched.slip;

  return (
    <SubPageShell title={t("slips.summaryTitle")} backHref="/lottery/slips" compactBar>
      {loading ? (
        <LoadingState label={t("slips.loading")} />
      ) : slip ? (
        <LotterySlipSummary slip={slip} continuePlayHref={continuePlayHref ?? undefined} />
      ) : (
        <EmptyState
          className="mx-auto mt-4"
          title={t("slips.notFoundTitle")}
          description={t("slips.notFoundDescription")}
          primaryAction={{ label: t("slips.viewAll"), href: "/lottery/slips" }}
        />
      )}
    </SubPageShell>
  );
}
