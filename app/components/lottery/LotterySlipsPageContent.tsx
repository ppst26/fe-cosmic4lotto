"use client";

import { useMemo, useState } from "react";
import type {
  LotterySlipListQuery,
  LotterySlipResult,
  LotterySlipScope,
  LotterySubmittedSlip,
} from "@/app/types/lotterySlip";
import {
  useLotterySlipFirstPage,
  usePrefetchLotterySlipTab,
  type LotterySlipFilterKey,
} from "@/app/hooks/api/lotterySlips";
import { useUrlParams } from "@/app/hooks/useUrlParams";
import { fetchLotterySlipPage } from "@/lib/lottery/fetchLotterySlip";
import { lotteryPlayMarketMeta } from "@/lib/lottery/resolvePlayRound";
import { SLIP_HISTORY_DAYS, slipHistoryCutoff } from "@/lib/lottery/slipFilters";
import {
  SLIP_RANGE_IDS,
  formatDateOnly,
  parseDateOnly,
  resolveSlipRange,
  slipRangeToken,
  type SlipRangeId,
} from "@/lib/lottery/slipRange";
import { ResourceGate } from "@/app/components/ui/ResourceGate";
import { SoftLineTabs } from "@/app/components/ui/SoftLineTabs";
import { EmptyState } from "@/app/components/ui/StatusState";
import { LotterySlipCard, formatSignedBaht, signedMoneyToneClass } from "./LotterySlipCard";
import { formatBaht } from "./lotteryUtils";
import { useLotteryI18n } from "./useLotteryI18n";

const DEFAULTS = { tab: "pending", market: "", result: "", range: "30d", from: "", to: "" } as const;
type ParamKey = keyof typeof DEFAULTS;

const RESULTS: readonly LotterySlipResult[] = ["won", "lost", "void"];
const PAGE_SIZE = 20;
/** ค่าของตัวเลือก "ทั้งหมด" ใน dropdown — ใน URL/state ยังเป็น "" */
const ALL = "all";

const SELECT_CLASS =
  "h-10 w-full rounded-[var(--radius-soft-sm)] border border-white/[0.08] soft-card-bg px-3 text-sm text-[var(--text-on-light)] outline-none focus:border-[var(--brand)]";

/** ค่าจาก URL ที่ไม่รู้จัก → default (กัน ?market=… ที่แต่งมา) */
function sanitize(key: ParamKey, raw: string): string {
  switch (key) {
    case "tab":
      return raw === "history" ? "history" : "pending";
    case "market":
      return /^[a-z0-9-]{1,40}$/.test(raw) ? raw : "";
    case "result":
      return (RESULTS as readonly string[]).includes(raw) ? raw : "";
    case "range":
      return (SLIP_RANGE_IDS as readonly string[]).includes(raw) ? raw : DEFAULTS.range;
    case "from":
    case "to":
      return parseDateOnly(raw) ? raw : "";
  }
}

function mergeById(...lists: LotterySubmittedSlip[][]): LotterySubmittedSlip[] {
  const seen = new Set<string>();
  const out: LotterySubmittedSlip[] = [];
  for (const list of lists) {
    for (const slip of list) {
      if (!seen.has(slip.id)) {
        seen.add(slip.id);
        out.push(slip);
      }
    }
  }
  return out;
}

/**
 * เนื้อหาหน้ารายการโพย (/lottery/slips) — แท็บ "กำลังดำเนินการ" / "ประวัติ" + ตัวกรอง + สรุป + โหลดเพิ่ม
 * ตัวกรอง/แท็บอยู่ใน URL (?tab=history&market=…&result=…&range=7d) · แท็บอีกฝั่งโหลดรอไว้ (สลับแล้วขึ้นทันที)
 */
export function LotterySlipsPageContent() {
  const { t } = useLotteryI18n();
  const [params, setParams] = useUrlParams<ParamKey>(DEFAULTS, sanitize);
  const [now] = useState(() => new Date());

  const scope: LotterySlipScope = params.tab === "history" ? "history" : "pending";
  const range = params.range as SlipRangeId;
  const result = scope === "history" ? params.result : "";

  const filter: LotterySlipFilterKey = {
    scope,
    market: params.market,
    result,
    range: scope === "history" ? slipRangeToken(range, params.from, params.to) : "",
  };

  const buildQuery = (): LotterySlipListQuery =>
    scope === "pending"
      ? { scope, market: params.market || undefined }
      : {
          scope,
          market: params.market || undefined,
          result: (result as LotterySlipResult) || undefined,
          ...resolveSlipRange(range, params.from, params.to, new Date()),
        };

  const first = useLotterySlipFirstPage(filter, buildQuery);

  const otherScope: LotterySlipScope = scope === "pending" ? "history" : "pending";
  usePrefetchLotterySlipTab(
    { scope: otherScope, market: "", result: "", range: otherScope === "history" ? "30d" : "" },
    () => ({ scope: otherScope }),
  );

  /* ── หน้าถัดไป (โหลดเพิ่ม) — ผูกกับ filter ปัจจุบัน เปลี่ยนตัวกรองแล้วทิ้งของเก่า ── */
  const filterId = JSON.stringify(filter);
  const [extra, setExtra] = useState<{ id: string; slips: LotterySubmittedSlip[]; cursor: string | null } | null>(
    null,
  );
  const [loadingMore, setLoadingMore] = useState(false);
  const [moreError, setMoreError] = useState(false);
  const activeExtra = extra && extra.id === filterId ? extra : null;
  const cursor = activeExtra ? activeExtra.cursor : (first.data?.nextCursor ?? null);
  const slips = mergeById(first.data?.slips ?? [], activeExtra?.slips ?? []);

  const loadMore = async () => {
    if (!cursor || loadingMore) return;
    setLoadingMore(true);
    setMoreError(false);
    const res = await fetchLotterySlipPage({ ...buildQuery(), cursor, limit: PAGE_SIZE });
    setLoadingMore(false);
    if (!res.ok) {
      setMoreError(true);
      return;
    }
    setExtra((prev) => ({
      id: filterId,
      slips: [...(prev && prev.id === filterId ? prev.slips : []), ...res.data.slips],
      cursor: res.data.nextCursor,
    }));
  };

  /* ── ตัวเลือกตัวกรอง ── */
  const marketOptions = useMemo(() => {
    const slugs = new Set(first.data?.summary.markets ?? []);
    if (params.market) slugs.add(params.market);
    return [
      { value: ALL, label: t("slips.filters.allMarkets") },
      ...[...slugs].map((slug) => ({ value: slug, label: t(lotteryPlayMarketMeta(slug).titleKey) })),
    ];
  }, [first.data?.summary.markets, params.market, t]);

  const resultOptions = useMemo(
    () => [
      { value: ALL, label: t("slips.filters.allResults") },
      ...RESULTS.map((value) => ({ value, label: t(`slips.status.${value}`) })),
    ],
    [t],
  );

  const tabs = [
    { id: "pending", label: t("slips.tabs.pending") },
    { id: "history", label: t("slips.tabs.history") },
  ];

  const rangeLabels: Record<SlipRangeId, string> = {
    today: t("slips.filters.today"),
    "7d": t("slips.filters.days7"),
    "30d": t("slips.filters.days30"),
    custom: t("slips.filters.custom"),
  };

  /** ขอบเขตวันที่ของช่วงกำหนดเอง — ย้อนหลังไม่เกินอายุเก็บประวัติ */
  const minDate = formatDateOnly(slipHistoryCutoff(now));
  const maxDate = formatDateOnly(now);
  const customFrom = parseDateOnly(params.from) ?? new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const customTo = parseDateOnly(params.to) ?? now;

  const selectRange = (id: SlipRangeId) => {
    if (id === "custom") {
      setParams({ range: "custom", from: formatDateOnly(customFrom), to: formatDateOnly(customTo) });
    } else {
      setParams({ range: id, from: "", to: "" });
    }
  };

  const filtersActive =
    Boolean(params.market) || (scope === "history" && (Boolean(result) || range !== DEFAULTS.range));
  const clearFilters = () => setParams({ market: "", result: "", range: DEFAULTS.range, from: "", to: "" });

  return (
    <div className="lottery-hub-theme flex flex-col gap-3 pt-1">
      <SoftLineTabs
        tabs={tabs}
        activeId={scope}
        onSelect={(id) => setParams({ tab: id })}
        ariaLabel={t("slips.tabs.aria")}
      />

      {/* ตัวกรอง */}
      <div className="flex flex-col gap-2" role="group" aria-label={t("slips.filters.aria")}>
        <div className="grid grid-cols-2 gap-2">
          <select
            className={SELECT_CLASS}
            value={params.market || ALL}
            onChange={(event) => setParams({ market: event.target.value === ALL ? "" : event.target.value })}
            aria-label={t("slips.filters.market")}
          >
            {marketOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {scope === "history" ? (
            <select
              className={SELECT_CLASS}
              value={result || ALL}
              onChange={(event) => setParams({ result: event.target.value === ALL ? "" : event.target.value })}
              aria-label={t("slips.filters.result")}
            >
              {resultOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : null}
        </div>

        {scope === "history" ? (
          <div className="flex flex-col gap-1.5">
            <div className="flex flex-wrap gap-2" role="group" aria-label={t("slips.filters.range")}>
              {SLIP_RANGE_IDS.map((id) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={range === id}
                  onClick={() => selectRange(id)}
                  className={`${range === id ? "soft-btn-primary" : "soft-btn-outline"} min-h-9 px-3 text-sm font-semibold`}
                >
                  {rangeLabels[id]}
                </button>
              ))}
            </div>
            {range === "custom" ? (
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  className={SELECT_CLASS}
                  value={formatDateOnly(customFrom)}
                  min={minDate}
                  max={maxDate}
                  onChange={(event) =>
                    parseDateOnly(event.target.value)
                      ? setParams({ range: "custom", from: event.target.value, to: formatDateOnly(customTo) })
                      : undefined
                  }
                  aria-label={t("slips.filters.range")}
                />
                <input
                  type="date"
                  className={SELECT_CLASS}
                  value={formatDateOnly(customTo)}
                  min={minDate}
                  max={maxDate}
                  onChange={(event) =>
                    parseDateOnly(event.target.value)
                      ? setParams({ range: "custom", from: formatDateOnly(customFrom), to: event.target.value })
                      : undefined
                  }
                  aria-label={t("slips.filters.range")}
                />
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <ResourceGate resource={first} loadingLabel={t("slips.loading")} errorTitle={t("slips.loadError")}>
        {(data) => (
          <div className="flex flex-col gap-3">
            <div
              className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-sm text-[var(--text-muted)]"
              aria-live="polite"
            >
              <span className="tabular-nums">
                {t("slips.summary.count", { count: data.summary.count })} ·{" "}
                {t("slips.summary.stake", { amount: formatBaht(data.summary.totalStake) })}
              </span>
              {data.summary.totalWinLoss !== null ? (
                <span className="tabular-nums">
                  {t("slips.summary.net")}{" "}
                  <span className={signedMoneyToneClass(data.summary.totalWinLoss, "font-semibold")}>
                    {formatSignedBaht(data.summary.totalWinLoss)}
                  </span>
                </span>
              ) : null}
            </div>

            {slips.length === 0 ? (
              filtersActive ? (
                <EmptyState
                  className="mx-auto"
                  title={t("slips.emptyFiltered")}
                  primaryAction={{ label: t("slips.clearFilters"), onClick: clearFilters }}
                />
              ) : scope === "pending" ? (
                <EmptyState
                  className="mx-auto"
                  title={t("slips.emptyPending.title")}
                  description={t("slips.emptyPending.description")}
                  primaryAction={{ label: t("slips.goPlay"), href: "/lottery" }}
                />
              ) : (
                <EmptyState
                  className="mx-auto"
                  title={t("slips.emptyHistory.title")}
                  description={t("slips.emptyHistory.description", { days: SLIP_HISTORY_DAYS })}
                />
              )
            ) : (
              <ul className="lottery-slips-list m-0 flex list-none flex-col gap-2.5 p-0">
                {slips.map((slip) => (
                  <li key={slip.id}>
                    <LotterySlipCard slip={slip} now={now} />
                  </li>
                ))}
              </ul>
            )}

            {cursor ? (
              <div className="flex flex-col items-center gap-2">
                {moreError ? (
                  <p className="m-0 text-sm text-red-400" role="alert">
                    {t("slips.loadMoreError")}
                  </p>
                ) : null}
                <button
                  type="button"
                  onClick={() => void loadMore()}
                  disabled={loadingMore}
                  className="soft-btn-outline min-h-11 w-full text-sm font-semibold disabled:opacity-50"
                >
                  {loadingMore ? t("slips.loadingMore") : t("slips.loadMore")}
                </button>
              </div>
            ) : null}

            {scope === "history" ? (
              <p className="m-0 text-center text-xs text-[var(--text-muted)]">
                {t("slips.retentionNote", { days: SLIP_HISTORY_DAYS })}
              </p>
            ) : null}
          </div>
        )}
      </ResourceGate>
    </div>
  );
}
