"use client";

import Image from "next/image";
import { SoftDialog } from "@/app/components/ui/SoftDialog";
import { useT } from "@/lib/i18n/I18nProvider";
import { useFormat } from "@/lib/i18n/useFormat";

export interface DailyCheckInClaimSuccessDialogProps {
  open: boolean;
  credits: number;
  onOpenChange: (open: boolean) => void;
}

/** แจ้งรับรางวัลเช็คอินสำเร็จ — เปิดจาก DailyCheckInPageContent หลังกดรับ */
export function DailyCheckInClaimSuccessDialog({ open, credits, onOpenChange }: DailyCheckInClaimSuccessDialogProps) {
  const t = useT("rewards");
  const fmt = useFormat();
  const descAfter = t("checkIn.success.descAfter");

  return (
    <SoftDialog
      open={open}
      onClose={() => onOpenChange(false)}
      title={t("checkIn.success.title")}
      closeLabel={t("actions.close")}
    >
      <div className="flex flex-col items-center pt-2 text-center">
        <div
          className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[var(--brand-soft)]"
          aria-hidden="true"
        >
          <div className="relative h-9 w-9">
            <Image src="/assets/check-in/diamond.avif" alt="" fill sizes="36px" className="object-contain" />
          </div>
        </div>
        <h3 className="mt-4 text-lg font-bold text-[var(--text-on-light)]">{t("checkIn.success.title")}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-muted)]">
          {t("checkIn.success.descBefore")}{" "}
          <span className="font-bold text-[var(--brand-strong)]">{fmt.gems(credits)}</span>
          {descAfter ? ` ${descAfter}` : null}
        </p>
      </div>
      <button
        type="button"
        onClick={() => onOpenChange(false)}
        className="soft-btn-primary mt-6 flex h-12 w-full items-center justify-center text-base font-semibold"
      >
        {t("actions.ok")}
      </button>
    </SoftDialog>
  );
}
