"use client";

import { useMemo } from "react";
import { EmptyState } from "@/app/components/ui/StatusState";
import { getLotteryRules } from "@/lib/lottery/rules";
import { getLotteryRuleDoc } from "@/lib/lottery/rulesContent";
import { formatBaht } from "./lotteryUtils";
import { useLotteryI18n } from "./useLotteryI18n";

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="m-0 flex list-disc flex-col gap-1.5 pl-5 text-sm leading-relaxed text-[var(--text-on-light)] marker:text-[var(--brand-strong)]">
      {items.map((line) => (
        <li key={line}>{line}</li>
      ))}
    </ul>
  );
}

/**
 * เนื้อหากติกา / อัตราการจ่ายของตลาดหวย — แสดงใน modal (LotteryRulesModal) และหน้า /lottery/rules/[marketSlug]
 * ลำดับ: เวลาเปิด-ปิดรับ → วิธีดูผล + แหล่งอ้างอิง → อัตราจ่าย (ข้อมูลของเราจาก lib/lottery/rules.ts)
 */
export function LotteryRulesContent({ marketSlug }: { marketSlug: string }) {
  const { t } = useLotteryI18n();
  const rules = useMemo(() => getLotteryRules(marketSlug), [marketSlug]);
  const doc = getLotteryRuleDoc(marketSlug);

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

  const title = doc?.title ?? t(rules.titleKey);

  return (
    <article className="flex flex-col gap-4">
      <header className="flex flex-col gap-1.5">
        <h2 className="m-0 text-2xl font-bold leading-tight text-[var(--text-on-light)]">{title}</h2>
        {doc ? <p className="m-0 text-sm text-[var(--text-muted)]">{doc.intro}</p> : null}
      </header>

      {doc ? (
        <>
          <BulletList items={doc.schedule} />
          <section className="flex flex-col gap-2" aria-label={doc.resultHeading}>
            <h3 className="m-0 text-lg font-bold text-[var(--text-on-light)]">{doc.resultHeading}</h3>
            <BulletList items={doc.result} />
            {doc.example ? (
              <div className="rounded-xl bg-[var(--surface-muted,rgba(127,127,127,0.1))] px-3 py-2 text-sm leading-relaxed text-[var(--text-on-light)]">
                {doc.example.map((line) => (
                  <p key={line} className="m-0">
                    {line}
                  </p>
                ))}
              </div>
            ) : null}
          </section>
        </>
      ) : null}

      <section className="flex flex-col gap-1" aria-labelledby="lottery-rules-payout">
        <h3 id="lottery-rules-payout" className="m-0 text-sm font-bold text-[var(--text-on-light)]">
          {t("rules.payoutHeading")}
        </h3>
        <ul className="m-0 list-none p-0">
          {rules.rows.map((row) => (
            <li
              key={row.id}
              className="flex items-center justify-between gap-3 border-b border-[var(--border-soft,rgba(127,127,127,0.18))] py-2 last:border-b-0"
            >
              <span className="min-w-0 text-sm text-[var(--text-on-light)]">{t(row.labelKey)}</span>
              <span className="shrink-0 text-sm font-semibold tabular-nums text-[var(--brand-strong)]">
                {t("board.payout", { rate: row.payoutRate })}
              </span>
            </li>
          ))}
        </ul>
        {rules.minBet !== null && rules.maxBet !== null ? (
          <p className="m-0 mt-1 text-xs text-[var(--text-muted)]">
            {t("rules.minBet")} {formatBaht(rules.minBet)} · {t("rules.maxBet")} {formatBaht(rules.maxBet)}
          </p>
        ) : null}
      </section>
    </article>
  );
}
