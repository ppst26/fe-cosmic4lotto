"use client";

import { Suspense } from "react";
import { SubPageShell } from "@/components/layout/SubPageShell";
import { LotterySlipsPageContent } from "@/app/components/lottery/LotterySlipsPageContent";
import { useLotteryI18n } from "@/app/components/lottery/useLotteryI18n";
import { LoadingState } from "@/app/components/ui/StatusState";

/**
 * โพยทั้งหมด (/lottery/slips) — แท็บ "กำลังดำเนินการ" / "ประวัติ" + ตัวกรอง
 * ต้อง login (proxy.ts) · ตัวกรองอยู่ใน query string จึงต้องห่อ Suspense ให้ useSearchParams
 */
export default function LotterySlipsListPage() {
  const { t } = useLotteryI18n();

  return (
    <SubPageShell title={t("slips.title")} backHref="/lottery">
      <Suspense fallback={<LoadingState label={t("slips.loading")} />}>
        <LotterySlipsPageContent />
      </Suspense>
    </SubPageShell>
  );
}
