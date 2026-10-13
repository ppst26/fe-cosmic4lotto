import Image from "next/image";
import Link from "next/link";
import { bottomNavItems } from "@/lib/lotto/mock-home-data";
import styles from "./bottom-nav.module.css";

const icons: Record<string, string> = {
  home: "🏠",
  promo: "📣",
  bet: "🎱",
  activity: "🎁",
  deposit: "💰",
};

export function BottomNavLotto({ loggedIn }: { loggedIn?: boolean }) {
  return (
    <nav className={styles.wrapper} aria-label="เมนูหลัก">
      <div className={styles.footer}>
        <div className={styles.menu}>
          {(loggedIn
            ? bottomNavItems.map((i) =>
                i.id === "deposit"
                  ? { ...i, label: "ฝาก/ถอน" }
                  : i,
              )
            : bottomNavItems
          ).map((item) => {
            const content = (
              <>
                {item.center ? (
                  <div className={styles.badge}>
                    <Image
                      src="/_nuxt/png/lottoFooter.D-kpI84T.png"
                      alt=""
                      width={70}
                      height={80}
                      className={styles.badgeImg}
                    />
                  </div>
                ) : (
                  <span className={styles.icon}>{icons[item.id]}</span>
                )}
                <span className={styles.label}>{item.label}</span>
              </>
            );

            const className = [
              styles.item,
              item.center ? styles.center : "",
              item.active ? styles.active : "",
            ]
              .filter(Boolean)
              .join(" ");

            if (item.center) {
              return (
                <Link key={item.id} href={item.href} className={className}>
                  {content}
                </Link>
              );
            }

            return (
              <Link key={item.id} href={item.href} className={className}>
                {content}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
