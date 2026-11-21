"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import Link from "@/lib/i18n/navigation";
import { gameCardEnterClassName, gameCardEnterStyle } from "@/lib/gameCardEnterMotion";
import { useT } from "@/lib/i18n/I18nProvider";
import { LobbySearchBar } from "@/app/components/lobby/LobbySearchBar";
import { GamingFilterSidebar } from "./GamingFilterSidebar";
import { GAMING_CATEGORIES, getGamingProviders, type GamingCategoryId } from "./gaming-category";

/**
 * หน้าหมวดเกมแบบ standalone (/slots · /casino · /fishing · /sport · /cards)
 * desktop: hero ชื่อหมวด + sidebar ตัวกรอง + กริดค่าย · มือถือ: เมนูหมวด + กริดค่าย
 * กดการ์ดค่ายเพื่อเข้าไปดูเกมในค่าย (คาสิโนเข้าหน้าเล่นตรง)
 */
export function GamingCategoryPage({ categoryId }: { categoryId: GamingCategoryId }) {
  const meta = GAMING_CATEGORIES[categoryId];
  const allProviders = useMemo(() => getGamingProviders(categoryId), [categoryId]);
  const t = useT("home");
  const [query, setQuery] = useState("");
  const providers = useMemo(() => {
    const q = query.toLowerCase().trim();
    return q ? allProviders.filter((p) => p.title.toLowerCase().includes(q)) : allProviders;
  }, [allProviders, query]);
  const placeholderKey = categoryId === "casino" || categoryId === "fishing" || categoryId === "cards" || categoryId === "sports" ? categoryId : "default";

  return (
    <>
      <div className="gaming-category-hero" data-category={categoryId}>
        <h1 className="gaming-category-hero__title">
          <span className="gaming-category-hero__th">{meta.th}</span>
          <span className="gaming-category-hero__en">{meta.en}</span>
        </h1>
      </div>

      <div className="gaming-games-layout w-full px-0 py-2 lg:px-4 lg:py-5">
        <GamingFilterSidebar meta={meta} providers={providers} resultCount={providers.length} resultUnit="ค่าย" />

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          {/* แถวหัว (เหมือน glass): [ปุ่มกลับวงกลม · ชื่อหมวด (จำนวนค่าย)] ชิดซ้าย · ช่องค้นหาชิดขวา */}
          <div className="flex min-w-0 items-center justify-between gap-3 px-3 py-1.5 lg:px-0">
            <div className="flex min-w-0 items-center gap-2.5">
              <Link href="/" className="cosmic-back-btn" aria-label="back">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div className="flex min-w-0 items-baseline gap-1.5">
                <h2 className="m-0 whitespace-nowrap text-base font-medium text-[var(--text-on-light)] sm:text-lg">{meta.th}</h2>
                <span className="whitespace-nowrap text-xs text-[var(--text-muted)]">
                  {t("categoryProviders.providerCount", { count: allProviders.length })}
                </span>
              </div>
            </div>
            <div className="w-[42%] min-w-0 shrink-0 sm:w-[38%] lg:w-72">
              <LobbySearchBar value={query} onChange={setQuery} placeholder={t(`categoryProviders.searchPlaceholder.${placeholderKey}`)} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:grid-cols-4 xl:grid-cols-6">
            {providers.map((entry, index) => (
              <Link
                key={entry.key}
                href={entry.href}
                aria-label={entry.title}
                className={gameCardEnterClassName("group block min-w-0 no-underline")}
                style={gameCardEnterStyle(index)}
              >
                <div className="gaming-provider-thumb relative grid aspect-square w-full place-items-center overflow-hidden transition duration-300 group-hover:-translate-y-1">
                  {entry.image ? (
                    <Image
                      src={entry.image}
                      alt=""
                      fill
                      sizes="(min-width: 1280px) 14vw, (min-width: 1024px) 20vw, 33vw"
                      className="object-cover transition group-hover:scale-[1.04]"
                      priority={index < 6}
                    />
                  ) : (
                    <span className="line-clamp-3 break-words px-2 text-center text-xs font-semibold text-[var(--text-muted)]">
                      {entry.title}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
