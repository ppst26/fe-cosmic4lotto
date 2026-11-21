import Image from "next/image";
import { ArrowRight, Gift, Megaphone, Star } from "lucide-react";
import Link from "@/lib/i18n/navigation";
import { FeatureHeroCarousel } from "./FeatureHeroCarousel";
import styles from "./desktop-feature-cards.module.css";

type HeroCard = {
  key: string;
  href: string;
  title: string;
  linkTitle: string;
  linkDesc: string;
  art: string;
  /** สีธีมของการ์ด (glow + ขอบ) */
  tone: "blue" | "purple" | "orange";
};

/** การ์ดหวยเด่น (carousel) — หวยไทย · ยี่กี 15 นาที · หวยลาว — ข้อความ mock ยังไม่เชื่อมข้อมูลจริง */
const HERO_CARDS: HeroCard[] = [
  {
    key: "thai",
    href: "/lottery/thai-government",
    title: "หวยไทย",
    linkTitle: "ออกผลวันที่ 1 และ 16",
    linkDesc: "รางวัลที่ 1 จ่ายสูงสุด\nแทงได้จนถึงก่อนออกผล",
    art: "/lottery/ic-government-effect.webp",
    tone: "orange",
  },
  {
    key: "yiki15",
    href: "/lottery/yiki-15",
    title: "หวยยี่กี 15 นาที",
    linkTitle: "ออกผลทุก 15 นาที",
    linkDesc: "แทงง่าย รอไม่นาน\nลุ้นรางวัลได้ทั้งวัน",
    art: "/lottery/ic-stock_yk15-effect.webp",
    tone: "blue",
  },
  {
    key: "laos",
    href: "/lottery/laos",
    title: "หวยลาว",
    linkTitle: "ออกผลทุกวันจันทร์ พุธ ศุกร์",
    linkDesc: "ผลออกรวดเร็ว\nเลือกแทง 2-3 ตัว",
    art: "/lottery/ic-laos-effect.webp",
    tone: "purple",
  },
];

/**
 * การ์ดฟีเจอร์หน้าแรก — desktop (≥1024) วางใต้ welcome banner · mobile={true} = เวอร์ชันมือถือ (การ์ดบนเลื่อนข้าง แถบล่างเรียงลง) วางก่อนเมนูหมวด
 * แถวบน 3 การ์ดใหญ่ (รูปล้นขวา) · แถวล่าง 2 การ์ดแถบยาว — layout ตามภาพอ้างอิงใน design.md
 */
export function DesktopFeatureCards({ mobile = false }: { mobile?: boolean }) {
  return (
    <section className={`${styles.root} ${mobile ? styles.rootMobile : styles.rootDesktop}`} aria-label="ฟีเจอร์แนะนำ">
      <FeatureHeroCarousel label="หวยแนะนำ">
        {HERO_CARDS.map((card) => (
          <Link key={card.key} href={card.href} className={`${styles.hero} ${styles[card.tone]}`}>
            <span className={styles.heroArt} aria-hidden>
              <Image src={card.art} alt="" fill sizes="220px" className={styles.heroArtImg} unoptimized />
            </span>
            <span className={`${styles.heroBody}`}>
              <span className={styles.linkRow}>
                <span className={styles.linkArrow}>
                  <ArrowRight className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
                </span>
                <span className={styles.linkText}>
                  <b>{card.linkTitle}</b>
                  {card.linkDesc}
                </span>
              </span>
              <span className={styles.heroTitle}>{card.title}</span>
            </span>
          </Link>
        ))}
      </FeatureHeroCarousel>

      <div className={styles.stripRow}>
        <Link href="/promotions" className={`${styles.strip} ${styles.stripPromo}`}>
          <span className={styles.stripIcon}>
            <Megaphone className="h-6 w-6" aria-hidden="true" />
          </span>
          <span className={styles.stripText}>
            <span className={styles.stripTitle}>โปรโมชั่น</span>
            <span className={styles.stripDesc}>
              โบนัสฝากแรก คืนยอดเสีย และสิทธิพิเศษ
              <br />
              สำหรับสมาชิก เลือกรับได้ตามเงื่อนไข
            </span>
          </span>
          <span className={styles.hex}>
            <Star className="h-5 w-5" aria-hidden="true" />
          </span>
        </Link>

        <Link href="/events" className={`${styles.strip} ${styles.stripEvent}`}>
          <span className={styles.stripIcon}>
            <Gift className="h-6 w-6" aria-hidden="true" />
          </span>
          <span className={styles.stripText}>
            <span className={styles.stripTitle}>กิจกรรมพิเศษ</span>
          </span>
          <span className={styles.stripDivider} aria-hidden />
          <span className={`${styles.stripDesc} ${styles.stripDescGrow}`}>
            ร่วมกิจกรรมสุดพิเศษ
            <br />
            สะสมแต้มและลุ้นรางวัลทุกวัน
          </span>
          <span className={`${styles.hex} ${styles.hexGold}`}>
            <Star className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className={styles.chips} aria-hidden>
            {["เช็คอิน", "วงล้อ", "สุ่ม", "ทายผล"].map((label) => (
              <span key={label} className={styles.chip}>
                {label}
              </span>
            ))}
          </span>
        </Link>
      </div>
    </section>
  );
}
