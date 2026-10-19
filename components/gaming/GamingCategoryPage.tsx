"use client";

import Image from "next/image";
import Link from "@/lib/i18n/navigation";
import { gameCardEnterClassName, gameCardEnterStyle } from "@/lib/gameCardEnterMotion";
import { GamingFilterSidebar } from "./GamingFilterSidebar";
import { GAMING_CATEGORIES, getGamingProviders, type GamingCategoryId } from "./gaming-category";

/**
 * หน้าหมวดเกมแบบ standalone (/slots · /casino · /fishing · /sport · /cards)
 * desktop: hero ชื่อหมวด + sidebar ตัวกรอง + กริดค่าย · มือถือ: เมนูหมวด + กริดค่าย
 * กดการ์ดค่ายเพื่อเข้าไปดูเกมในค่าย (คาสิโนเข้าหน้าเล่นตรง)
 */
export function GamingCategoryPage({ categoryId }: { categoryId: GamingCategoryId }) {
  const meta = GAMING_CATEGORIES[categoryId];
  const providers = getGamingProviders(categoryId);

  return (
    <>
      <div className="gaming-category-hero" data-category={categoryId}>
        <h1 className="gaming-category-hero__title">
          <span className="gaming-category-hero__th">{meta.th}</span>
          <span className="gaming-category-hero__en">{meta.en}</span>
        </h1>
      </div>

      <div className="gaming-games-layout w-full px-4 py-3 lg:py-5">
        <GamingFilterSidebar meta={meta} providers={providers} resultCount={providers.length} resultUnit="ค่าย" />

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <h2 className="text-base font-semibold text-[var(--text-on-light)] sm:text-xl">
            {meta.th} <span className="text-[var(--text-muted)]">({providers.length.toLocaleString("en-US")} ค่าย)</span>
          </h2>

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
