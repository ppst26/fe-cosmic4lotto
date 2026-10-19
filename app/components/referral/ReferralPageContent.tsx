"use client";

import { Fragment, useState } from "react";
import type { ReferralOverviewData } from "@/lib/api/referral";
import { usePrefetchReferralTabs, useReferralOverview } from "@/app/hooks/api/member";
import { ResourceGate } from "@/app/components/ui/ResourceGate";
import { LoginPrompt } from "@/app/components/ui/LoginPrompt";
import { useT } from "@/lib/i18n/I18nProvider";
import type { ReferralMessageKey } from "@/app/types/referral";
import { ReferralEarningPanel } from "./ReferralEarningPanel";
import { ReferralUsersPanel } from "./ReferralUsersPanel";
import { ReferralLinkSection, ReferralStatsSection } from "./ReferralOverviewSections";

type ReferralTabId = "overview" | "users" | "earning";

const TABS: { id: ReferralTabId; labelKey: ReferralMessageKey }[] = [
  { id: "overview", labelKey: "tabs.overview" },
  { id: "users", labelKey: "tabs.users" },
  { id: "earning", labelKey: "tabs.earning" },
];

/**
 * เนื้อหาหน้าแนะนำเพื่อน — ใช้ใน /referral และ hub modal
 * แท็บเก็บเป็น local state เสมอ (เหมือน glass) จึงไม่เขียน URL ทั้งแบบ embedded และ standalone
 */
export function ReferralPageContent({
  refCode,
  embedded = false,
}: {
  refCode?: string;
  embedded?: boolean;
}) {
  const overview = useReferralOverview();
  usePrefetchReferralTabs();
  const t = useT("referral");
  return (
    <ResourceGate
      resource={overview}
      loadingLabel={t("status.overviewLoading")}
      errorTitle={t("status.overviewError")}
      idleFallback={<LoginPrompt title={t("loginPrompt.title")} description={t("loginPrompt.description")} />}
    >
      {(referralOverview) => (
        <ReferralTabs
          key={embedded ? "embedded" : "page"}
          refCode={refCode ?? referralOverview.refCode}
          overview={referralOverview}
        />
      )}
    </ResourceGate>
  );
}

function ReferralTabs({ refCode, overview }: { refCode: string; overview: ReferralOverviewData }) {
  const t = useT("referral");
  const [tab, setTab] = useState<ReferralTabId>("overview");

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2" role="tablist" aria-label={t("tabs.ariaLabel")}>
        {TABS.map(({ id, labelKey }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={`h-10 rounded-[var(--radius-soft-sm)] text-xs font-semibold sm:text-sm ${
              tab === id ? "soft-btn-primary" : "border border-white/10 bg-[var(--soft-card)] text-[var(--text-on-light)]"
            }`}
          >
            {t(labelKey)}
          </button>
        ))}
      </div>

      {tab === "overview" ? (
        <div className="space-y-3">
          <ReferralLinkSection refCode={refCode} />
          <ReferralStatsSection stats={overview.stats} />

          <section className="soft-panel space-y-3 p-4">
            <div>
              <h2 className="text-sm font-semibold text-[var(--text-on-light)]">{t("tiers.title")}</h2>
              <p className="mt-0.5 text-xs text-[var(--text-muted)]">{t("tiers.description")}</p>
            </div>
            <div className="space-y-2">
              {overview.tiers.map((tier) => (
                <div key={tier.id} className="soft-card flex items-center gap-3 p-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold sm:text-[13px]">{t(tier.titleKey)}</p>
                    <p className="mt-0.5 text-[11px] text-[var(--text-muted)] sm:text-xs">{t(tier.subtitleKey)}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-xl font-semibold leading-none text-[var(--brand-strong)]">{tier.rateLabel}</p>
                    <p className="mt-1 text-[10px] text-[var(--text-muted)] sm:text-xs">{t(tier.rateHintKey)}</p>
                  </div>
                </div>
              ))}
            </div>
            <ul className="flex flex-wrap gap-x-4 gap-y-2">
              {overview.checks.map((line) => (
                <li key={line} className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                  <span className="text-[var(--brand)]" aria-hidden="true">
                    ✓
                  </span>
                  {t(line)}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-sm font-semibold text-[var(--text-on-light)]">{t("steps.title")}</h2>
            <ol className="flex list-none items-start gap-0 p-0">
              {overview.steps.map((step, index) => (
                <Fragment key={step.id}>
                  <li className="flex min-w-0 flex-1 flex-col items-center text-center">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--brand-soft)] text-xs font-semibold text-[var(--brand-strong)]">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <p className="mt-2 text-xs font-semibold sm:text-[13px]">{t(step.labelKey)}</p>
                  </li>
                  {index < overview.steps.length - 1 ? (
                    <li className="flex h-11 w-5 shrink-0 items-center justify-center text-[var(--text-muted)] sm:w-6" aria-hidden="true">
                      ›
                    </li>
                  ) : null}
                </Fragment>
              ))}
            </ol>
          </section>
        </div>
      ) : null}

      {tab === "users" ? <ReferralUsersPanel /> : null}

      {tab === "earning" ? <ReferralEarningPanel totalEarningsThb={overview.stats.totalEarningsThb} /> : null}
    </div>
  );
}
