"use client";

import React from "react";
import Image from "next/image";
import Link from "@/lib/i18n/navigation";
import type { LotteryFlagTone } from "@/app/types/lottery";
import { getLotteryIconSrc } from "@/app/data/lotteryIconAssets";
import { useLotteryI18n } from "@/app/components/lottery/useLotteryI18n";
import { cn } from "@/lib/utils";
import { LotteryCountdown } from "./LotteryFlagOrb";
import { LotteryMarketIcon } from "./LotteryMarketIcon";

type LotteryHubMarketLinkProps = {
  href: string;
  marketSlug: string;
  title: string;
  fallbackLabel: string;
  fallbackTone: LotteryFlagTone;
  variant: "feature" | "type";
  countdownLabel?: string;
  closedLabel?: string;
  isClosed?: boolean;
};

/**
 * การ์ดหวยใน hub — รูปประเภทเป็นพื้นหลังซ้ายล้น · ข้อความชิดขวา (layout เดียวกับ glass)
 * ใช้ใน LotteryHubContent
 */
export function LotteryHubMarketLink({
  href,
  marketSlug,
  title,
  fallbackLabel,
  fallbackTone,
  variant,
  countdownLabel,
  closedLabel,
  isClosed = false,
}: LotteryHubMarketLinkProps) {
  const { t } = useLotteryI18n();
  const iconSrc = getLotteryIconSrc(marketSlug);
  const isFeature = variant === "feature";

  return (
    <Link
      href={href}
      className={cn(
        "lottery-hub-market-card relative flex items-center justify-end overflow-hidden text-inherit no-underline",
        iconSrc && "lottery-hub-market-card--has-art",
        isFeature
          ? "lottery-feature-card lottery-hub-market-card--feature min-h-[5.5rem] px-3 py-3 sm:px-4"
          : "lottery-type-card lottery-hub-market-card--type min-h-[4.25rem] px-2 py-2 sm:px-2.5",
        isClosed && "is-closed",
      )}
    >
      {iconSrc ? (
        <span className="lottery-hub-market-card__bg" aria-hidden>
          <Image
            src={iconSrc}
            alt=""
            fill
            sizes={isFeature ? "(max-width: 640px) 9rem, 7rem" : "(max-width: 640px) 6.5rem, 5rem"}
            className="lottery-hub-market-card__bg-img"
            priority={isFeature}
          />
        </span>
      ) : (
        <LotteryMarketIcon
          marketSlug={marketSlug}
          size={isFeature ? "feature" : "sm"}
          fallbackLabel={fallbackLabel}
          fallbackTone={fallbackTone}
          className="relative z-[1] mr-2 shrink-0 self-center"
        />
      )}

      <span
        className={cn(
          "lottery-hub-market-card__text relative z-[1] flex min-w-0 flex-col gap-[0.2rem]",
          iconSrc ? "items-end text-right" : "items-start text-left",
        )}
      >
        <span className={isFeature ? "lottery-feature-card__title" : "lottery-type-card__title"}>
          {title}
        </span>
        {isClosed ? (
          <span className="lottery-type-card__closed">{closedLabel ?? t("status.closed")}</span>
        ) : countdownLabel ? (
          <LotteryCountdown label={countdownLabel} />
        ) : null}
      </span>
    </Link>
  );
}
