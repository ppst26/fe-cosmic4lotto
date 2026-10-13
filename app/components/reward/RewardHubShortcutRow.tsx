"use client";

import React from "react";
import Link, { usePathname } from "@/lib/i18n/navigation";
import Image from "next/image";
import { getMenuIconSrc } from "@/app/data/menuIconAssets";
import { REWARD_FREESPINS_COMING_SOON_LABEL } from "@/app/data/rewardFeaturesMockData";
import type { RewardHubShortcut } from "@/app/types/reward";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/I18nProvider";

/** แถบทางลัด 3 ช่อง — หน้า /reward และหน้าย่อย */
export function RewardHubShortcutRow({ shortcuts }: { shortcuts: RewardHubShortcut[] }) {
  const t = useT("rewards");
  const pathname = usePathname();

  return (
    <nav className="grid grid-cols-3 gap-2 sm:gap-2.5" aria-label={t("hub.shortcutsAria")}>
      {shortcuts.map((item) => {
        const iconSrc = getMenuIconSrc(item.iconId);
        const inactive = item.comingSoon === true;
        const active = !inactive && pathname === item.href;
        const cls = cn(
          "soft-card flex min-h-[88px] flex-col items-center justify-center gap-1 border border-white/10 px-1 py-2 text-center transition-colors",
          active && "border-[var(--brand)] ring-1 ring-[var(--brand)]",
          inactive ? "cursor-not-allowed" : "hover:border-[var(--brand)]/50",
        );
        const inner = (
          <>
            {iconSrc ? (
              <Image
                src={iconSrc}
                alt=""
                width={40}
                height={40}
                className={cn("h-9 w-9 object-contain sm:h-10 sm:w-10", inactive && "opacity-45 grayscale")}
              />
            ) : null}
            <span
              className={cn(
                "line-clamp-2 text-[11px] font-medium leading-tight",
                inactive ? "text-[var(--text-muted)]" : "text-[var(--text-on-light)]",
              )}
            >
              {t(item.labelKey)}
            </span>
            {inactive ? (
              <span className="text-[9px] font-medium uppercase tracking-wide text-[var(--brand)]">
                {REWARD_FREESPINS_COMING_SOON_LABEL}
              </span>
            ) : null}
          </>
        );
        return inactive ? (
          <div key={item.id} className={cls} aria-disabled="true" title={REWARD_FREESPINS_COMING_SOON_LABEL}>
            {inner}
          </div>
        ) : (
          <Link key={item.id} href={item.href} className={cls}>
            {inner}
          </Link>
        );
      })}
    </nav>
  );
}
