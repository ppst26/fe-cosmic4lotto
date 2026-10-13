"use client";

import React from "react";
import Image from "next/image";
import { useWallet } from "@/app/hooks/api/account";
import { formatRewardPoints, formatHeaderWalletBalance } from "@/lib/format";
import { useT } from "@/lib/i18n/I18nProvider";
import { cn } from "@/lib/utils";
import { REWARD_GEM_ICON_SRC } from "./rewardAssets";

/** การ์ดยอดเครดิต · พอยท์ — หัวหน้า /reward */
export function RewardHubSummaryCard({ pointsBalance, className }: { pointsBalance: number; className?: string }) {
  const t = useT("rewards");
  const wallet = useWallet();

  return (
    <aside className={cn("soft-panel border border-white/10 px-4 py-3.5", className)} aria-label={t("hub.summaryAria")}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-[var(--text-muted)]">{t("hub.totalCredits")}</p>
          <p className="mt-0.5 text-xl font-bold tabular-nums text-[var(--text-on-light)] sm:text-2xl">
            {wallet.data ? formatHeaderWalletBalance(wallet.data.amount) : "—"}
            <span className="ml-1 text-sm font-normal text-[var(--text-muted)]">฿</span>
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2 rounded-full border border-[var(--brand)]/30 bg-[var(--brand-soft)] px-2.5 py-1.5">
          <Image src={REWARD_GEM_ICON_SRC} alt="" width={22} height={22} className="h-[22px] w-[22px] object-contain" />
          <span className="text-sm font-bold tabular-nums text-[var(--brand-strong)]">
            {formatRewardPoints(pointsBalance)}
          </span>
        </div>
      </div>
    </aside>
  );
}
