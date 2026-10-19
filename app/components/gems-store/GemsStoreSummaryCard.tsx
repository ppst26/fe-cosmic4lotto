"use client";

import Image from "next/image";
import type { GemsStoreData } from "@/lib/api/gemsStore";
import { useT } from "@/lib/i18n/I18nProvider";
import { formatGemsBalance } from "@/lib/format";

interface GemsStoreSummaryCardProps {
  gemsBalance: number;
  /** ข้อมูลร้านค้าที่โหลดแล้ว (โควตา · ข้อความรีเซ็ต · อัตราแลก) */
  store: Pick<GemsStoreData, "quota" | "resetNotice" | "rateLabel">;
}

/** การ์ดยอดเพชรด้านบนร้านค้า — เพชรกลางบน · ยอด · label · โควตา */
export function GemsStoreSummaryCard({ gemsBalance, store }: GemsStoreSummaryCardProps) {
  const t = useT("rewards");
  const { quota, resetNotice, rateLabel } = store;
  const { dailyUsed, dailyLimit, weeklyUsed, weeklyLimit } = quota;

  return (
    <aside className="soft-panel flex flex-col items-center gap-1.5 p-4 text-center" aria-label={t("gemsStore.summary.balanceLabel")}>
      <div className="relative h-16 w-16 shrink-0" aria-hidden="true">
        <Image src="/assets/gems/diamond.avif" alt="" fill sizes="64px" className="object-contain" />
      </div>
      <p
        className="text-3xl font-semibold leading-none tabular-nums text-[var(--brand-strong)]"
        aria-label={t("gemsStore.summary.balanceAria", { amount: formatGemsBalance(gemsBalance) })}
      >
        {formatGemsBalance(gemsBalance)}
      </p>
      <p className="text-sm font-semibold text-[var(--text-on-light)]">{t("gemsStore.summary.balanceLabel")}</p>
      <div className="mt-1 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-xs text-[var(--text-on-light)]">
        <p>
          {t("gemsStore.summary.today")}{" "}
          <span className="font-semibold tabular-nums">
            {dailyUsed}/{dailyLimit}
          </span>
        </p>
        <p>
          {t("gemsStore.summary.thisWeek")}{" "}
          <span className="font-semibold tabular-nums">
            {weeklyUsed}/{weeklyLimit}
          </span>
        </p>
      </div>
      <p className="text-[11px] leading-snug text-[var(--text-muted)]">
        {resetNotice}
        <span className="mx-0.5 opacity-40" aria-hidden="true">
          ·
        </span>
        {rateLabel}
      </p>
    </aside>
  );
}
