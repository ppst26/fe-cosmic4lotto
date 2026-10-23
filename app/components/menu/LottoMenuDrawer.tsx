"use client";

import React, { useCallback, useEffect, useMemo } from "react";
import Image from "next/image";
import { ArrowDownToLine, ArrowUpFromLine, ChevronRight, Copy, LogOut, X } from "lucide-react";
import { useAuth } from "@/app/components/auth/AuthProvider";
import { LocaleFlag } from "@/app/components/i18n/LocaleFlag";
import { useLanguagePicker } from "@/app/components/i18n/LanguagePickerProvider";
import { NotificationBellButton } from "@/app/components/notifications/NotificationBellButton";
import { useNotifications } from "@/app/components/notifications/NotificationProvider";
import { UserAvatar } from "@/app/components/profile/UserAvatar";
import {
  MENU_DIALOG_MOBILE_GRID_ITEMS,
  MENU_DIALOG_MOBILE_LIST_ITEMS,
  MENU_DIALOG_SECTIONS,
  menuTileRequiresAuth,
} from "@/app/data/menuMockData";
import { getMenuIconSrc } from "@/app/data/menuIconAssets";
import { useProfile } from "@/app/hooks/api/account";
import { useCashbackPanels, useProfileHubStats, useReferralOverview } from "@/app/hooks/api/member";
import { useLogoutConfirm } from "@/app/hooks/useLogoutConfirm";
import type { MenuDialogAction, MenuDialogTile } from "@/app/types/menu";
import { useAuthUI } from "@/context/AuthUIContext";
import { lockBodyScroll } from "@/lib/scroll-lock";
import { useCouponUI } from "@/context/CouponUIContext";
import { useDeposit } from "@/context/DepositContext";
import { useMenuUI } from "@/context/MenuUIContext";
import { useToast } from "@/context/ToastContext";
import { formatCashbackCurrency } from "@/lib/format";
import { buildReferralLink } from "@/lib/domain/referral";
import { useT } from "@/lib/i18n/I18nProvider";
import { useLocale, useRouter } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";
import { usePresence } from "@/lib/usePresence";

/** เท่ากับ --menu-motion-out (styles/motion-glass.css) */
const EXIT_MS = 280;

/**
 * เมนูหลักของหน้าแรก lotto — เปิดจากปุ่มแฮมเบอร์เกอร์ใน header (ผ่าน HomeActionBridge)
 * โครงตาม RightMenuDrawer ของ glass: มือถือเต็มจอ = avatar/โลโก้ · แถบฝากถอน · การ์ดโบนัส · ลิงก์แนะนำเพื่อน ·
 * การ์ดรายการ · กริด 3 คอลัมน์ · ออกจากระบบ/สมัคร-เข้าสู่ระบบ · เดสก์ท็อป = แผงชิดขวาแบบกลุ่มเมนู
 */
export function LottoMenuDrawer() {
  const { isMobileMenuOpen } = useMenuUI();
  const { rendered, state } = usePresence(isMobileMenuOpen, EXIT_MS);

  if (!rendered) return null;
  return <LottoMenuDrawerContent state={state} />;
}

/** โลโก้ตัวอักษร (แทน CosmicbetLogo ของ glass) */
function BrandLogo() {
  return (
    <span className="inline-block text-xl font-semibold leading-none tracking-wide text-[var(--brand)]">
      CM-SaturnLotto
    </span>
  );
}

function MenuTileIcon({ tile, size }: { tile: MenuDialogTile; size: number }) {
  const locale = useLocale();
  if (tile.action === "language") {
    return (
      <span className="flex shrink-0 items-center justify-center" style={{ width: size, height: size }}>
        <LocaleFlag locale={locale} className="h-[78%] w-[78%]" />
      </span>
    );
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

const CARD = "rounded-2xl border border-white/10 bg-[var(--BG-Surface-Normal)]";

/** ลำดับเข้าของแต่ละชิ้น (menu-enter-item ใน motion-glass.css) — เหมือน glass RightMenuDrawer */
const enterStyle = (index: number) => ({ "--menu-enter-i": index }) as React.CSSProperties;

function LottoMenuDrawerContent({ state }: { state: "open" | "closed" }) {
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
  const { showToast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const profile = useProfile();
  const hubStats = useProfileHubStats();
  const overview = useReferralOverview();
  const cashbackPanels = useCashbackPanels();
  const { openLogoutConfirm, LogoutConfirmDialog } = useLogoutConfirm(closeMobileMenu);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMobileMenu();
    };
    window.addEventListener("keydown", onKeyDown);
    const unlock = lockBodyScroll();
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      unlock();
    };
  }, [closeMobileMenu]);

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

  /** แถบฝาก/ถอน — ยังไม่ login → เปิด login */
  const runAuthed = (action: () => void) => {
    if (isLoading) return;
    if (!isAuthenticated) {
      closeThen(openLogin);
      return;
    }
    closeThen(action);
  };

  const referralLink = overview.data ? buildReferralLink(overview.data.refCode) : null;
  const showAmounts = isAuthenticated && !isLoading;
  const playClaimable = cashbackPanels.data?.play.claimableThb;
  const lossClaimable = cashbackPanels.data?.loss.claimableThb;
  const playBonusLabel = useMemo(
    () => (showAmounts && playClaimable !== undefined ? formatCashbackCurrency(playClaimable) : "—"),
    [showAmounts, playClaimable],
  );
  const lossBonusLabel = useMemo(
    () => (showAmounts && lossClaimable !== undefined ? formatCashbackCurrency(lossClaimable) : "—"),
    [showAmounts, lossClaimable],
  );

  const goCashback = (tab: "play" | "loss") => {
    if (!isAuthenticated) {
      closeThen(openLogin);
      return;
    }
    closeMobileMenu();
    router.push(tab === "loss" ? "/cashback?tab=loss" : "/cashback");
  };

  const copyReferralLink = async () => {
    if (!isAuthenticated) {
      closeThen(openLogin);
      return;
    }
    if (!referralLink) return;
    try {
      await navigator.clipboard.writeText(referralLink);
      showToast(t("drawer.linkCopied"), "success", 2500);
    } catch {
      showToast(t("drawer.linkCopyFailed"), "error");
    }
  };

  const rowClass =
    "group flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border-0 bg-transparent px-3 py-2.5 text-left transition-colors hover:bg-white/5";

  const renderRow = (tile: MenuDialogTile, enterIndex?: number) => (
    <button
      key={tile.id}
      type="button"
      onClick={() => onTile(tile)}
      className={cn(rowClass, enterIndex !== undefined && "menu-enter-item")}
      style={enterIndex !== undefined ? enterStyle(enterIndex) : undefined}
    >
      <span className="flex min-w-0 items-center gap-3">
        <MenuTileIcon tile={tile} size={22} />
        <span className="truncate text-[12.5px] font-semibold text-white">{t(tile.labelKey)}</span>
      </span>
      <span className="flex shrink-0 items-center gap-2">
        {tile.action === "vip-rank" && hubStats.data?.vipLabel ? (
          <span className="rounded-md bg-[var(--brand-soft)] px-2 py-0.5 text-[10px] font-semibold text-[var(--brand)]">
            {hubStats.data.vipLabel}
          </span>
        ) : null}
        <span
          className="flex h-5 w-5 items-center justify-center rounded-full bg-white/5 text-[var(--brand)] transition-transform group-hover:translate-x-0.5"
          aria-hidden
        >
          <ChevronRight className="h-3 w-3 stroke-[2.4]" />
        </span>
      </span>
    </button>
  );

  const gridTileClass =
    "group flex cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border-0 bg-transparent p-1 text-center transition-colors hover:bg-white/5";

  const renderGridTile = (tile: MenuDialogTile, size = 28, enterIndex?: number) => (
    <button
      key={tile.id}
      type="button"
      onClick={() => onTile(tile)}
      className={cn(gridTileClass, enterIndex !== undefined && "menu-enter-item")}
      style={enterIndex !== undefined ? enterStyle(enterIndex) : undefined}
    >
      <MenuTileIcon tile={tile} size={size} />
      <span className="line-clamp-2 text-[11px] font-semibold leading-tight text-white transition-colors group-hover:text-[var(--brand)]">
        {tile.action === "language" ? tCommon("language") : t(tile.labelKey)}
      </span>
    </button>
  );

  const logoutButton = (
    <button
      type="button"
      onClick={openLogoutConfirm}
      className="flex w-full shrink-0 cursor-pointer items-center justify-center gap-1.5 border-0 bg-transparent py-2.5 text-sm font-medium text-[#ff6b72] transition-opacity hover:opacity-80"
    >
      <LogOut className="h-4 w-4 shrink-0" aria-hidden />
      <span>{tAuth("logout")}</span>
    </button>
  );

  const guestAuthButtons = (
    <div className="grid w-full shrink-0 grid-cols-2 gap-2.5">
      <button
        type="button"
        onClick={() => closeThen(openRegister)}
        className="btn-gold h-10 w-full cursor-pointer whitespace-nowrap text-sm font-semibold active:scale-[0.98]"
      >
        {tAuth("signUp")}
      </button>
      <button
        type="button"
        onClick={() => closeThen(openLogin)}
        className="btn-outline-gold h-10 w-full cursor-pointer whitespace-nowrap text-sm font-semibold active:scale-[0.98]"
      >
        {tAuth("login")}
      </button>
    </div>
  );

  const listTiles = MENU_DIALOG_MOBILE_LIST_ITEMS;
  /** ชิ้น 0–4 = ฝาก/ถอน/โบนัส 2 ใบ/ลิงก์แนะนำ (เฉพาะล็อกอิน) แล้วต่อด้วยรายการ · กริด · ปุ่มท้าย */
  const mobileEnterBase = isAuthenticated ? 5 : 1;
  const mobileTailIndex = mobileEnterBase + listTiles.length + MENU_DIALOG_MOBILE_GRID_ITEMS.length + 1;

  const mobileMenu = (
    <div className="mx-auto flex w-full max-w-[440px] flex-col gap-2 px-3 pb-3 pt-11 md:hidden">
      {isAuthenticated ? (
        <div className="flex shrink-0 justify-center">
          <span className="menu-enter-avatar rounded-full border-2 border-[var(--brand)]/70 p-0.5 shadow-[0_0_18px_color-mix(in_srgb,var(--brand)_35%,transparent)]">
            {profile.data ? (
              <UserAvatar profile={profile.data} size="lg" className="!h-11 !w-11 !rounded-full" />
            ) : (
              <span className="block h-11 w-11 rounded-full bg-[var(--BG-Surface-Normal)]" aria-hidden />
            )}
          </span>
        </div>
      ) : (
        <div className="menu-enter-logo flex shrink-0 justify-center pb-1">
          <BrandLogo />
        </div>
      )}

      {isAuthenticated ? (
        <div className="flex w-full min-w-0 flex-col gap-2">
          <div className="grid w-full grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => runAuthed(openDeposit)}
              className="menu-drawer-quick-actions__btn menu-enter-item btn-gold relative flex h-9 cursor-pointer items-center justify-center gap-2 overflow-hidden text-sm font-semibold active:scale-[0.98]"
              style={enterStyle(0)}
            >
              <ArrowDownToLine className="menu-drawer-quick-actions__icon h-4 w-4" aria-hidden />
              {t("drawer.deposit")}
            </button>
            <button
              type="button"
              onClick={() => runAuthed(openWithdraw)}
              className="menu-drawer-quick-actions__btn menu-enter-item btn-outline-gold relative flex h-9 cursor-pointer items-center justify-center gap-2 overflow-hidden text-sm font-semibold active:scale-[0.98]"
              style={enterStyle(1)}
            >
              <ArrowUpFromLine className="menu-drawer-quick-actions__icon h-4 w-4" aria-hidden />
              {t("drawer.withdraw")}
            </button>
          </div>

          <div className="grid w-full grid-cols-2 gap-2">
            {(
              [
                ["play", t("drawer.playBonus"), playBonusLabel],
                ["loss", t("drawer.lossBonus"), lossBonusLabel],
              ] as const
            ).map(([tab, label, value], bonusIndex) => (
              <button
                key={tab}
                type="button"
                onClick={() => goCashback(tab)}
                className={cn(CARD, "menu-enter-item relative flex cursor-pointer flex-col items-start px-3 py-2 text-left text-white")}
                style={enterStyle(2 + bonusIndex)}
              >
                <span className="text-[11px] font-medium text-[var(--text-muted)]">{label}</span>
                <span className="font-sans text-sm font-semibold tabular-nums">{value}</span>
                <ChevronRight
                  className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]"
                  aria-hidden
                />
              </button>
            ))}
          </div>

          <div className={cn(CARD, "menu-enter-item flex w-full min-w-0 items-center gap-2 px-3 py-2")} style={enterStyle(4)}>
            <Image
              src="/assets/3d/menuicon/referral.avif"
              alt=""
              width={28}
              height={28}
              unoptimized
              className="shrink-0 object-contain"
            />
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium text-[var(--text-muted)]">{t("drawer.referralLink")}</p>
              <p className="truncate text-xs font-semibold tabular-nums text-white">
                {referralLink ?? "—"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => void copyReferralLink()}
              aria-label={t("drawer.copyReferralLink")}
              className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-white/5 text-[var(--brand)] active:scale-95"
            >
              <Copy className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>
      ) : null}

      <div className={cn(CARD, "menu-enter-item flex shrink-0 flex-col p-1")} style={enterStyle(mobileEnterBase)}>
        {listTiles.map((tile, index) => renderRow(tile, mobileEnterBase + index))}
      </div>

      <div className={cn(CARD, "menu-enter-item w-full shrink-0 p-2")} style={enterStyle(mobileEnterBase + listTiles.length)}>
        <div className="grid grid-cols-3 gap-x-1 gap-y-1.5">
          {MENU_DIALOG_MOBILE_GRID_ITEMS.map((tile, index) =>
            renderGridTile(tile, 28, mobileEnterBase + listTiles.length + 1 + index),
          )}
        </div>
      </div>

      <div className="menu-enter-item" style={enterStyle(mobileTailIndex)}>
        {isAuthenticated ? logoutButton : guestAuthButtons}
      </div>
    </div>
  );

  const desktopMenu = (
    <div className="hidden flex-col gap-3 px-5 pb-6 pt-14 md:flex">
      {isAuthenticated ? (
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => runAuthed(openDeposit)}
            className="menu-drawer-quick-actions__btn btn-gold relative flex h-9 cursor-pointer items-center justify-center gap-2 overflow-hidden text-sm font-semibold active:scale-[0.98]"
          >
            <ArrowDownToLine className="menu-drawer-quick-actions__icon h-4 w-4" aria-hidden />
            {t("drawer.deposit")}
          </button>
          <button
            type="button"
            onClick={() => runAuthed(openWithdraw)}
            className="menu-drawer-quick-actions__btn btn-outline-gold relative flex h-9 cursor-pointer items-center justify-center gap-2 overflow-hidden text-sm font-semibold active:scale-[0.98]"
          >
            <ArrowUpFromLine className="menu-drawer-quick-actions__icon h-4 w-4" aria-hidden />
            {t("drawer.withdraw")}
          </button>
        </div>
      ) : null}

      {MENU_DIALOG_SECTIONS.map((section, sectionIndex) => (
        <section
          key={section.id}
          className="menu-enter-item flex flex-col"
          style={{ "--menu-enter-i": sectionIndex } as React.CSSProperties}
          aria-labelledby={`lotto-menu-section-${section.id}`}
        >
          <h3
            id={`lotto-menu-section-${section.id}`}
            className="mb-1 px-0.5 text-xs font-semibold text-[var(--text-muted)]"
          >
            {t(section.sectionLabelKey)}
          </h3>
          {section.layout === "vertical" ? (
            <div className={cn(CARD, "flex flex-col p-1.5")}>{section.items.map(renderRow)}</div>
          ) : (
            <div className="grid w-full grid-cols-4 gap-1.5">
              {section.items.map((tile) => renderGridTile(tile, 32))}
            </div>
          )}
        </section>
      ))}

      {isAuthenticated ? logoutButton : guestAuthButtons}
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-[100] flex select-none items-stretch justify-center md:justify-end"
      role="presentation"
    >
      <div
        className="lotto-menu-scrim absolute inset-0 bg-black/60"
        data-state={state}
        onClick={closeMobileMenu}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={t("drawer.title")}
        data-state={state}
        className="lotto-menu-shell relative h-full w-full overflow-y-auto bg-[var(--BG-Surface-Darker)] text-[var(--text-on-light)] shadow-[var(--shadow-soft)] md:w-[400px] md:border-l md:border-white/10"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 38% at 50% 0%, color-mix(in srgb, var(--brand) 14%, transparent), transparent 70%)",
        }}
      >
        <h2 className="sr-only">{t("drawer.title")}</h2>
        <button
          type="button"
          onClick={closeMobileMenu}
          aria-label={t("drawer.close")}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-black/40 text-white/90 transition-colors hover:text-[var(--brand)] active:scale-95"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
        {isAuthenticated ? (
          <div className="absolute left-4 top-4 z-10">
            <NotificationBellButton
              onClick={() => closeThen(openNotifications)}
              className="rounded-full border border-white/10 bg-black/40"
            />
          </div>
        ) : null}

        {mobileMenu}
        {desktopMenu}
      </div>

      <LogoutConfirmDialog />
    </div>
  );
}
