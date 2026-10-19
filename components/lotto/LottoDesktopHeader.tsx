"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { ChevronDown, Gift, Megaphone, Palette, Plus, RotateCcw } from "lucide-react";
import Link, { useLocale } from "@/lib/i18n/navigation";
import { useT } from "@/lib/i18n/I18nProvider";
import { LOCALE_LABELS } from "@/lib/i18n/config";
import { LocaleFlag } from "@/app/components/i18n/LocaleFlag";
import { useProfile } from "@/app/hooks/api/account";
import { useLotterySlipFirstPage } from "@/app/hooks/api/lotterySlips";
import { useLazyOverlayMount } from "@/app/hooks/useLazyOverlayMount";
import { useAuthUI } from "@/context/AuthUIContext";
import { useDeposit } from "@/context/DepositContext";
import type { WalletSnapshot } from "@/lib/lotto/load-wallet-snapshot";
import { BahtIcon } from "./BahtIcon";
import { DevQuickLogin } from "./DevQuickLogin";

const ThemePickerSheet = dynamic(() =>
  import("@/app/components/theme/ThemePickerSheet").then((m) => m.ThemePickerSheet),
);
const LanguagePickerSheet = dynamic(() =>
  import("@/app/components/i18n/LanguagePickerSheet").then((m) => m.LanguagePickerSheet),
);

type Props = {
  logoSrc: string;
  loggedIn: boolean;
  wallet: WalletSnapshot;
};

const PENDING_FILTER = { scope: "pending", market: "", result: "", range: "" } as const;

/** กลุ่มขวาของคนที่ login — ชื่อ + ยอดเงิน · avatar · ปุ่มธีม · แผงโพยค้าง */
function MemberCluster({ wallet, onOpenTheme }: { wallet: WalletSnapshot; onOpenTheme: () => void }) {
  const tNav = useT("nav");
  const tLottery = useT("lottery");
  const tCommon = useT("common");
  const { openDeposit } = useDeposit();
  const profile = useProfile();
  const pending = useLotterySlipFirstPage(PENDING_FILTER, () => ({ scope: "pending" }));
  const pendingCount = pending.data?.summary.count ?? 0;
  const name = profile.data?.displayName ?? "";
  const avatarUrl = profile.data?.avatarUrl;

  return (
    <>
      <div className="dh-account">
        <span className="dh-account__name">{name}</span>
        <div className="dh-balance">
          <button
            type="button"
            className="dh-balance__plus"
            onClick={openDeposit}
            aria-label={tNav("bottomNav.deposit")}
            title={tNav("bottomNav.deposit")}
          >
            <Plus className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
          </button>
          <BahtIcon />
          <span className="dh-balance__value">{wallet.money}</span>
        </div>
      </div>

      <Link href="/profile" className="dh-avatar" aria-label={name || undefined}>
        {avatarUrl ? <Image src={avatarUrl} alt="" width={44} height={44} unoptimized /> : null}
      </Link>

      <button
        type="button"
        className="dh-hex"
        onClick={onOpenTheme}
        aria-label={tCommon("theme.fab")}
        title={tCommon("theme.fab")}
      >
        <Palette className="h-4 w-4" aria-hidden="true" />
      </button>

      <Link
        href="/lottery/slips"
        className="dh-ticket"
        aria-label={pendingCount > 0 ? tLottery("hub.mySlipsPendingAria", { count: pendingCount }) : tLottery("hub.mySlipsAria")}
      >
        <span className="dh-ticket__coin">
          {pendingCount > 99 ? "99+" : pendingCount}
          <span className="dh-ticket__plus">
            <Plus className="h-2.5 w-2.5" strokeWidth={3} aria-hidden="true" />
          </span>
        </span>
        <span className="dh-ticket__text">
          <span className="dh-ticket__title">
            {tLottery("hub.mySlips")}
          </span>
          <span className="dh-ticket__sub">{tLottery("slips.tabs.pending")}</span>
        </span>
      </Link>
    </>
  );
}

/** กลุ่มขวาของ guest — ปุ่มเข้าสู่ระบบ/สมัคร + ปุ่มธีม */
function GuestCluster({ onOpenTheme }: { onOpenTheme: () => void }) {
  const tCommon = useT("common");
  const { openLogin, openRegister } = useAuthUI();
  return (
    <>
      <DevQuickLogin className="dh-auth dh-auth--dev" />
      <button type="button" className="dh-auth dh-auth--ghost" onClick={openLogin}>
        เข้าสู่ระบบ
      </button>
      <button type="button" className="dh-auth" onClick={openRegister}>
        สมัครสมาชิก
      </button>
      <button
        type="button"
        className="dh-hex"
        onClick={onOpenTheme}
        aria-label={tCommon("theme.fab")}
        title={tCommon("theme.fab")}
      >
        <Palette className="h-4 w-4" aria-hidden="true" />
      </button>
    </>
  );
}

/**
 * Header desktop (≥1024) — layout ตามภาพอ้างอิง SuperLotto (design.md §2.1):
 * ซ้าย = โลโก้ · ภาษา · ลิงก์เมนู / ขวา = ชื่อ+ยอดเงิน · avatar · ปุ่มธีม · เส้นคั่น · แผงโพยค้าง
 * mobile ใช้ header เดิมใน LottoSiteHeader (กลุ่มนี้ซ่อนด้วย CSS ต่ำกว่า 1024)
 */
export function LottoDesktopHeader({ logoSrc, loggedIn, wallet }: Props) {
  const t = useT("common");
  const tNav = useT("nav");
  const locale = useLocale();
  const [themeOpen, setThemeOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const themeMounted = useLazyOverlayMount(themeOpen);
  const langMounted = useLazyOverlayMount(langOpen);
  const openTheme = () => setThemeOpen(true);
  const rootRef = useRef<HTMLDivElement>(null);

  /** เริ่มเลื่อนหน้า → ตั้ง data-scrolled บน <header> เพื่อให้ CSS ใส่พื้นไล่เฉดสีธีม */
  useEffect(() => {
    const header = rootRef.current?.closest<HTMLElement>(".lotto-site-header");
    if (!header) return;
    const update = () => header.setAttribute("data-scrolled", String(window.scrollY > 8));
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div className="header-desktop" ref={rootRef}>
      <div className="dh-left">
        <Link href="/" className="dh-logo">
          <Image src={logoSrc} alt="CM-SaturnLotto" width={1123} height={217} className="dh-logo__img" priority unoptimized />
        </Link>

        <button
          type="button"
          className="dh-lang"
          onClick={() => setLangOpen(true)}
          aria-label={t("languagePicker.title")}
          title={t("languagePicker.title")}
        >
          <LocaleFlag locale={locale} className="h-5 w-5" />
          <span>{LOCALE_LABELS[locale].short}</span>
          <ChevronDown className="h-3.5 w-3.5 opacity-70" aria-hidden="true" />
        </button>

        <nav className="dh-nav">
          <Link href="/promotions">
            <Megaphone className="h-3.5 w-3.5" aria-hidden="true" />
            {tNav("menu.promotions")}
          </Link>
          <Link href="/cashback">
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            {tNav("menu.cashback")}
          </Link>
          <Link href="/activities">
            <Gift className="h-3.5 w-3.5" aria-hidden="true" />
            {tNav("menu.activities")}
          </Link>
        </nav>
      </div>

      <div className="dh-right">
        {loggedIn ? <MemberCluster wallet={wallet} onOpenTheme={openTheme} /> : <GuestCluster onOpenTheme={openTheme} />}
      </div>

      {themeMounted ? <ThemePickerSheet isOpen={themeOpen} onClose={() => setThemeOpen(false)} /> : null}
      {langMounted ? <LanguagePickerSheet isOpen={langOpen} onClose={() => setLangOpen(false)} /> : null}
    </div>
  );
}
