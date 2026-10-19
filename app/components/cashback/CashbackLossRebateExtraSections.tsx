"use client";

import React, { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { LossRebateData } from "@/lib/api/cashback";
import { useLossRebate } from "@/app/hooks/api/member";
import { ResourceGate } from "@/app/components/ui/ResourceGate";
import { SoftPagination } from "@/app/components/ui/SoftPagination";
import { toneClass } from "@/app/components/ui/valueTone";
import { LOSS_REBATE_HISTORY_PAGE_SIZE } from "@/lib/uiConstants";
import {
  formatLossRebateCurrency,
  formatLossRebateDateTime,
  formatLossRebatePercent,
} from "@/lib/format";
import type { LossRebateHistoryRow, LossRebateSummaryMock } from "@/app/types/cashback";
import { useT } from "@/lib/i18n/I18nProvider";
import { useFormat } from "@/lib/i18n/useFormat";
import { useLocale } from "@/lib/i18n/navigation";

/** ชื่อเดือนจาก id "YYYY-MM" ตามภาษา — th ใช้ label จาก API ตามเดิม */
function formatMonthOption(id: string, fallback: string, locale: string): string {
  if (locale === "th") return fallback;
  const [year, month] = id.split("-").map(Number);
  if (!year || !month) return fallback;
  return new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(new Date(year, month - 1, 1));
}

type CashbackLossRebateExtraSectionsProps = {
  summary?: LossRebateSummaryMock;
  history?: LossRebateHistoryRow[];
};

/**
 * สูตรคำนวณ + ตารางประวัติ + เงื่อนไขคืนยอดเสีย — ต่อท้าย CashbackPageContent แท็บเสีย
 * โหลดผ่าน useLossRebate · ส่ง summary / history มาแทนค่าจาก API ได้
 */
export function CashbackLossRebateExtraSections({ summary, history }: CashbackLossRebateExtraSectionsProps) {
  const lossRebate = useLossRebate();
  const t = useT("cashback");
  return (
    <ResourceGate
      resource={lossRebate}
      loadingLabel={t("status.lossRebateLoading")}
      errorTitle={t("status.lossRebateError")}
    >
      {(data) => (
        <LossRebateSections
          lossRebate={data}
          summary={summary ?? data.summary}
          history={history ?? data.history}
        />
      )}
    </ResourceGate>
  );
}

const thClass = "h-11 px-3 text-xs font-semibold text-[var(--text-muted)] sm:px-4";

/** เนื้อหาหลังโหลดเสร็จ — เดือนเริ่มต้นมาจาก lossRebate.months */
function LossRebateSections({
  lossRebate,
  summary,
  history,
}: {
  lossRebate: LossRebateData;
  summary: LossRebateSummaryMock;
  history: LossRebateHistoryRow[];
}) {
  const t = useT("cashback");
  const fmt = useFormat();
  const locale = useLocale();
  const [monthId, setMonthId] = useState(lossRebate.months[0]?.id ?? "2026-09");
  const [historyPage, setHistoryPage] = useState(1);
  const [termsOpen, setTermsOpen] = useState(false);

  const filteredHistory = useMemo(() => history.filter((row) => row.monthId === monthId), [history, monthId]);

  const totalHistory = filteredHistory.length;
  const pageSize = LOSS_REBATE_HISTORY_PAGE_SIZE;
  const totalPages = Math.max(1, Math.ceil(totalHistory / pageSize));
  const currentPage = Math.min(Math.max(1, historyPage), totalPages);

  const pageRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredHistory.slice(start, start + pageSize);
  }, [filteredHistory, currentPage, pageSize]);

  const rangeStart = totalHistory === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const rangeEnd = Math.min(currentPage * pageSize, totalHistory);

  const handleMonthChange = (nextMonthId: string) => {
    setMonthId(nextMonthId);
    setHistoryPage(1);
  };

  return (
    <div className="flex flex-col gap-5">
      <LossRebateFormulaSection summary={summary} />

      <section className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-[var(--text-on-light)] sm:text-base">{t("lossRebate.historyTitle")}</h2>
          <select
            aria-label={t("lossRebate.selectMonth")}
            value={monthId}
            onChange={(event) => handleMonthChange(event.target.value)}
            className="h-9 rounded-[var(--radius-soft-sm)] border-0 bg-[var(--soft-card-elevated)] px-3 text-xs font-semibold text-[var(--text-on-light)] outline-none"
          >
            {lossRebate.months.map((option) => (
              <option key={option.id} value={option.id}>
                {formatMonthOption(option.id, option.label, locale)}
              </option>
            ))}
          </select>
        </div>

        <div className="soft-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-white/[0.08] bg-[var(--soft-surface)]">
                  <th className={`${thClass} text-left`}>{t("lossRebate.period")}</th>
                  <th className={`${thClass} text-right`}>{t("lossRebate.netLoss")}</th>
                  <th className={`${thClass} text-right`}>{t("lossRebate.bonusReceived")}</th>
                  <th className={`${thClass} hidden text-right sm:table-cell`}>{t("lossRebate.receivedDate")}</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-10 text-center text-xs text-[var(--text-muted)]">
                      {t("lossRebate.empty")}
                    </td>
                  </tr>
                ) : (
                  pageRows.map((row) => (
                    <tr key={row.id} className="border-b border-white/[0.05] last:border-0">
                      <td className="px-3 py-3 text-xs font-semibold text-[var(--text-on-light)] sm:px-4">
                        {row.periodLabel}
                      </td>
                      <td className="px-3 py-3 text-right text-xs tabular-nums text-[var(--text-muted)] sm:px-4">
                        {formatLossRebateCurrency(row.netLossThb)}
                      </td>
                      <td className={toneClass("reward", "px-3 py-3 text-right text-xs sm:px-4")}>
                        {formatLossRebateCurrency(row.bonusThb)}
                      </td>
                      <td className="hidden px-3 py-3 text-right text-xs tabular-nums text-[var(--text-muted)] sm:table-cell sm:px-4">
                        {formatLossRebateDateTime(row.receivedAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalHistory > 0 && (
            <div className="flex flex-col gap-3 border-t border-white/[0.08] px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-[var(--text-muted)]">
                {t("pagination.showing", { start: rangeStart, end: rangeEnd, total: fmt.records(totalHistory) })}
              </p>
              <SoftPagination
                page={currentPage}
                totalPages={totalPages}
                onPageChange={setHistoryPage}
                aria-label={t("lossRebate.paginationAriaLabel")}
              />
            </div>
          )}
        </div>
      </section>

      <section className="soft-panel overflow-hidden">
        <button
          type="button"
          onClick={() => setTermsOpen((open) => !open)}
          className="flex w-full cursor-pointer items-center gap-2.5 border-0 bg-transparent px-4 py-3.5 text-left transition-colors hover:bg-[var(--brand-soft)]"
          aria-expanded={termsOpen}
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--soft-card-elevated)] text-xs font-semibold text-[var(--text-muted)]">
            i
          </span>
          <span className="flex-1 text-sm font-semibold text-[var(--text-on-light)]">{t("lossRebate.termsTitle")}</span>
          <ChevronDown
            className={`h-4 w-4 text-[var(--text-muted)] transition-transform ${termsOpen ? "rotate-180" : ""}`}
            aria-hidden
          />
        </button>
        {termsOpen && (
          <ul className="space-y-2 border-t border-white/[0.08] px-4 py-3.5 text-xs leading-relaxed text-[var(--text-muted)]">
            {lossRebate.terms.map((line) => (
              <li key={line} className="flex gap-2">
                <span className="text-[var(--brand)]" aria-hidden="true">
                  •
                </span>
                <span>{t(line)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function FormulaCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-1 rounded-[var(--radius-soft-sm)] bg-[var(--soft-card-elevated)] px-2 py-3 text-center">
      <span className="text-[11px] text-[var(--text-muted)] sm:text-xs">{label}</span>
      <span className={toneClass("emphasis", "text-sm sm:text-base")}>{value}</span>
    </div>
  );
}

function FormulaOperator({ symbol }: { symbol: string }) {
  return (
    <span className="shrink-0 text-lg font-semibold text-[var(--text-muted)]" aria-hidden="true">
      {symbol}
    </span>
  );
}

function LossRebateFormulaSection({ summary }: { summary: LossRebateSummaryMock }) {
  const t = useT("cashback");
  return (
    <section className="soft-panel px-4 py-4 sm:px-5">
      <h2 className="text-sm font-semibold text-[var(--text-on-light)]">{t("lossRebate.formula.title")}</h2>
      <div className="mt-4 flex items-center gap-2">
        <FormulaCell
          label={t("lossRebate.formula.eligibleNetLoss")}
          value={formatLossRebateCurrency(summary.eligibleNetLossThb)}
        />
        <FormulaOperator symbol="×" />
        <FormulaCell label={t("lossRebate.formula.rate")} value={formatLossRebatePercent(summary.rebateRatePercent)} />
        <FormulaOperator symbol="=" />
        <FormulaCell label={t("lossRebate.formula.bonus")} value={formatLossRebateCurrency(summary.rebateBonusThb)} />
      </div>
      <p className="mt-3 text-xs text-[var(--text-muted)]">{t("lossRebate.formula.sampleNote")}</p>
    </section>
  );
}
