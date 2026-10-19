"use client";

import { useState } from "react";
import Image from "next/image";
import { GEMS_STORE_GEM_ASSET } from "@/app/data/gemsStoreMockData";
import type { GemsStoreData } from "@/lib/api/gemsStore";
import { useGemsStore } from "@/app/hooks/api/member";
import { ResourceGate } from "@/app/components/ui/ResourceGate";
import { formatGemsBalance } from "@/lib/format";
import type { GemsStorePackage } from "@/app/types/reward";
import { useT } from "@/lib/i18n/I18nProvider";
import { useFormat } from "@/lib/i18n/useFormat";
import { GemsStoreSummaryCard } from "./GemsStoreSummaryCard";
import { GemsRedeemConfirmDialog } from "./GemsRedeemConfirmDialog";

/** เนื้อหาหน้าร้านค้า Gems — ใช้ใน /gems-store และ hub modal */
export function GemsStorePageContent({
  initialBalance,
  embedded = false,
}: {
  initialBalance?: number;
  embedded?: boolean;
}) {
  const t = useT("rewards");
  const gemsStore = useGemsStore();
  return (
    <ResourceGate resource={gemsStore} loadingLabel={t("gemsStore.loading")} errorTitle={t("gemsStore.loadError")}>
      {(data) => <GemsStoreView gemsStore={data} initialBalance={initialBalance} embedded={embedded} />}
    </ResourceGate>
  );
}

/** เนื้อหาหลังโหลดเสร็จ — ยอดเพชรเริ่มต้นจาก API แล้วหักในเครื่องหลังแลก (เหมือน glass) */
function GemsStoreView({
  gemsStore,
  initialBalance,
  embedded,
}: {
  gemsStore: GemsStoreData;
  initialBalance?: number;
  embedded: boolean;
}) {
  const t = useT("rewards");
  const [gemsBalance, setGemsBalance] = useState(initialBalance ?? gemsStore.balance);
  const [termsOpen, setTermsOpen] = useState(false);
  const [confirmPkg, setConfirmPkg] = useState<GemsStorePackage | null>(null);
  const [redeemLoading, setRedeemLoading] = useState(false);

  const openRedeemConfirm = (pkg: GemsStorePackage) => {
    if (gemsBalance < pkg.gemsCost) return;
    setConfirmPkg(pkg);
  };

  const handleConfirmRedeem = async () => {
    if (!confirmPkg || gemsBalance < confirmPkg.gemsCost) return;
    setRedeemLoading(true);
    try {
      setGemsBalance((prev) => prev - confirmPkg.gemsCost);
      setConfirmPkg(null);
    } finally {
      setRedeemLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <GemsStoreSummaryCard gemsBalance={gemsBalance} store={gemsStore} />

      {/* ใน hub modal ไม่แสดงเงื่อนไข (เหมือน glass) */}
      {!embedded ? (
        <section className="overflow-hidden">
          <button
            type="button"
            onClick={() => setTermsOpen((open) => !open)}
            className="h-10 w-full rounded-[var(--radius-soft-sm)] border border-white/10 bg-[var(--soft-card)] text-sm font-semibold text-[var(--text-on-light)]"
            aria-expanded={termsOpen}
          >
            {t("gemsStore.termsTitle")}
          </button>
          {termsOpen ? (
            <ul className="soft-panel mt-2 space-y-2 p-3 text-sm text-[var(--text-muted)]">
              {gemsStore.terms.map((line) => (
                <li key={line} className="flex gap-2">
                  <span aria-hidden="true">•</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      <section aria-labelledby="gems-store-redeem-heading">
        <h2 id="gems-store-redeem-heading" className="mb-2 px-0.5 text-sm font-semibold text-[var(--text-muted)]">
          {t("gemsStore.redeemHeading")}
        </h2>
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {gemsStore.packages.map((pkg) => (
            <li key={pkg.id}>
              <GemsRedeemCard pkg={pkg} affordable={gemsBalance >= pkg.gemsCost} onRedeem={() => openRedeemConfirm(pkg)} />
            </li>
          ))}
        </ul>
      </section>

      <GemsRedeemConfirmDialog
        open={confirmPkg != null}
        onOpenChange={(next) => {
          if (!next && !redeemLoading) setConfirmPkg(null);
        }}
        pkg={confirmPkg}
        gemsBalance={gemsBalance}
        loading={redeemLoading}
        onConfirm={handleConfirmRedeem}
      />
    </div>
  );
}

function GemsRedeemCard({
  pkg,
  affordable,
  onRedeem,
}: {
  pkg: GemsStorePackage;
  affordable: boolean;
  onRedeem: () => void;
}) {
  const t = useT("rewards");
  const fmt = useFormat();
  const redeemLabel = affordable ? t("gemsStore.redeemShort") : t("gemsStore.notEnoughShort");
  const redeemAria = affordable
    ? t("gemsStore.redeemAria", { credits: fmt.credits(pkg.credits) })
    : t("gemsStore.notEnoughGems");

  return (
    <article className={`soft-card flex h-full flex-col gap-2 p-3 ${affordable ? "" : "opacity-80"}`}>
      <p className="text-sm font-semibold">{fmt.credits(pkg.credits)}</p>
      <div className="relative mx-auto h-14 w-14">
        <Image src={pkg.coinSrc} alt="" fill sizes="56px" className="object-contain object-center" />
      </div>
      <p className="flex items-center justify-center gap-1 text-sm font-semibold text-[var(--text-muted)]">
        <span className="relative h-4 w-4" aria-hidden="true">
          <Image src={GEMS_STORE_GEM_ASSET} alt="" fill sizes="16px" className="object-contain" />
        </span>
        <span className="tabular-nums text-[var(--brand-strong)]">{formatGemsBalance(pkg.gemsCost)}</span>
      </p>
      <button
        type="button"
        disabled={!affordable}
        onClick={onRedeem}
        aria-label={redeemAria}
        className={
          affordable
            ? "soft-btn-primary mt-auto min-h-10 w-full text-sm font-semibold"
            : "mt-auto min-h-10 w-full rounded-[var(--radius-soft-sm)] border border-white/10 bg-[var(--soft-surface)] text-xs font-semibold text-[var(--text-muted)]"
        }
      >
        <span className="sm:hidden">{redeemLabel}</span>
        <span className="hidden sm:inline">{affordable ? t("gemsStore.redeem") : t("gemsStore.notEnoughGems")}</span>
      </button>
    </article>
  );
}
