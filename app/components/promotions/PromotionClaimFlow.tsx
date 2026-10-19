"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";
import type { PromotionDetailContent } from "@/app/types/promotions";
import { SoftDialog } from "@/app/components/ui/SoftDialog";
import { useRequireAuthAction } from "@/app/hooks/useRequireAuthAction";
import { claimPromotion, useMyPromotions } from "@/lib/promotions/myPromotions";
import { useT } from "@/lib/i18n/I18nProvider";

/**
 * ปุ่มรับโปรโมชั่น → confirm → alert รับสำเร็จ — ใช้ท้าย PromotionDetailPanel
 * (flow เดียวกับ glass: ต้องล็อกอิน · mock เก็บสถานะ "รับแล้ว" ใน localStorage ผ่าน myPromotions)
 */
export function PromotionClaimFlow({ content }: { content: PromotionDetailContent }) {
  const t = useT("promotions");
  const tc = useT("common");
  const tRewards = useT("rewards");
  const { runWithAuth } = useRequireAuthAction();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const claimed = useMyPromotions().some((item) => item.id === content.id);

  const title = content.bannerTitle;

  return (
    <div className="flex justify-center">
      <button
        type="button"
        disabled={claimed}
        className="soft-btn-primary flex h-10 cursor-pointer items-center justify-center px-6 text-sm font-semibold transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
        onClick={() => runWithAuth(true, () => setConfirmOpen(true))}
      >
        {claimed ? t("detail.claim.claimed") : t("detail.claim.button")}
      </button>

      <SoftDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title={t("detail.claim.confirm.title")}
        closeLabel={tRewards("actions.close")}
      >
        <div className="pr-10">
          <h3 className="text-lg font-semibold text-[var(--text-on-light)]">{t("detail.claim.confirm.title")}</h3>
          <p className="mt-1 text-sm leading-relaxed text-[var(--text-muted)]">
            {t("detail.claim.confirm.description", { title })}
          </p>
        </div>
        <div className="mt-5 flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setConfirmOpen(false)}
            className="h-11 flex-1 cursor-pointer rounded-lg border border-white/10 bg-[var(--soft-surface)] text-sm font-semibold text-[var(--text-on-light)] transition-colors hover:bg-[var(--soft-card-elevated)]"
          >
            {tc("cancel")}
          </button>
          <button
            type="button"
            onClick={() => {
              setConfirmOpen(false);
              claimPromotion(content.id, title);
              setSuccessOpen(true);
            }}
            className="soft-btn-primary h-11 flex-1 cursor-pointer text-sm font-semibold transition-transform active:scale-95"
          >
            {tc("confirm")}
          </button>
        </div>
      </SoftDialog>

      <SoftDialog
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        title={t("detail.claim.success.title")}
        closeLabel={tRewards("actions.close")}
      >
        <div className="flex flex-col items-center pt-2 text-center">
          <span
            className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white"
            aria-hidden="true"
          >
            <Check className="h-8 w-8 stroke-[3]" />
          </span>
          <h3 className="mt-4 text-lg font-semibold text-[var(--text-on-light)]">{t("detail.claim.success.title")}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-muted)]">
            {t("detail.claim.success.description", { title })}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setSuccessOpen(false)}
          className="soft-btn-primary mt-6 flex h-12 w-full items-center justify-center text-base font-semibold"
        >
          {t("detail.claim.success.ok")}
        </button>
      </SoftDialog>
    </div>
  );
}
