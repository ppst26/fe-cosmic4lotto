/* ── จาก app/data/footerMockData.ts ── */

import type { MessageKey } from "@/lib/i18n/messages";

/** ลิงก์ที่ป้ายแปลตาม dictionary nav — render ด้วย useT("nav")(labelKey) */
export interface FooterNavLink {
  labelKey: MessageKey<"nav">;
  href: string;
}

/** ลิงก์ชื่อแบรนด์ภายนอก — ไม่แปล */
export interface FooterBrandLink {
  label: string;
  href: string;
}

export interface FooterLinkColumn {
  titleKey: MessageKey<"nav">;
  links: FooterNavLink[];
}

export interface FooterSocialIcon {
  label: string;
  href: string;
  icon:
    | "telegram"
    | "x"
    | "discord"
    | "instagram"
    | "youtube"
    | "line"
    | "medium"
    | "linkedin"
    | "reddit"
    | "tiktok";
}

/** โลโก้ธนาคาร/ช่องทางชำระ — footer desktop (public/assets/bank-logo) */
export interface FooterPaymentBank {
  id: string;
  name: string;
  logoSrc: string;
}
