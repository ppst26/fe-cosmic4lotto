"use client";

import { useMemo, useState } from "react";
import type { ReferralEarningsData } from "@/lib/api/referral";
import { useReferralEarnings } from "@/app/hooks/api/member";
import { ResourceGate } from "@/app/components/ui/ResourceGate";
import { filterReferralEarningHistoryByPeriod } from "@/lib/domain/referral";
import { REFERRAL_EARNING_PAGE_SIZE } from "@/lib/uiConstants";
import { formatReferralCurrency, formatReferralEarningDateTime } from "@/lib/format";
import type { ReferralEarningPeriodId } from "@/app/types/referral";
import { useT } from "@/lib/i18n/I18nProvider";
import { useFormat } from "@/lib/i18n/useFormat";
import { ReferralPager } from "./ReferralPager";

/** แท็บรายได้ — สรุปโบนัส (รับในเครื่องเหมือน glass) + ตัวกรองช่วงเวลา + ประวัติ (10 แถว/หน้า) */
export function ReferralEarningPanel({ totalEarningsThb }: { totalEarningsThb?: number }) {
  const earnings = useReferralEarnings();
  const t = useT("referral");
  return (
    <ResourceGate resource={earnings} loadingLabel={t("status.earningsLoading")} errorTitle={t("status.earningsError")}>
      {(data) => <ReferralEarningContent data={data} totalEarningsThb={totalEarningsThb} />}
    </ResourceGate>
  );
}

function ReferralEarningContent({
  data,
  totalEarningsThb,
}: {
  data: ReferralEarningsData;
  totalEarningsThb?: number;
}) {
  const t = useT("referral");
  const fmt = useFormat();
  const [period, setPeriod] = useState<ReferralEarningPeriodId>("all");
  const [page, setPage] = useState(1);
  const [claimable, setClaimable] = useState(data.summary.bonusClaimableThb);
  const [received, setReceived] = useState(data.summary.bonusReceivedThb);

  const history = useMemo(
    () => filterReferralEarningHistoryByPeriod(data.history, period),
    [data.history, period],
  );
  const periodTotal = useMemo(() => history.reduce((sum, row) => sum + row.amountThb, 0), [history]);

  const total = history.length;
  const pageSize = REFERRAL_EARNING_PAGE_SIZE;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const pageRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return history.slice(start, start + pageSize);
  }, [history, currentPage, pageSize]);
  const rangeStart = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const rangeEnd = Math.min(currentPage * pageSize, total);

  const handleClaim = () => {
    if (claimable <= 0) return;
    setReceived((prev) => prev + claimable);
    setClaimable(0);
  };

  return (
    <div className="space-y-3">
      <section className="soft-panel p-4" aria-label={t("earning.claimableBonus")}>
        <p className="text-sm text-[var(--text-muted)]">{t("earning.claimableBonus")}</p>
        <p className="text-2xl font-semibold tabular-nums text-[var(--brand-strong)]">{formatReferralCurrency(claimable)}</p>
        <button
          type="button"
          disabled={claimable <= 0}
          onClick={handleClaim}
          className="soft-btn-primary mt-3 h-10 w-full text-sm font-semibold disabled:opacity-40"
        >
          {t("earning.claim")}
        </button>
        <p className="mt-2 text-xs text-[var(--text-muted)]">
          {t("earning.receivedTotal", { amount: formatReferralCurrency(received) })}
        </p>
      </section>

      <div className="flex gap-2 overflow-x-auto scrollbar-none" role="group" aria-label={t("periods.ariaLabel")}>
        {data.periods.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => {
              setPeriod(option.id);
              setPage(1);
            }}
            aria-pressed={period === option.id}
            className={`h-10 shrink-0 rounded-lg px-3 text-xs font-semibold ${
              period === option.id ? "bg-[var(--brand)] text-[#2a0607]" : "border border-white/10 bg-[var(--soft-card)] text-[var(--text-on-light)]"
            }`}
          >
            {t(option.labelKey)}
          </button>
        ))}
      </div>

      <section className="soft-panel p-4" aria-label={t("earning.periodSummaryAriaLabel")}>
        <p className="text-sm text-[var(--text-muted)]">{t("earning.networkIncomePeriod")}</p>
        <div className="mt-1 flex flex-wrap items-end justify-between gap-2">
          <p className="text-2xl font-semibold tabular-nums">{formatReferralCurrency(periodTotal)}</p>
          {totalEarningsThb !== undefined ? (
            <p className="text-xs text-[var(--text-muted)]">
              {t("earning.totalAccumulated", { amount: formatReferralCurrency(totalEarningsThb) })}
            </p>
          ) : null}
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-[var(--text-on-light)]">{t("earning.detailsTitle")}</h2>
        {pageRows.length === 0 ? (
          <p className="soft-panel p-6 text-center text-sm text-[var(--text-muted)]">{t("earning.empty")}</p>
        ) : (
          <ul className="space-y-2">
            {pageRows.map((row) => (
              <li key={row.id} className="soft-card flex items-center justify-between gap-3 p-3 text-sm">
                <span className="font-semibold tabular-nums text-[var(--brand-strong)]">
                  {formatReferralCurrency(row.amountThb)}
                </span>
                <span className="text-xs tabular-nums text-[var(--text-muted)]">
                  {formatReferralEarningDateTime(row.occurredAt)}
                </span>
              </li>
            ))}
          </ul>
        )}
        {total > 0 ? (
          <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-[var(--text-muted)]">
              {t("pagination.showing", { start: rangeStart, end: rangeEnd, total: fmt.records(total) })}
            </p>
            <ReferralPager
              page={currentPage}
              totalPages={totalPages}
              onPageChange={setPage}
              aria-label={t("earning.paginationAriaLabel")}
            />
          </div>
        ) : null}
      </section>
    </div>
  );
}
