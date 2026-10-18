"use client";

import Image from "next/image";
import Link from "@/lib/i18n/navigation";
import type { GamingCategoryMeta, GamingProviderEntry } from "./gaming-category";

type Props = {
  meta: GamingCategoryMeta;
  providers: GamingProviderEntry[];
  resultCount: number;
  resultUnit: string;
};

/**
 * Sidebar "ตัวกรอง" ฝั่งซ้ายของหน้าหมวดเกม (desktop) — หัวสี + โลโก้ค่าย (สล็อต/ยิงปลา/เกมไพ่) + จำนวนผลลัพธ์ + ปุ่มล้าง
 */
export function GamingFilterSidebar({ meta, providers, resultCount, resultUnit }: Props) {
  return (
    <aside className="gaming-filter-sidebar hidden w-[15rem] shrink-0 self-start lg:block xl:w-[17rem]">
      <div className="gaming-filter-head px-4 py-3.5 text-center text-base font-extrabold">ตัวกรอง</div>

      {meta.showLogos ? (
        <>
          <div className="gaming-filter-bar flex items-center justify-between px-4 py-1.5 text-[11px]">
            <span className="font-extrabold">ค้นหาค่ายเกม</span>
            <span className="opacity-80">เลือกอย่างใดอย่างหนึ่ง</span>
          </div>
          <div className="gaming-filter-logos grid max-h-[26rem] grid-cols-3 gap-2 overflow-y-auto p-3">
            {providers.map((p) => (
              <Link key={p.key} href={p.href} title={p.title} className="gaming-filter-tile relative block aspect-[3/2] overflow-hidden">
                {p.image ? (
                  <Image src={p.image} alt="" fill sizes="72px" className="object-cover" />
                ) : (
                  <span className="grid h-full place-items-center px-1 text-center text-[9px] font-bold leading-tight">{p.title}</span>
                )}
              </Link>
            ))}
          </div>
        </>
      ) : null}

      <div className="space-y-3 p-3 pt-2">
        <div className="gaming-filter-result flex items-center justify-between rounded-xl px-3.5 py-3 text-sm">
          <span>พบเกมส์ที่คุณค้นหา</span>
          <span className="font-bold">
            {resultCount.toLocaleString("en-US")} {resultUnit}
          </span>
        </div>
        <Link
          href={meta.basePath}
          className="gaming-filter-clear flex h-11 w-full items-center justify-center rounded-xl text-sm font-extrabold no-underline"
        >
          ล้าง
        </Link>
      </div>
    </aside>
  );
}
