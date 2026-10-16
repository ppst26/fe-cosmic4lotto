"use client";

import React from "react";
import Image from "next/image";
import type {
  PromotionDetailBlock,
  PromotionDetailContent,
} from "@/app/types/promotions";
import { useT } from "@/lib/i18n/I18nProvider";
import { PromotionClaimFlow } from "./PromotionClaimFlow";

export type PromotionDetailPanelVariant = "page" | "hub";

/** ตัด emoji ออกจากข้อความรายละเอียดโปร — ห้ามแสดง emoji ในเนื้อหา */
function withoutEmoji(text: string): string {
  return text.replace(/\p{Extended_Pictographic}/gu, "").replace(/\s{2,}/g, " ").trim();
}

/** เนื้อหารายละเอียดโปรโมชั่น — ใช้ในหน้า /promotions/[id] (page) และ panel ขวาของ hub (hub) */
export function PromotionDetailPanel({
  content,
  variant = "page",
}: {
  content: PromotionDetailContent;
  variant?: PromotionDetailPanelVariant;
}) {
  const isHub = variant === "hub";
  return (
    <article className="overflow-hidden rounded-2xl border border-white/10 bg-[var(--BG-Surface-Normal)]">
      <PromotionDetailBanner content={content} isHub={isHub} />
      <PromotionDetailBody body={content} isHub={isHub} />
      <div className="px-4 pb-4">
        <PromotionClaimFlow content={content} />
      </div>
    </article>
  );
}

function PromotionDetailBanner({
  content,
  isHub,
}: {
  content: PromotionDetailContent;
  isHub: boolean;
}) {
  const hasBannerImage = Boolean(content.bannerSrc);

  return (
    <section aria-label={content.bannerTitle}>
      {hasBannerImage ? (
        <div className="relative aspect-[2.35/1] w-full overflow-hidden bg-[var(--BG-Surface-Darker)]">
          <Image
            src={content.bannerSrc!}
            alt=""
            fill
            sizes="(min-width: 1024px) 42vw, 100vw"
            className="object-cover object-center"
            priority
          />
        </div>
      ) : null}
      <div className="px-4 py-3">
        <h2 className="text-lg font-semibold leading-snug text-[var(--Text-Icon-Title)]">{content.bannerTitle}</h2>
        {isHub ? (
          <p className="mt-1 text-sm leading-relaxed text-[var(--Text-Icon-Body)]">
            {content.bannerSubtitle}
          </p>
        ) : null}
      </div>
    </section>
  );
}

function PromotionDetailBody({
  body,
  isHub,
}: {
  body: PromotionDetailContent;
  isHub: boolean;
}) {
  const t = useT("promotions");
  return (
    <section
      className="space-y-4 border-t border-white/10 px-4 py-4"
      aria-label={t("detail.title")}
    >
      <h3 className="text-base font-semibold text-[var(--Text-Icon-Title)]">{t("detail.heading")}</h3>
      <div className="space-y-4">
        {body.blocks.map((block, index) => (
          <PromotionDetailBlockRow key={`${block.title}-${index}`} block={block} isHub={isHub} />
        ))}
      </div>
      <p className="text-xs leading-relaxed text-[var(--Text-Icon-Body)]">
        {withoutEmoji(body.footerNote)}
      </p>
    </section>
  );
}

function PromotionDetailBlockRow({
  block,
  isHub,
}: {
  block: PromotionDetailBlock;
  isHub: boolean;
}) {
  const title = withoutEmoji(block.title);
  const description = block.description ? withoutEmoji(block.description) : undefined;
  const bullets = block.bullets?.map((line) => withoutEmoji(line)).filter(Boolean);
  const textSize = isHub ? "text-sm" : "text-xs";

  return (
    <>
      {block.showDividerBefore ? <hr className="border-white/10" /> : null}
      <div className="min-w-0">
        <h4 className="text-sm font-semibold text-[var(--Text-Icon-Title)]">{title}</h4>
        {description ? (
          <p className={`mt-1.5 ${textSize} leading-relaxed text-[var(--Text-Icon-Body)]`}>
            {description}
          </p>
        ) : null}
        {bullets && bullets.length > 0 ? (
          <ul className={`mt-2 space-y-1.5 ${textSize} leading-relaxed text-[var(--Text-Icon-Body)]`}>
            {bullets.map((line) => (
              <li key={line} className="flex gap-2">
                <span className="text-[var(--Main-Primary)]" aria-hidden="true">•</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </>
  );
}
