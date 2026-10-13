"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { useActivities } from "@/app/hooks/api/member";
import { ResourceGate } from "@/app/components/ui/ResourceGate";
import { PromoHubPillLabel } from "@/app/components/promotions/promoHubCardPrimitives";
import type { ActivityHubItem } from "@/app/types/activities";
import { useT } from "@/lib/i18n/I18nProvider";
import { ActivityDetailBody, ActivityHubThumb } from "./ActivityHubShared";

function ActivityListCard({
  item,
  selected,
  showViewDetails = false,
  onSelect,
}: {
  item: ActivityHubItem;
  selected?: boolean;
  /** ป้าย "ดูรายละเอียด" (การ์ดมือถือ) */
  showViewDetails?: boolean;
  onSelect: () => void;
}) {
  const t = useT("rewards");
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={selected ? "true" : undefined}
      className={`flex w-full gap-3 rounded-2xl border bg-[var(--Card-Normal)] p-3 text-left transition-colors hover:border-[var(--Main-Primary)]/40 ${
        selected ? "border-[var(--Main-Primary)]" : "border-white/10"
      }`}
    >
      <ActivityHubThumb
        tone={item.thumbTone}
        imageUrl={item.imageUrl}
        overlay={item.statusOverlay}
        className="h-[72px] w-[72px]"
      />
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
        <span className="text-sm font-semibold leading-snug text-[var(--Text-Icon-Title)]">{item.title}</span>
        {item.listMeta ? (
          <span className="text-xs text-[var(--Text-Icon-Body)]">{item.listMeta}</span>
        ) : null}
        {showViewDetails ? (
          <span className="mt-1 inline-flex">
            <PromoHubPillLabel label={t("activities.viewDetails")} />
          </span>
        ) : null}
      </div>
    </button>
  );
}

/** มือถือ — รายการเต็มความกว้าง แตะเข้ารายละเอียด (ปิดกลับรายการ) */
function ActivitiesListView({ activities }: { activities: ActivityHubItem[] }) {
  const t = useT("rewards");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = activities.find((a) => a.id === selectedId) ?? null;

  if (selected) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="min-w-0 truncate text-base font-semibold text-[var(--Text-Icon-Title)]">
            {selected.title}
          </h2>
          <button
            type="button"
            onClick={() => setSelectedId(null)}
            aria-label={t("activities.closeDetail")}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-[var(--BG-Surface-Normal)] text-[var(--Text-Icon-Title)] hover:bg-[var(--Card-Normal)]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <ActivityDetailBody key={selected.id} item={selected} showTitle={false} />
      </div>
    );
  }

  return (
    <ul className="space-y-3" aria-label={t("activities.listAria")}>
      {activities.map((item) => (
        <li key={item.id}>
          <ActivityListCard item={item} showViewDetails onSelect={() => setSelectedId(item.id)} />
        </li>
      ))}
    </ul>
  );
}

/** desktop (embedded + lg) — รายการซ้าย · รายละเอียดขวา */
function ActivitiesMasterDetail({ activities }: { activities: ActivityHubItem[] }) {
  const t = useT("rewards");
  const [pickedId, setPickedId] = useState(activities[0]?.id ?? "");
  const selected = activities.find((item) => item.id === pickedId) ?? activities[0];

  return (
    <div className="grid min-h-[min(58dvh,560px)] lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] lg:items-stretch lg:gap-5">
      <nav
        className="scrollbar-none flex min-h-0 flex-col gap-2 overflow-y-auto"
        aria-label={t("activities.listAria")}
      >
        {activities.map((item) => (
          <ActivityListCard
            key={item.id}
            item={item}
            selected={item.id === selected?.id}
            onSelect={() => setPickedId(item.id)}
          />
        ))}
      </nav>
      <div className="scrollbar-none min-h-0 overflow-y-auto" aria-live="polite">
        {selected ? <ActivityDetailBody key={selected.id} item={selected} /> : null}
      </div>
    </div>
  );
}

/** เนื้อหาหน้ากิจกรรม (/event) และ desktop hub กิจกรรม */
export function ActivitiesHubPageContent({ embedded = false }: { embedded?: boolean }) {
  const t = useT("rewards");
  const activitiesResource = useActivities();

  return (
    <ResourceGate
      resource={activitiesResource}
      loadingLabel={t("activities.loading")}
      errorTitle={t("activities.loadError")}
    >
      {(activities) => (
        <>
          {embedded ? (
            <div className="hidden pb-2 lg:block">
              <ActivitiesMasterDetail activities={activities} />
            </div>
          ) : null}
          <div className={`pb-4 ${embedded ? "lg:hidden" : ""}`}>
            <ActivitiesListView activities={activities} />
          </div>
        </>
      )}
    </ResourceGate>
  );
}
