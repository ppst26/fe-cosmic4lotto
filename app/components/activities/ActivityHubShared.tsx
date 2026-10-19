"use client";

import React from "react";
import { TabPanelTransition } from "@/app/components/ui/TabPanelTransition";
import { HubTabs } from "@/app/components/promotions/HubTabs";
import { ACTIVITY_HUB_CATEGORY_TABS } from "@/app/data/activitiesHubMockData";
import { formatActivityNumber } from "@/lib/format";
import type {
  ActivityHubCategoryTab,
  ActivityHubCategoryTabItem,
  ActivityHubItem,
  ActivityThumbTone,
  ActivityTierRow,
} from "@/app/types/activities";
import { useT } from "@/lib/i18n/I18nProvider";
import { useFormat } from "@/lib/i18n/useFormat";

/** พื้นไล่เฉดมืด-ทองต่อ tone (ใช้เมื่อไม่มีรูปจริง) */
const THUMB_BG: Record<ActivityThumbTone, string> = {
  turn: "linear-gradient(135deg, #7a4a0c 0%, #2e2e32 100%)",
  "xl-win": "linear-gradient(135deg, #5b3b9a 0%, #28282b 100%)",
  "check-in": "linear-gradient(135deg, #2f5aa8 0%, #28282b 100%)",
  football: "linear-gradient(135deg, #1f6b3d 0%, #28282b 100%)",
  mascot: "linear-gradient(135deg, #a8325f 0%, #28282b 100%)",
  cashback: "linear-gradient(135deg, #b8860b 0%, #2e2e32 100%)",
};

function ActivityThumbArt({ tone }: { tone: ActivityThumbTone }) {
  if (tone === "turn") {
    return (
      <svg viewBox="0 0 80 80" className="absolute inset-0 h-full w-full p-2 opacity-90">
        <text x="40" y="44" textAnchor="middle" fill="#ffd15c" fontSize="22" fontWeight="600">T</text>
        <circle cx="40" cy="40" r="28" fill="none" stroke="#ffd15c" strokeWidth="2" opacity="0.5" />
      </svg>
    );
  }
  if (tone === "football") {
    return (
      <svg viewBox="0 0 80 80" className="absolute inset-0 m-auto h-12 w-12 opacity-90">
        <circle cx="40" cy="40" r="18" fill="#bbf7d0" />
        <path d="M40 22 L48 32 L40 42 L32 32 Z" fill="#166534" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 80 80" className="absolute inset-0 h-full w-full opacity-30">
      <circle cx="56" cy="28" r="16" fill="#fff" />
    </svg>
  );
}

/** รูปย่อกิจกรรม — รูปจริง (ถ้ามี) หรือพื้นไล่เฉด + ภาพประกอบตาม tone */
export function ActivityHubThumb({
  tone,
  className,
  overlay,
  imageUrl,
}: {
  tone?: ActivityThumbTone;
  className?: string;
  overlay?: string;
  imageUrl?: string;
}) {
  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-xl border border-white/10 ${className ?? ""}`}
      style={{ background: THUMB_BG[tone ?? "turn"] }}
      aria-hidden={overlay ? undefined : true}
    >
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
      ) : (
        <ActivityThumbArt tone={tone ?? "turn"} />
      )}
      {overlay ? (
        <span className="absolute inset-0 flex items-center justify-center bg-black/60 text-xs font-semibold text-white">
          {overlay}
        </span>
      ) : null}
    </div>
  );
}

export function ActivityCategoryTabs({
  activeId,
  onSelect,
  tabs = ACTIVITY_HUB_CATEGORY_TABS,
}: {
  activeId: ActivityHubCategoryTab;
  onSelect: (id: ActivityHubCategoryTab) => void;
  tabs?: ActivityHubCategoryTabItem[];
}) {
  const t = useT("rewards");
  return (
    <HubTabs
      tabs={tabs.map((tab) => ({ id: tab.id, label: t(tab.labelKey) }))}
      activeId={activeId}
      onSelect={onSelect}
      ariaLabel={t("activities.categoryTabsAria")}
    />
  );
}

export function ActivityTurnProgressCard({
  progress,
}: {
  progress: NonNullable<ActivityHubItem["progress"]>;
}) {
  const t = useT("rewards");
  const fmt = useFormat();
  const pct =
    progress.bonusCap > 0 ? Math.min(100, (progress.bonusEarned / progress.bonusCap) * 100) : 0;

  return (
    <section className="space-y-3 rounded-2xl border border-white/10 bg-[var(--Card-Normal)] p-4">
      <h3 className="text-center text-sm font-semibold text-[var(--Text-Icon-Title)]">
        {t("activities.progress.title")}
      </h3>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <p className="text-xs text-[var(--Text-Icon-Body)]">{t("activities.progress.current")}</p>
          <p className="text-sm font-semibold text-[var(--Text-Icon-Title)]">
            {fmt.credits(progress.currentTurn)}
          </p>
        </div>
        <div className="sm:text-right">
          <p className="text-xs text-[var(--Text-Icon-Body)]">{t("activities.progress.rank1Target")}</p>
          <p className="text-sm font-semibold text-[var(--Text-Icon-Title)]">
            {fmt.credits(progress.rank1Target)}
          </p>
        </div>
      </div>
      <div>
        <div className="h-2 overflow-hidden rounded-full bg-[var(--BG-Surface-Darker)]">
          <div className="h-full rounded-full bg-[var(--Main-Primary)]" style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-1 text-center text-xs text-[var(--Text-Icon-Body)]">
          {t("activities.progress.rewardCount", {
            earned: formatActivityNumber(progress.bonusEarned),
            cap: formatActivityNumber(progress.bonusCap),
          })}
        </p>
      </div>
    </section>
  );
}

function ActivityClaimCell({ state }: { state: ActivityTierRow["claimState"] }) {
  const t = useT("rewards");
  if (state === "claimable") {
    /** glass ไม่มี mutation ของการรับรางวัล — แสดงสถานะเท่านั้น (ปุ่ม disabled) */
    return (
      <button
        type="button"
        disabled
        className="btn-gold inline-flex min-w-[5.5rem] justify-center px-2 py-1.5 text-xs font-semibold disabled:opacity-60"
      >
        {t("actions.claim")}
      </button>
    );
  }
  if (state === "claimed") {
    return <span className="text-xs font-semibold text-[var(--Main-Primary)]">{t("status.claimed")}</span>;
  }
  return <span className="text-xs text-[var(--Text-Icon-Body)]">{t("activities.tiers.notEligible")}</span>;
}

export function ActivityTierTable({ rows }: { rows: ActivityTierRow[] }) {
  const t = useT("rewards");
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[var(--Card-Normal)] p-2">
      <table className="w-full min-w-[420px] border-collapse text-left text-sm">
        <thead>
          <tr className="text-[var(--Text-Icon-Body)]">
            <th scope="col" className="px-2 py-1 font-semibold">{t("activities.tiers.rank")}</th>
            <th scope="col" className="px-2 py-1 font-semibold">{t("activities.tiers.turn")}</th>
            <th scope="col" className="px-2 py-1 text-center font-semibold">{t("activities.tiers.bonus")}</th>
            <th scope="col" className="px-2 py-1 text-right font-semibold">{t("activities.tiers.claim")}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.rank} className="border-t border-white/10">
              <td className="px-2 py-2 font-semibold tabular-nums text-[var(--Text-Icon-Title)]">{row.rank}</td>
              <td className="px-2 py-2 tabular-nums text-[var(--Text-Icon-Body)]">
                {formatActivityNumber(row.turnRequired)}
              </td>
              <td className="px-2 py-2 text-center font-semibold tabular-nums text-[var(--Main-Primary)]">
                {formatActivityNumber(row.bonus)}
              </td>
              <td className="px-2 py-2 text-right">
                <ActivityClaimCell state={row.claimState} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ActivityInfoDetail({ item }: { item: ActivityHubItem }) {
  const hasSummary = Boolean(item.infoSummary);
  const hasBullets = Boolean(item.infoBullets && item.infoBullets.length > 0);
  if (!hasSummary && !hasBullets) return null;

  return (
    <div className="flex flex-col gap-3 text-sm leading-relaxed text-[var(--Text-Icon-Body)]">
      {hasSummary ? <p>{item.infoSummary}</p> : null}
      {hasBullets ? (
        <ul className="space-y-2">
          {item.infoBullets!.map((line) => (
            <li key={line} className="flex gap-2">
              <span className="text-[var(--Main-Primary)]" aria-hidden="true">•</span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export function ActivityRulesSection({ rules, period }: { rules?: string[]; period?: string }) {
  const t = useT("rewards");
  if (!rules || rules.length === 0) return null;

  return (
    <section
      className="rounded-2xl border border-white/10 bg-[var(--BG-Surface-Normal)] p-4"
      aria-label={t("activities.rulesTitle")}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2">
        <h3 className="text-sm font-semibold text-[var(--Text-Icon-Title)]">{t("activities.rulesTitle")}</h3>
        {period ? (
          <span className="rounded-full border border-white/10 bg-[var(--BG-Surface-Darker)] px-2.5 py-1 text-xs font-semibold text-[var(--Main-Primary)]">
            {period}
          </span>
        ) : null}
      </div>
      <ol className="mt-3 space-y-2 text-xs leading-relaxed">
        {rules.map((rule, idx) => (
          <li key={idx} className="flex items-start gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/10 bg-[var(--BG-Surface-Darker)] text-xs font-semibold tabular-nums text-[var(--Main-Primary)]">
              {idx + 1}
            </span>
            <span className="flex-1 pt-0.5 text-[var(--Text-Icon-Body)]">{rule}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function ActivityDetailBody({
  item,
  showTitle = true,
}: {
  item: ActivityHubItem;
  showTitle?: boolean;
}) {
  const [category, setCategory] = React.useState<ActivityHubCategoryTab>(
    item.categoryTabs?.[0] ?? "slots",
  );

  const tiers = item.detailKind === "turn-tier" ? item.tiersByCategory?.[category] ?? [] : [];

  return (
    <div className="flex min-h-0 flex-col gap-4">
      <div className="flex flex-col gap-3">
        {showTitle ? (
          <h2 className="text-lg font-semibold leading-snug text-[var(--Text-Icon-Title)]">{item.title}</h2>
        ) : null}
        {item.detailKind === "turn-tier" && item.categoryTabs ? (
          <ActivityCategoryTabs
            activeId={category}
            onSelect={setCategory}
            tabs={ACTIVITY_HUB_CATEGORY_TABS.filter((tab) => item.categoryTabs?.includes(tab.id))}
          />
        ) : null}
      </div>

      {item.detailKind === "turn-tier" && item.progress ? (
        <TabPanelTransition tabKey={category} className="flex flex-col gap-4">
          <ActivityTurnProgressCard progress={item.progress} />
          <ActivityTierTable rows={tiers} />
        </TabPanelTransition>
      ) : (
        <ActivityInfoDetail item={item} />
      )}

      <ActivityRulesSection rules={item.rules} period={item.period} />
    </div>
  );
}
