"use client";

import Image from "next/image";
import { GEMS_STORE_GEM_ASSET } from "@/app/data/gemsStoreMockData";
import { formatGemsBalance } from "@/lib/format";
import type { GemsStorePackage } from "@/app/types/reward";
import { SoftDialog } from "@/app/components/ui/SoftDialog";
import { useT } from "@/lib/i18n/I18nProvider";

function formatCreditAmount(value: number): string {
  return new Intl.NumberFormat("th-TH").format(value);
}

export interface GemsRedeemConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pkg: GemsStorePackage | null;
  gemsBalance: number;
  loading?: boolean;
  onConfirm: () => void | Promise<void>;
}

/** ยืนยันแลกเพชรเป็นเครดิต — เปิดจาก GemsStorePageContent ก่อนหักยอด (portal ไป body ที่ z-[100]) */
export function GemsRedeemConfirmDialog({
  open,
  onOpenChange,
  pkg,
  gemsBalance,
  loading = false,
  onConfirm,
}: GemsRedeemConfirmDialogProps) {
  const t = useT("rewards");
  const credits = pkg?.credits ?? 0;
  const gemsCost = pkg?.gemsCost ?? 0;
  const balanceAfter = gemsBalance - gemsCost;
  const title = t("gemsStore.confirm.title", { amount: formatCreditAmount(credits) });

  return (
    <SoftDialog
      open={open && pkg != null}
      onClose={() => onOpenChange(false)}
      title={title}
      locked={loading}
      closeLabel={t("actions.close")}
    >
      <div className="flex items-start justify-between gap-3 pr-10">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-[var(--text-on-light)]">{title}</h3>
          <p className="mt-0.5 text-xs text-[var(--text-muted)]">
            {t("gemsStore.confirm.subtitle", {
              gems: formatGemsBalance(gemsCost),
              credits: formatCreditAmount(credits),
            })}
          </p>
        </div>
      </div>
      <div className="mt-2 text-right">
        <p className="text-2xl font-semibold tabular-nums text-[var(--brand)]">+{formatCreditAmount(credits)}</p>
        <p className="text-xs text-[var(--text-muted)]">{t("gemsStore.confirm.creditsLabel")}</p>
      </div>

      <dl className="my-3 space-y-2.5 rounded-lg border border-white/10 bg-[var(--soft-surface)] p-3.5 text-xs sm:text-[13px]">
        <div className="flex items-center justify-between text-[var(--text-muted)]">
          <dt className="flex items-center gap-1.5">
            <span className="relative h-4 w-4" aria-hidden="true">
              <Image src={GEMS_STORE_GEM_ASSET} alt="" fill sizes="16px" className="object-contain" />
            </span>
            {t("gemsStore.confirm.gemsUsed")}
          </dt>
          <dd className="font-semibold tabular-nums text-[var(--text-on-light)]">{formatGemsBalance(gemsCost)}</dd>
        </div>
        <div className="h-px bg-white/10" />
        <div className="flex items-center justify-between text-[var(--text-muted)]">
          <dt className="flex items-center gap-1.5">
            <span className="relative h-4 w-4" aria-hidden="true">
              <Image src={GEMS_STORE_GEM_ASSET} alt="" fill sizes="16px" className="object-contain" />
            </span>
            {t("gemsStore.confirm.balanceAfter")}
          </dt>
          <dd className="font-semibold tabular-nums text-[var(--text-on-light)]">{formatGemsBalance(balanceAfter)}</dd>
        </div>
      </dl>

      <div className="flex items-center gap-2.5 pt-1">
        <button
          type="button"
          disabled={loading}
          onClick={() => onOpenChange(false)}
          className="h-11 flex-1 cursor-pointer rounded-lg border border-white/10 bg-[var(--soft-surface)] text-sm font-semibold text-[var(--text-on-light)] transition-colors hover:bg-[var(--soft-card-elevated)] disabled:opacity-50"
        >
          {t("gemsStore.confirm.cancel")}
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => void onConfirm()}
          className="soft-btn-primary h-11 flex-1 cursor-pointer text-sm font-semibold transition-transform active:scale-95 disabled:opacity-60"
        >
          {loading ? t("gemsStore.confirm.processing") : t("gemsStore.confirm.confirm")}
        </button>
      </div>
    </SoftDialog>
  );
}
