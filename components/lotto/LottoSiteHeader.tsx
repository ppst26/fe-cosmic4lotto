import Image from "next/image";
import Link from "next/link";
import type { WalletSnapshot } from "@/lib/lotto/load-wallet-snapshot";

const LOGO_SRC =
  "/_cdn/d29xpgmn3rqne6.cloudfront.net/bblotto/setting/1766505922869";

type Props = {
  loggedIn?: boolean;
  wallet?: WalletSnapshot;
  /** desktop ≥1024 + sidebar — ซ่อน wallet/ฝากใน header */
  hideWalletOnDesktop?: boolean;
};

function BahtIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden
    >
      <path
        d="M76.9458 67.02C76.9458 74.6368 74.8257 80.4083 70.5854 84.3345C66.4236 88.1822 60.0632 90.263 51.5041 90.5771V100H42.1991V90.5771H23V8.12721H42.1991V0H51.5041V8.36278C66.2666 9.77621 73.6478 16.2937 73.6478 27.9152C73.6478 32.5481 72.627 36.3565 70.5854 39.3404C68.5438 42.3243 65.3636 44.6407 61.0448 46.2897V46.6431C66.5414 48.1351 70.5461 50.53 73.0589 53.828C75.6502 57.0475 76.9458 61.4448 76.9458 67.02ZM33.8363 42.874H47.4994C52.5249 42.874 56.3333 41.6961 58.9246 39.3404C61.5159 36.9062 62.8115 33.3726 62.8115 28.7397C62.8115 24.5779 61.3981 21.5548 58.5713 19.6702C55.7444 17.7856 51.2685 16.8433 45.1437 16.8433H33.8363V42.874ZM49.7373 81.861C60.7307 81.861 66.2273 76.8355 66.2273 66.7844C66.2273 61.3663 64.4998 57.4009 61.0448 54.8881C57.6682 52.3753 52.2894 51.119 44.9081 51.119H33.8363V81.861H49.7373Z"
        fill="#FFD15C"
      />
    </svg>
  );
}

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
        <div className="header-inner">
          <div
            className={`header-row ${loggedIn ? "header-row--desktop-logged-in" : ""}`}
          >
            <Link href="/">
              <Image
                src={LOGO_SRC}
                alt="XGAMBET"
                width={100}
                height={60}
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
              <HeaderMenu />
            </div>
          </div>
          {loggedIn ? (
            <div className={`deposit-row ${walletDesktopClass}`}>
              <button type="button" className="bb-btn bb-btn-primary">
                ฝากเงิน
              </button>
              <button type="button" className="bb-btn bb-btn-secondary">
                ถอนเงิน
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
