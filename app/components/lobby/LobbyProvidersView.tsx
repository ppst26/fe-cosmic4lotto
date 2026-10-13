"use client";

import { useMemo, useState } from "react";
import { useT } from "@/lib/i18n/I18nProvider";
import { CASINO_ITEMS } from "@/app/data/casinoProvidersData";
import { FEATURED_SLOT_PROVIDERS, GRID_SLOT_PROVIDERS } from "@/app/data/slotProvidersData";
import { LobbyProviderCard } from "./LobbyProviderCard";
import { LobbySearchBar } from "./LobbySearchBar";

type LobbyProvidersViewProps = {
  categoryId: "slots" | "casino";
};

/**
 * รายการค่ายเกมของหมวดสล็อต/คาสิโน — ข้อมูลและตรรกะค้นหาเดียวกับ LobbyCategoryProviders ของ glass
 * (ศูนย์รวม = ทุกค่าย · ค้นหาตามชื่อ) · สล็อตกดแล้วเข้า /slots/[provider] · คาสิโนเข้าหน้า /play โดยตรง
 */
export function LobbyProvidersView({ categoryId }: LobbyProvidersViewProps) {
  const t = useT("home");
  const [query, setQuery] = useState("");
  const q = query.toLowerCase().trim();

  const slots = useMemo(() => {
    if (!q) return { featured: FEATURED_SLOT_PROVIDERS, grid: GRID_SLOT_PROVIDERS };
    return {
      featured: FEATURED_SLOT_PROVIDERS.filter((p) => p.name.toLowerCase().includes(q)),
      grid: GRID_SLOT_PROVIDERS.filter((p) => p.name.toLowerCase().includes(q)),
    };
  }, [q]);

  const casino = useMemo(() => {
    if (!q) return CASINO_ITEMS;
    return CASINO_ITEMS.filter(
      (item) => item.title.toLowerCase().includes(q) || item.provider.toLowerCase().includes(q),
    );
  }, [q]);

  const total =
    categoryId === "slots" ? (q ? slots.featured.length + slots.grid.length : 42) : casino.length;

  return (
    <section className="flex min-w-0 flex-col gap-4" aria-label={t("categoryProviders.listAriaLabel")}>
      <LobbySearchBar
        value={query}
        onChange={setQuery}
        placeholder={
          categoryId === "casino"
            ? t("categoryProviders.searchPlaceholder.casino")
            : t("categoryProviders.searchPlaceholder.default")
        }
      />

      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-base font-semibold text-[var(--text-on-light)] sm:text-lg">
          {categoryId === "casino" ? t("categoryProviders.liveCasino") : t("categories.slots")}
        </h2>
        <span className="text-xs font-medium text-[var(--text-muted)] sm:text-sm">
          {t("categoryProviders.providerCount", { count: total })}
        </span>
      </div>

      {categoryId === "slots" ? (
        <>
          {slots.featured.length > 0 ? (
            <div className="grid grid-cols-2 gap-2.5">
              {slots.featured.map((p, index) => (
                <LobbyProviderCard
                  key={p.id}
                  href={p.href}
                  title={p.name}
                  coverSrc={p.coverSrc}
                  badges={p.badge ? [p.badge] : undefined}
                  priority={index < 2}
                />
              ))}
            </div>
          ) : null}
          <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
            {slots.grid.map((p) => (
              <LobbyProviderCard
                key={p.id}
                href={p.href || `/slots/${p.id}`}
                title={p.name}
                coverSrc={p.coverSrc}
                badges={p.badge ? [p.badge] : undefined}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {casino.map((item) => (
            <LobbyProviderCard
              key={item.id}
              href={item.href}
              title={item.title}
              coverSrc={item.coverSrc}
              badges={item.badges}
              showTitle
            />
          ))}
        </div>
      )}
    </section>
  );
}
