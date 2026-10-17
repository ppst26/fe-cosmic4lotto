import Image from "next/image";
import Link from "next/link";
import { BahtIcon } from "./BahtIcon";
import { HeaderAvatar } from "./HeaderAvatar";
import { LottoDesktopHeader } from "./LottoDesktopHeader";
import type { WalletSnapshot } from "@/lib/lotto/load-wallet-snapshot";

/** โลโก้หลัก — public/cosmic-dark.png (1123×217) */
const LOGO_SRC = "/cosmic-dark.png";

type Props = {
  loggedIn?: boolean;
  wallet?: WalletSnapshot;
  /** desktop ≥1024 + sidebar — ซ่อน wallet/ฝากใน header */
  hideWalletOnDesktop?: boolean;
};

function TransferIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M14.8535 4.64649L11.8535 1.64649C11.7105 1.50349 11.496 1.46149 11.3085 1.53799C11.1215 1.61549 11 1.79799 11 1.99999V3.49999H3.5C2.6715 3.49999 2 4.17149 2 4.99999C2 5.82849 2.6715 6.49999 3.5 6.49999H11V7.99999C11 8.20199 11.1215 8.38449 11.3085 8.46199C11.4965 8.53949 11.711 8.49599 11.8535 8.35349L14.8535 5.35349C15.049 5.15849 15.049 4.84149 14.8535 4.64649Z"
        fill="black"
      />
      <path
        d="M12.5 9.49999H4.99999V7.99999C4.99999 7.79799 4.87849 7.61549 4.69149 7.53799C4.50449 7.46049 4.28999 7.50299 4.14649 7.64649L1.14649 10.6465C0.951494 10.8415 0.951494 11.1585 1.14649 11.3535L4.14649 14.3535C4.28899 14.496 4.50349 14.5395 4.69149 14.462C4.87849 14.3845 4.99999 14.202 4.99999 14V12.5H12.5C13.3285 12.5 14 11.8285 14 11C14 10.1715 13.3285 9.49999 12.5 9.49999Z"
        fill="black"
      />
    </svg>
  );
}

function HeaderMenu() {
  return (
    <div className="hamburger-template-1 relative">
      <label htmlFor="lotto-header-menu-check">
        <span />
        <span />
        <span />
      </label>
      <input id="lotto-header-menu-check" type="checkbox" className="sr-only" />
    </div>
  );
}

/** Header 1:1 จาก dump (guest + logged-in) */
export function LottoSiteHeader({
  loggedIn = false,
  wallet = { money: "0.00", credit: "0.00" },
  hideWalletOnDesktop = true,
}: Props) {
  const walletDesktopClass =
    hideWalletOnDesktop && loggedIn ? "header-hide-with-sidebar" : "";

  return (
    <header className="lotto-site-header w-full z-10 relative">
      <div className="header-shell">
        <LottoDesktopHeader
          logoSrc={LOGO_SRC}
          loggedIn={loggedIn}
          wallet={wallet}
        />
        <div className="header-inner header-inner--mobile">
          <div
            className={`header-row ${loggedIn ? "header-row--desktop-logged-in" : ""}`}
          >
            <Link href="/">
              <Image
                src={LOGO_SRC}
                alt="CM-SaturnLotto"
                width={1123}
                height={217}
                className="header-logo"
                priority
                unoptimized
              />
            </Link>
            <div className="header-actions">
              {loggedIn ? (
                <div className={`wallet-wrapper ${walletDesktopClass}`}>
                  <div className="wallet-lines">
                    <div className="wallet-row">
                      <span>เงิน</span>
                      <span className="wallet-value">
                        <BahtIcon />
                        {wallet.money}
                      </span>
                    </div>
                    <div className="gold-line" />
                    <div className="wallet-row wallet-row--credit">
                      <span>เครดิต</span>
                      <span className="wallet-value">{wallet.credit}</span>
                    </div>
                  </div>
                  <div className="transfer-icon">
                    <TransferIcon />
                  </div>
                </div>
              ) : (
                <div className="auth-buttons">
                  <button type="button" className="bb-btn bb-btn-primary">
                    เข้าสู่ระบบ
                  </button>
                  <button type="button" className="bb-btn bb-btn-secondary">
                    สมัครสมาชิก
                  </button>
                </div>
              )}
              {loggedIn ? <HeaderAvatar /> : null}
              <HeaderMenu />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
