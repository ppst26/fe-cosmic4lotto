"use client";

import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import Link from "@/lib/i18n/navigation";
import type { PromotionDetailBlock } from "@/app/types/promotions";
import { usePromotionDetail } from "@/app/hooks/api/promotions";
import {
  getPromotionTargets,
  MOCK_PROGRESS_RATIO,
  useMyPromotions,
  type ClaimedPromotion,
} from "@/lib/promotions/myPromotions";
import { formatBaht, formatDateTimeShort } from "@/lib/format";
import { promotionDetailHref } from "./promotionDetailHref";
import { useT } from "@/lib/i18n/I18nProvider";

const DAY_MS = 24 * 60 * 60 * 1000;

/** ตัด emoji ออกจากข้อความเงื่อนไข (เหมือน PromotionDetailPanel) */
function plain(text: string): string {
  return text.replace(/\p{Extended_Pictographic}/gu, "").replace(/\s{2,}/g, " ").trim();
}

/**
 * โปรโมชั่นของฉัน — รายการโปรที่กดรับ + เงื่อนไข + progress ฝาก / เทิร์นโอเวอร์
 * ใช้ในหน้า /promotions (แท็บ "โปรโมชั่นของฉัน") — logic เดียวกับ glass
 */
export function MyPromotionsPanel() {
  const t = useT("promotions");
  const items = useMyPromotions();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-[var(--BG-Surface-Normal)] px-4 py-10 text-center">
        <p className="text-base font-semibold text-[var(--Text-Icon-Title)]">{t("my.empty")}</p>
        <p className="text-sm text-[var(--Text-Icon-Body)]">{t("my.emptyDesc")}</p>
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-3 pb-4" aria-label={t("my.title")}>
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="text-base font-semibold text-[var(--Text-Icon-Title)] sm:text-lg">{t("my.title")}</h2>
        <span className="text-xs text-[var(--text-muted)]">{t("my.count", { n: items.length })}</span>
      </div>
      <ul className="m-0 grid list-none grid-cols-1 gap-3 p-0 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.id} className="min-w-0">
            <MyPromotionCard item={item} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function MyPromotionCard({ item }: { item: ClaimedPromotion }) {
  const t = useT("promotions");
  const [open, setOpen] = useState(false);
  const targets = getPromotionTargets(item.id);
  const completed =
    (!targets.deposit || MOCK_PROGRESS_RATIO.deposit >= 1) &&
    (!targets.turnover || MOCK_PROGRESS_RATIO.turnover >= 1);
  const expires = new Date(new Date(item.claimedAt).getTime() + targets.validDays * DAY_MS).toISOString();

  return (
    <article className="h-full rounded-2xl border border-white/10 bg-[var(--Card-Normal)] p-3.5 sm:p-4">
      <header className="flex items-start justify-between gap-2">
        <h3 className="min-w-0 text-sm font-semibold leading-snug text-[var(--Text-Icon-Title)] sm:text-base">
          {item.title}
        </h3>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
            completed ? "bg-emerald-500/15 text-emerald-400" : "bg-[var(--brand-soft)] text-[var(--brand)]"
          }`}
        >
          {completed ? t("my.completed") : t("my.active")}
        </span>
      </header>
      <p className="mt-1 text-[11px] leading-relaxed text-[var(--text-muted)] sm:text-xs">
        {t("my.claimedAt", { date: formatDateTimeShort(item.claimedAt, " · ") })} ·{" "}
        {t("my.expiresAt", { date: formatDateTimeShort(expires, " · ") })}
      </p>

      <div className="mt-3 flex flex-col gap-3">
        {targets.deposit ? (
          <ProgressRow label={t("my.deposit")} ratio={MOCK_PROGRESS_RATIO.deposit} target={targets.deposit} />
        ) : null}
        {targets.turnover ? (
          <ProgressRow label={t("my.turnover")} ratio={MOCK_PROGRESS_RATIO.turnover} target={targets.turnover} />
        ) : null}
      </div>

      <button
        type="button"
        className="mt-3 flex w-full cursor-pointer items-center justify-between gap-2 border-0 border-t border-white/10 bg-transparent pt-2.5 text-xs font-bold text-[var(--Text-Icon-Body)]"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? t("my.hideConditions") : t("my.showConditions")}
        <ChevronRight className={`h-4 w-4 transition-transform ${open ? "rotate-90" : ""}`} />
      </button>

      {open ? <ConditionList id={item.id} /> : null}
    </article>
  );
}

function ProgressRow({ label, ratio, target }: { label: string; ratio: number; target: number }) {
  const t = useT("promotions");
  const current = Math.round(target * Math.min(ratio, 1));
  const pct = Math.round(Math.min(ratio, 1) * 100);
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2 text-xs">
        <span className="text-[var(--Text-Icon-Body)]">{label}</span>
        <span className="tabular-nums text-[var(--Text-Icon-Title)]">
          {formatBaht(current)} / {formatBaht(target)}
        </span>
      </div>
      <div
        className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-[var(--BG-Surface-Darker)]"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
      >
        <div
          className="h-full rounded-full bg-[var(--brand)]"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-1 text-[11px] tabular-nums text-[var(--text-muted)]">
        {pct}%{pct < 100 ? ` · ${t("my.remaining", { amount: formatBaht(target - current) })}` : ""}
      </p>
    </div>
  );
}

function ConditionList({ id }: { id: ClaimedPromotion["id"] }) {
  const t = useT("promotions");
  const detail = usePromotionDetail(id);
  const blocks: PromotionDetailBlock[] = detail.data?.blocks ?? [];

  return (
    <div className="mt-2 flex flex-col gap-2.5">
      {blocks.map((block, index) => (
        <div key={`${block.title}-${index}`}>
          <p className="text-xs font-bold text-[var(--Text-Icon-Title)]">{plain(block.title)}</p>
          {block.description ? (
            <p className="mt-0.5 text-xs leading-relaxed text-[var(--Text-Icon-Body)]">{plain(block.description)}</p>
          ) : null}
          {block.bullets?.length ? (
            <ul className="m-0 mt-1 list-none space-y-1 p-0 text-xs leading-relaxed text-[var(--Text-Icon-Body)]">
              {block.bullets.map((line) => (
                <li key={line} className="flex gap-2">
                  <span className="text-[var(--Main-Primary)]" aria-hidden="true">•</span>
                  <span>{plain(line)}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ))}
      <Link
        href={promotionDetailHref(id)}
        className="soft-btn-primary mt-1 flex h-9 items-center justify-center self-center px-5 text-sm font-extrabold no-underline"
      >
        {t("my.viewDetail")}
      </Link>
    </div>
  );
}
