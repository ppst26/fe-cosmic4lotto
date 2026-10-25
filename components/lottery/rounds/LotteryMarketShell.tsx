"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "@/lib/i18n/navigation";
import { useContainedVerticalScroll } from "./useContainedVerticalScroll";
import type { LotteryCatalogEntry } from "@/app/types/lottery";
import { useLotteryCatalog } from "@/app/hooks/api/lottery";
import { getLotteryIconSrc } from "@/app/data/lotteryIconAssets";
import { LotteryCountdown } from "@/components/lottery/hub/LotteryFlagOrb";
import { LotteryMarketIcon } from "@/components/lottery/hub/LotteryMarketIcon";
import { cn } from "@/lib/utils";
import { useLotteryI18n } from "@/app/components/lottery/useLotteryI18n";
import { lotteryRulesHref } from "@/lib/lottery/rules";

interface LotteryMarketShellProps {
  activeEntry: LotteryCatalogEntry;
  roundCount: number;
  children: React.ReactNode;
}

/**
 * Step 2 หวย — sidebar เลือกประเภท + banner หัวตลาด + พื้นที่รายการรอบ
 * โครง layout มือถือ/เดสก์ท็อปใช้ Tailwind — สไตล์การ์ด/สถานะอยู่ใน lottery.css
 */
export function LotteryMarketShell({ activeEntry, roundCount, children }: LotteryMarketShellProps) {
  const { t } = useLotteryI18n();
  const catalog = useLotteryCatalog();
  const sidebarScrollRef = useRef<HTMLDivElement>(null);
  const roundsScrollRef = useRef<HTMLDivElement>(null);
  const bannerArtSrc = getLotteryIconSrc(activeEntry.slug);
  useContainedVerticalScroll(sidebarScrollRef);
  useContainedVerticalScroll(roundsScrollRef);

  return (
    <div
      className={cn(
        "lottery-market-shell",
        "grid min-h-0 items-stretch overflow-hidden border-0 bg-[var(--lottery-shell-fill)]",
        "max-lg:h-full max-lg:max-h-full max-lg:min-h-0 max-lg:flex-1 max-lg:basis-auto",
        "max-lg:gap-2 max-lg:rounded-none max-lg:p-2 max-lg:shadow-none",
        "max-lg:grid-cols-[minmax(0,clamp(6.75rem,31vw,8.25rem))_minmax(0,1fr)] max-lg:grid-rows-[minmax(0,1fr)]",
        "max-lg:[&>*]:min-h-0",
        "lg:gap-4 lg:rounded-[var(--radius-panel)] lg:p-4 lg:shadow-[0_12px_40px_rgb(0_0_0/0.18)]",
        "lg:grid-cols-[minmax(0,248px)_minmax(0,1fr)] lg:grid-rows-[minmax(0,1fr)]",
        "lg:h-[min(calc(100dvh-7.5rem),50rem)] lg:max-h-[min(calc(100dvh-7.5rem),50rem)]",
        "lg:[&>*]:min-h-0",
      )}
    >
      <aside
        className={cn(
          "lottery-market-sidebar",
          "flex min-h-0 min-w-0 flex-col",
          "max-lg:h-full max-lg:max-h-full max-lg:overflow-hidden",
          "lg:h-full",
        )}
        aria-label={t("market.sidebarAria")}
      >
        <div
          ref={sidebarScrollRef}
          className={cn(
            "lottery-market-sidebar__panel lottery-market-scroll",
            "min-h-0 flex-1 basis-auto rounded-[calc(var(--radius-panel)-2px)] border border-transparent bg-transparent",
            "max-lg:touch-pan-y max-lg:overflow-x-hidden max-lg:overflow-y-auto max-lg:p-0 max-lg:pb-3",
            "lg:overflow-x-hidden lg:overflow-y-auto lg:p-2 lg:pr-1",
          )}
        >
          <ul
            className={cn(
              "lottery-market-sidebar__list",
              "m-0 flex list-none flex-col gap-1 p-0 lg:gap-2",
            )}
          >
            {(catalog.data ?? []).map((entry) => (
              <li key={entry.slug}>
                <LotteryMarketSidebarLink
                  entry={entry}
                  isActive={entry.slug === activeEntry.slug}
                />
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <div
        className={cn(
          "lottery-market-main min-h-0 min-w-0",
          "max-lg:grid max-lg:h-full max-lg:max-h-full max-lg:grid-cols-[minmax(0,1fr)] max-lg:grid-rows-[auto_minmax(0,1fr)] max-lg:gap-3 max-lg:overflow-hidden max-lg:p-0",
          "lg:flex lg:h-full lg:flex-col lg:overflow-hidden lg:px-1 lg:py-2",
        )}
      >
        <header
          className={cn(
            "lottery-market-banner",
            "flex shrink-0 flex-nowrap items-center border-0 bg-[var(--lottery-card-fill)]",
            "max-lg:relative max-lg:z-[2] max-lg:min-h-[4.5rem] max-lg:items-center max-lg:justify-end max-lg:overflow-hidden",
            "max-lg:rounded-[calc(var(--radius-panel)-4px)] max-lg:px-3 max-lg:py-3",
            "max-lg:shadow-[0_1px_0_rgb(255_255_255/0.06)]",
            "lg:gap-2 lg:rounded-[var(--radius-panel)] lg:p-4",
            "[&>.lottery-flag]:max-lg:hidden",
            bannerArtSrc && "lottery-market-banner--has-art",
          )}
        >
          {bannerArtSrc ? (
            <span className="lottery-market-banner__bg max-lg:block lg:hidden" aria-hidden>
              <Image
                src={bannerArtSrc}
                alt=""
                fill
                sizes="(max-width: 1023px) 10rem, 0"
                className="lottery-market-banner__bg-img"
                preload
              />
            </span>
          ) : null}
          <LotteryMarketIcon
            marketSlug={activeEntry.slug}
            size="lg"
            fallbackLabel={activeEntry.flagLabel}
            fallbackTone={activeEntry.flagTone}
            className={cn(
              "lottery-market-banner__icon shrink-0",
              bannerArtSrc && "max-lg:hidden",
            )}
          />
          <div
            className={cn(
              "lottery-market-banner__body relative z-[1] min-w-0 flex-1",
              "max-lg:flex max-lg:max-w-[62%] max-lg:flex-col max-lg:items-end max-lg:text-right",
              "lg:text-left",
            )}
          >
            <h1
              className={cn(
                "lottery-market-banner__title m-0 text-[var(--text-on-light)]",
                "max-lg:text-xl max-lg:font-medium max-lg:leading-tight",
                "lg:text-base lg:font-medium lg:leading-snug",
              )}
             
            >
              {t(activeEntry.titleKey)}
            </h1>
            <Link
              href={lotteryRulesHref(activeEntry.slug)}
              className={cn(
                "lottery-market-banner__rules text-[var(--text-muted)] no-underline hover:text-[var(--brand)] hover:underline",
                "max-lg:mt-1 max-lg:block max-lg:leading-snug",
                "lg:mt-1 lg:inline-block lg:text-xs",
              )}
            >
              {t("market.rules")}
            </Link>
          </div>
        </header>

        <p className="lottery-market-round-count mb-3 text-[var(--text-muted)] max-lg:hidden">
          {t("rounds.openCountPrefix")}{" "}
          <span className="lottery-market-round-count__n text-[var(--text-on-light)]">{roundCount}</span>{" "}
          {t("rounds.openCountSuffix")}
        </p>

        <div
          ref={roundsScrollRef}
          className={cn(
            "lottery-market-rounds-scroll lottery-market-scroll",
            "min-h-0 flex-1 overflow-x-hidden overflow-y-auto pr-0.5 pb-1",
            "max-lg:row-start-2 max-lg:max-h-full max-lg:touch-pan-y max-lg:pb-3",
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

/** การ์ดประเภทหวยใน sidebar — รูปเป็นพื้นหลังซ้าย (ล้น) · ข้อความชิดขวา */
function LotteryMarketSidebarLink({
  entry,
  isActive,
}: {
  entry: LotteryCatalogEntry;
  isActive: boolean;
}) {
  const { t, label } = useLotteryI18n();
  const iconSrc = getLotteryIconSrc(entry.slug);

  return (
    <Link
      href={entry.roundsHref}
      className={cn(
        "lottery-market-sidebar__item",
        "relative flex min-h-[4.35rem] items-center justify-end overflow-hidden rounded-[var(--radius-panel)]",
        "no-underline text-inherit transition-[background,box-shadow] duration-[var(--motion-fast)] ease-linear",
        "px-2 py-2 lg:min-h-[3.5rem] lg:px-3 lg:py-2.5",
        isActive && "is-active",
        entry.status === "closed" && "is-closed",
        iconSrc && "lottery-market-sidebar__item--has-art",
      )}
      aria-current={isActive ? "page" : undefined}
    >
      {iconSrc ? (
        <span className="lottery-market-sidebar__bg" aria-hidden>
          <Image
            src={iconSrc}
            alt=""
            fill
            sizes="(max-width: 1023px) 7rem, 11rem"
            className="lottery-market-sidebar__bg-img"
            preload={isActive}
            loading="eager"
          />
        </span>
      ) : (
        <LotteryMarketIcon
          marketSlug={entry.slug}
          size="sm"
          fallbackLabel={entry.flagLabel}
          fallbackTone={entry.flagTone}
          className="lottery-market-sidebar__fallback-icon relative z-[1] shrink-0"
        />
      )}
      <span className="lottery-market-sidebar__text relative z-[1] flex min-w-0 flex-col items-end gap-0.5 text-right">
        <span
          className={cn(
            "lottery-market-sidebar__title text-[var(--text-on-light)]",
            "line-clamp-2 max-w-full leading-tight lg:leading-snug",
          )}
        >
          {t(entry.titleKey)}
        </span>
        {entry.status === "closed" ? (
          <span className="lottery-market-sidebar__meta text-[var(--text-muted)]">{t("status.closed")}</span>
        ) : (
          <LotteryCountdown
            label={label(entry.statusLabel)}
            className="justify-end gap-0.5 [&_svg]:size-3"
          />
        )}
      </span>
    </Link>
  );
}
