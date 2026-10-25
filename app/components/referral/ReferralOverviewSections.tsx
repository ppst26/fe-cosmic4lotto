"use client";

import Image from "next/image";
import { Copy } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { buildReferralLink } from "@/lib/domain/referral";
import { formatReferralCurrency } from "@/lib/format";
import type { ReferralStatsMock } from "@/app/types/referral";
import { useT } from "@/lib/i18n/I18nProvider";
import { useFormat } from "@/lib/i18n/useFormat";

/** ลิงก์แนะนำ + ปุ่มคัดลอก */
export function ReferralLinkSection({ refCode }: { refCode: string }) {
  const { showToast } = useToast();
  const t = useT("referral");
  const referralLink = buildReferralLink(refCode);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      showToast(t("link.copied"), "success", 2500);
    } catch {
      showToast(t("link.copyFailed"), "error");
    }
  };

  return (
    <section className="soft-panel space-y-3 p-4">
      <p className="text-sm font-semibold text-[var(--text-on-light)]">{t("link.title")}</p>
      <p className="break-all text-sm text-[var(--text-muted)]">{referralLink}</p>
      <button
        type="button"
        onClick={() => void handleCopy()}
        className="soft-btn-outline flex h-10 w-full items-center justify-center gap-1.5 text-sm font-semibold"
      >
        <Copy className="h-4 w-4 shrink-0" aria-hidden />
        Copy
      </button>
    </section>
  );
}

/** สถิติสรุป 3 ช่อง */
export function ReferralStatsSection({ stats }: { stats: ReferralStatsMock }) {
  const t = useT("referral");
  const fmt = useFormat();

  return (
    <section>
      <h2 className="mb-2 text-sm font-semibold text-[var(--text-on-light)]">{t("stats.title")}</h2>
      <div className="grid grid-cols-3 gap-2">
        <StatCard icon="refferal" label={t("stats.friends")} value={fmt.people(stats.friendsCount)} />
        <StatCard
          icon="history"
          label={t("stats.totalTurnover")}
          value={formatReferralCurrency(stats.totalTurnoverThb)}
        />
        <StatCard
          icon="cashback"
          label={t("stats.totalEarnings")}
          value={formatReferralCurrency(stats.totalEarningsThb)}
          accent
        />
      </div>
    </section>
  );
}

function StatCard({ icon, label, value, accent = false }: { icon: string; label: string; value: string; accent?: boolean }) {
  return (
    <div className="soft-card flex min-w-0 flex-col items-center gap-1 p-2 text-center">
      <span className="relative h-9 w-9" aria-hidden="true">
        <Image src={`/menu-icon/${icon}.webp`} alt="" fill sizes="36px" className="object-contain" />
      </span>
      <p className="text-[10px] leading-snug text-[var(--text-muted)] sm:text-xs">{label}</p>
      <p
        className={`text-xs font-semibold tabular-nums sm:text-sm ${accent ? "text-[var(--brand-strong)]" : "text-[var(--text-on-light)]"}`}
      >
        {value}
      </p>
    </div>
  );
}
