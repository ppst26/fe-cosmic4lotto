"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { useAuth } from "@/app/components/auth/AuthProvider";
import { LocaleFlag } from "@/app/components/i18n/LocaleFlag";
import { useLanguagePicker } from "@/app/components/i18n/LanguagePickerProvider";
import { NotificationBellButton } from "@/app/components/notifications/NotificationBellButton";
import { useNotifications } from "@/app/components/notifications/NotificationProvider";
import {
  MENU_DIALOG_MOBILE_GRID_ITEMS,
  MENU_DIALOG_MOBILE_LIST_ITEMS,
  menuTileRequiresAuth,
} from "@/app/data/menuMockData";
import { getMenuIconSrc } from "@/app/data/menuIconAssets";
import { useProfile, useWallet } from "@/app/hooks/api/account";
import { useProfileHubStats } from "@/app/hooks/api/member";
import { useLogoutConfirm } from "@/app/hooks/useLogoutConfirm";
import type { MenuDialogAction, MenuDialogTile } from "@/app/types/menu";
import { useAuthUI } from "@/context/AuthUIContext";
import { useCouponUI } from "@/context/CouponUIContext";
import { useDeposit } from "@/context/DepositContext";
import { useMenuUI } from "@/context/MenuUIContext";
import { formatMoney } from "@/lib/format";
import { useT } from "@/lib/i18n/I18nProvider";
import { useLocale, useRouter } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";

const EXIT_MS = 200;

/** แถวที่ซ้ำปลายทางกับ "ชวนเพื่อน" — แสดงรายการเดียว */
const HIDDEN_LIST_TILE_IDS = new Set(["referral-earnings"]);

/**
 * เมนูหลักของหน้าแรก lotto — เปิดจากปุ่มแฮมเบอร์เกอร์ใน header (ผ่าน HomeActionBridge)
 * มือถือ = bottom sheet · desktop = แผงชิดขวา · รายการและเส้นทางตามเมนูของ glass
 */
export function LottoMenuDrawer() {
  const { isMobileMenuOpen } = useMenuUI();
  const [mounted, setMounted] = useState(isMobileMenuOpen);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // mount/unmount ตามแอนิเมชันเข้า-ออก (ต้องตั้ง state ใน effect เพื่อรอ frame / timer)
    /* eslint-disable react-hooks/set-state-in-effect */
    if (isMobileMenuOpen) {
      setMounted(true);
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    }
    setVisible(false);
    const timer = window.setTimeout(() => setMounted(false), EXIT_MS);
    return () => window.clearTimeout(timer);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [isMobileMenuOpen]);

  if (!mounted) return null;
  return <LottoMenuDrawerContent visible={visible && isMobileMenuOpen} />;
}

function MenuTileIcon({ tile, size }: { tile: MenuDialogTile; size: number }) {
  const locale = useLocale();
  if (tile.action === "language") {
    return <LocaleFlag locale={locale} className={size > 30 ? "h-9 w-9" : "h-7 w-7"} />;
  }
  const src = getMenuIconSrc(tile.iconId);
  if (!src) return null;
  return (
    <Image
      src={src}
      alt=""
      width={size}
      height={size}
      unoptimized
      className="shrink-0 object-contain transition-transform group-hover:scale-110"
    />
  );
}

function LottoMenuDrawerContent({ visible }: { visible: boolean }) {
  const t = useT("nav");
  const tAuth = useT("auth");
  const tCommon = useT("common");
  const router = useRouter();
  const { closeMobileMenu } = useMenuUI();
  const { openLogin, openRegister } = useAuthUI();
  const { openDeposit, openWithdraw } = useDeposit();
  const { openCoupon } = useCouponUI();
  const { openLanguagePicker } = useLanguagePicker();
  const { openNotifications } = useNotifications();
  const { isAuthenticated, isLoading, user } = useAuth();
  const profile = useProfile();
  const wallet = useWallet();
  const hubStats = useProfileHubStats();
  const { openLogoutConfirm, LogoutConfirmDialog } = useLogoutConfirm(closeMobileMenu);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMobileMenu();
    };
    window.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [closeMobileMenu]);

  const displayName =
    profile.data?.displayName ?? (user ? `${user.firstName} ${user.lastName}`.trim() : "");

  /** ปิดเมนูแล้วค่อยเปิด overlay ถัดไป (เหมือน glass) */
  const closeThen = useCallback(
    (next: () => void) => {
      closeMobileMenu();
      window.setTimeout(next, 0);
    },
    [closeMobileMenu],
  );

  /** เมนูที่ต้องล็อกอิน — ยังไม่ login → ปิดเมนูแล้วเปิด login sheet */
  const runWithAuth = (tile: MenuDialogTile, action: () => void) => {
    if (menuTileRequiresAuth(tile)) {
      if (isLoading) return;
      if (!isAuthenticated) {
        closeThen(openLogin);
        return;
      }
    }
    action();
  };

  const runAction = (action: MenuDialogAction) => {
    switch (action) {
      case "vip-rank":
        closeMobileMenu();
        router.push("/vip");
        break;
      case "coupon":
        closeThen(openCoupon);
        break;
      case "language":
        closeThen(openLanguagePicker);
        break;
    }
  };

  const onTile = (tile: MenuDialogTile) =>
    runWithAuth(tile, () => {
      if (tile.action) {
        runAction(tile.action);
        return;
      }
      if (tile.href) {
        closeMobileMenu();
        router.push(tile.href);
      }
    });

  const listTiles = MENU_DIALOG_MOBILE_LIST_ITEMS.filter((tile) => !HIDDEN_LIST_TILE_IDS.has(tile.id));

  const rowClass =
    "group flex w-full cursor-pointer items-center justify-between gap-3 rounded-2xl border-0 bg-transparent px-3 py-2.5 text-left transition-colors hover:bg-white/5";

  return (
    <div
      className="fixed inset-0 z-[100] flex select-none items-end justify-center md:items-stretch md:justify-end"
      role="presentation"
    >
      <div
        className={cn(
          "absolute inset-0 bg-black/60 transition-opacity duration-200",
          visible ? "opacity-100" : "opacity-0",
        )}
        onClick={closeMobileMenu}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={t("drawer.title")}
        className={cn(
          "relative flex max-h-[90dvh] w-full flex-col overflow-y-auto rounded-t-[28px] border border-white/10 bg-[var(--BG-Surface-Darker)] p-4 text-[var(--text-on-light)] shadow-[var(--shadow-soft)] transition duration-200 md:max-h-none md:h-full md:w-[400px] md:rounded-none md:border-y-0 md:border-r-0 md:p-5",
          visible
            ? "translate-y-0 opacity-100 md:translate-x-0"
            : "translate-y-full opacity-0 md:translate-x-full md:translate-y-0",
        )}
      >
        <div className="mb-3 flex items-center justify-between gap-3 border-b border-white/10 pb-3">
          <h2 className="text-base font-bold text-[var(--brand)]">{t("drawer.title")}</h2>
          <div className="flex items-center gap-1.5">
            {isAuthenticated ? (
              <NotificationBellButton
                onClick={() => closeThen(openNotifications)}
                className="rounded-full border border-white/10 bg-white/5"
              />
            ) : null}
            <button
              type="button"
              onClick={closeMobileMenu}
              aria-label={t("drawer.close")}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/90 transition-colors hover:text-[var(--brand)] active:scale-95"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>

        {isAuthenticated ? (
          <div className="mb-3 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[var(--BG-Surface-Normal)] p-3">
            <button
              type="button"
              onClick={() => {
                closeMobileMenu();
                router.push("/profile/account");
              }}
              className="flex min-w-0 cursor-pointer items-center gap-2.5 border-0 bg-transparent p-0 text-left transition-opacity hover:opacity-85"
            >
              <Image
                src="/assets/3d/menuicon/profile.avif"
                alt=""
                width={36}
                height={36}
                unoptimized
                className="shrink-0 object-contain"
              />
              <span className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-bold leading-tight text-white">{displayName}</span>
                <span className="font-mono text-[11px] text-[var(--text-muted)]">
                  ฿{formatMoney(wallet.data?.amount ?? 0)}
                  {hubStats.data ? ` · ${t("drawer.gems")} ${hubStats.data.diamonds}` : ""}
                </span>
              </span>
            </button>
            <button
              type="button"
              onClick={openLogoutConfirm}
              className="shrink-0 cursor-pointer rounded-full border border-[#ef4a52]/50 bg-[#ef4a52]/10 px-3 py-1.5 text-[11px] font-bold text-[#ff7a80] transition-colors hover:bg-[#ef4a52]/20"
            >
              {tAuth("logout")}
            </button>
          </div>
        ) : null}

        <div className="mb-3 space-y-0.5 rounded-2xl border border-white/10 bg-[var(--BG-Surface-Normal)] p-1.5">
          {listTiles.map((tile) => (
            <button key={tile.id} type="button" onClick={() => onTile(tile)} className={rowClass}>
              <span className="flex min-w-0 items-center gap-3">
                <MenuTileIcon tile={tile} size={28} />
                <span className="truncate text-[13.5px] font-semibold text-white">{t(tile.labelKey)}</span>
              </span>
              <span className="flex shrink-0 items-center gap-2">
                {tile.action === "vip-rank" && hubStats.data?.vipLabel ? (
                  <span className="rounded-md bg-[var(--brand-soft)] px-2 py-0.5 text-[10px] font-extrabold text-[var(--brand)]">
                    {hubStats.data.vipLabel}
                  </span>
                ) : null}
                <span
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-white/5 text-sm font-bold text-[var(--brand)] transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                >
                  ›
                </span>
              </span>
            </button>
          ))}
        </div>

        <div className="mb-4 rounded-2xl border border-white/10 bg-[var(--BG-Surface-Normal)] p-3">
          <div className="grid grid-cols-3 gap-x-1.5 gap-y-3.5">
            {MENU_DIALOG_MOBILE_GRID_ITEMS.map((tile) => (
              <button
                key={tile.id}
                type="button"
                onClick={() => onTile(tile)}
                className="group flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-2xl border-0 bg-transparent p-2 text-center transition-colors hover:bg-white/5"
              >
                <MenuTileIcon tile={tile} size={36} />
                <span className="line-clamp-2 text-[11.5px] font-semibold leading-tight text-white transition-colors group-hover:text-[var(--brand)]">
                  {t(tile.labelKey)}
                </span>
              </button>
            ))}
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => closeThen(openNotifications)}
                className="group flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-2xl border-0 bg-transparent p-2 text-center transition-colors hover:bg-white/5"
              >
                <Image
                  src="/assets/3d/menuicon/bell.avif"
                  alt=""
                  width={36}
                  height={36}
                  unoptimized
                  className="shrink-0 object-contain transition-transform group-hover:scale-110"
                />
                <span className="line-clamp-2 text-[11.5px] font-semibold leading-tight text-white transition-colors group-hover:text-[var(--brand)]">
                  {tCommon("notifications.title")}
                </span>
              </button>
            ) : null}
          </div>
        </div>

        <div className="mt-auto grid grid-cols-2 gap-2.5 pt-1">
          {isAuthenticated ? (
            <>
              <button
                type="button"
                onClick={() => closeThen(openDeposit)}
                className="btn-gold h-12 w-full cursor-pointer whitespace-nowrap text-[15px] font-extrabold active:scale-[0.98]"
              >
                {t("drawer.deposit")}
              </button>
              <button
                type="button"
                onClick={() => closeThen(openWithdraw)}
                className="btn-outline-gold h-12 w-full cursor-pointer whitespace-nowrap text-[15px] font-extrabold active:scale-[0.98]"
              >
                {t("drawer.withdraw")}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => closeThen(openRegister)}
                className="btn-gold h-12 w-full cursor-pointer whitespace-nowrap text-[15px] font-extrabold active:scale-[0.98]"
              >
                {tAuth("signUp")}
              </button>
              <button
                type="button"
                onClick={() => closeThen(openLogin)}
                className="btn-outline-gold h-12 w-full cursor-pointer whitespace-nowrap text-[15px] font-extrabold active:scale-[0.98]"
              >
                {tAuth("login")}
              </button>
            </>
          )}
        </div>
      </div>

      <LogoutConfirmDialog />
    </div>
  );
}
