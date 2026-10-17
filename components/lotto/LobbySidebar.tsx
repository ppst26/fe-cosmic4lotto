"use client";

import Image from "next/image";
import Link, { usePathname, useRouter } from "@/lib/i18n/navigation";
import type { WalletSnapshot } from "@/lib/lotto/load-wallet-snapshot";
import { DESKTOP_RIGHT_MENU_TILES } from "@/app/data/desktopLobbyMockData";
import { menuActionRequiresAuth, menuHrefRequiresAuth } from "@/app/data/menuMockData";
import { useRequireAuthAction } from "@/app/hooks/useRequireAuthAction";
import { useCouponUI } from "@/context/CouponUIContext";
import { useDeposit } from "@/context/DepositContext";
import { useT } from "@/lib/i18n/I18nProvider";
import styles from "./lobby-sidebar.module.css";

type Props = { wallet: WalletSnapshot };

const MENU_ICON = "/assets/3d/menuicon";

/** แผงเมนูซ้าย (โครงเดียวกับ LobbyDesktopSidebar ของ glass) — เฉพาะหมวดที่ lotto มีจริง */
const SIDEBAR_ITEMS = [
  { id: "home", href: "/", icon: "home", ns: "home", key: "categories.home" },
  { id: "lottery", href: "/lottery", icon: "lotto", ns: "home", key: "categories.lottery" },
  { id: "casino", href: "/casino", icon: "casino", ns: "home", key: "categories.casino" },
  { id: "slots", href: "/slots", icon: "slot", ns: "home", key: "categories.slots" },
  { id: "promotions", href: "/promotions", icon: "promotion", ns: "nav", key: "menu.promotions" },
  { id: "activities", href: "/event", icon: "event", ns: "nav", key: "menu.activities" },
] as const;

function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function LobbySidebar({ wallet }: Props) {
  const t = useT("nav");
  const tHome = useT("home");
  const router = useRouter();
  const pathname = usePathname();
  const { openDeposit, openWithdraw } = useDeposit();
  const { openCoupon } = useCouponUI();
  const { runWithAuth } = useRequireAuthAction();

  const tiles = DESKTOP_RIGHT_MENU_TILES;

  return (
    <aside className={styles.aside} aria-label={t("desktop.sidebar")}>
      <div className={styles.wallet}>
        <div className={styles.walletRow}>
          <span className={styles.walletLabel}>เงิน</span>
          <span className={styles.walletValue}>
            <span className={styles.coin}>$</span> {wallet.money}
          </span>
        </div>
        <div className={styles.divider} />
        <div className={styles.walletRow}>
          <span className={styles.walletLabel}>เครดิต</span>
          <span className={styles.walletValue}>{wallet.credit}</span>
        </div>
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.btnPrimary} onClick={openDeposit}>
          {t("drawer.deposit")}
        </button>
        <button type="button" className={styles.btnSecondary} onClick={openWithdraw}>
          {t("drawer.withdraw")}
        </button>
      </div>

      <nav className={styles.panel} aria-label={t("desktop.gameCategories")}>
        <ul className={styles.list}>
          {SIDEBAR_ITEMS.map((item) => {
            const active = isActivePath(pathname, item.href);
            const label =
              item.ns === "home"
                ? tHome(item.key as "categories.home")
                : t(item.key as "menu.promotions");
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={`${styles.link} ${active ? styles.linkActive : ""}`}
                  aria-current={active ? "page" : undefined}
                  title={label}
                >
                  <span className={styles.linkIcon} aria-hidden>
                    <Image
                      src={`${MENU_ICON}/${item.icon}.avif`}
                      alt=""
                      width={28}
                      height={28}
                      unoptimized
                    />
                  </span>
                  <span className={styles.linkLabel}>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className={styles.hubStack} aria-label={t("desktop.quickMenu")}>
        {tiles.map((tile, index) => {
          const wide = index === tiles.length - 1 && tiles.length % 2 === 1;
          const cardClass = `${styles.hubCard} ${wide ? styles.hubCardWide : ""}`;
          const needsAuth =
            "action" in tile && tile.action
              ? menuActionRequiresAuth(tile.action)
              : "href" in tile
                ? menuHrefRequiresAuth(tile.href)
                : false;
          const body = (
            <>
              <Image
                src={tile.visualSrc}
                alt=""
                fill
                sizes="248px"
                unoptimized
                className={styles.hubBg}
              />
              <span className={styles.hubTitle}>{tHome(tile.titleKey)}</span>
            </>
          );

          if ("action" in tile && tile.action) {
            const action = tile.action;
            return (
              <button
                key={tile.id}
                type="button"
                className={cardClass}
                aria-label={tHome(tile.ariaLabelKey)}
                onClick={() =>
                  runWithAuth(needsAuth, () => {
                    if (action === "coupon") openCoupon();
                    else if (action === "vip-rank") router.push("/vip");
                  })
                }
              >
                {body}
              </button>
            );
          }

          if ("href" in tile) {
            const href = tile.href;
            return (
              <Link
                key={tile.id}
                href={href}
                className={cardClass}
                title={tHome(tile.ariaLabelKey)}
                onClick={(event) => {
                  if (!needsAuth) return;
                  event.preventDefault();
                  runWithAuth(true, () => router.push(href));
                }}
              >
                {body}
              </Link>
            );
          }
          return null;
        })}
      </div>
    </aside>
  );
}
