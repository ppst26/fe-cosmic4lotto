"use client";

import { useMemo } from "react";
import { EmptyState } from "@/app/components/ui/StatusState";
import { getLotteryRules } from "@/lib/lottery/rules";
import { LotteryMarketIcon } from "@/components/lottery/hub/LotteryMarketIcon";
import { formatBaht } from "./lotteryUtils";
import { useLotteryI18n } from "./useLotteryI18n";

/**
 * เนื้อหาหน้ากติกา / อัตราการจ่าย (/lottery/rules/[marketSlug]) — เปิดจากการ์ดหัวงวดในหน้าแทง
 * แสดงอัตราจ่ายต่อ 1 บาทของแต่ละประเภทการแทง + ยอดแทงต่อรายการ (ข้อมูลจาก lib/lottery/rules.ts)
 */
export function LotteryRulesContent({ marketSlug }: { marketSlug: string }) {
  const { t } = useLotteryI18n();
  const rules = useMemo(() => getLotteryRules(marketSlug), [marketSlug]);

  if (!rules) {
    return (
      <EmptyState
        className="mx-auto mt-4"
        title={t("market.notFoundTitle")}
        description={t("market.notFoundDescription")}
        primaryAction={{ label: t("market.viewAll"), href: "/lottery" }}
      />
    );
  }

  return (
    <div className="lottery-hub-theme flex flex-col gap-3">
      <section
        className="thai-lotto-draw lottery-soft-card flex items-center gap-3 p-3 sm:p-4"
        aria-label={t(rules.titleKey)}
      >
        <LotteryMarketIcon
          marketSlug={rules.slug}
          size="lg"
          fallbackLabel={rules.flagLabel}
          fallbackTone={rules.flagTone}
        />
        <h2 className="m-0 min-w-0 flex-1 text-base font-semibold text-[var(--text-on-light)]">{t(rules.titleKey)}</h2>
      </section>

      <section className="thai-lotto-panel p-3 sm:p-4" aria-labelledby="lottery-rules-payout">
        <h2 id="lottery-rules-payout" className="m-0 mb-1 text-sm font-semibold text-[var(--text-on-light)]">
          {t("rules.payoutHeading")}
        </h2>
        <ul className="m-0 list-none p-0">
          {rules.rows.map((row) => (
            <li
              key={row.id}
              className="flex items-center justify-between gap-3 border-b border-white/[0.06] py-2.5 last:border-b-0"
            >
              <span className="min-w-0 text-sm text-[var(--text-on-light)]">{t(row.labelKey)}</span>
              <span className="shrink-0 text-sm font-semibold tabular-nums text-[var(--brand-strong)]">
                {t("board.payout", { rate: row.payoutRate })}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {rules.minBet !== null && rules.maxBet !== null ? (
        <section className="thai-lotto-panel p-3 sm:p-4" aria-labelledby="lottery-rules-limits">
          <h2 id="lottery-rules-limits" className="m-0 mb-1 text-sm font-semibold text-[var(--text-on-light)]">
            {t("rules.limitsHeading")}
          </h2>
          <dl className="m-0">
            <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] py-2.5">
              <dt className="text-sm text-[var(--text-muted)]">{t("rules.minBet")}</dt>
              <dd className="m-0 text-sm tabular-nums text-[var(--text-on-light)]">{formatBaht(rules.minBet)}</dd>
            </div>
            <div className="flex items-center justify-between gap-3 py-2.5">
              <dt className="text-sm text-[var(--text-muted)]">{t("rules.maxBet")}</dt>
              <dd className="m-0 text-sm tabular-nums text-[var(--text-on-light)]">{formatBaht(rules.maxBet)}</dd>
            </div>
          </dl>
        </section>
      ) : null}
    </div>
  );
}
