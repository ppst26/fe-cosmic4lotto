import { Noto_Sans, Noto_Sans_Khmer, Noto_Sans_Lao, Noto_Sans_Myanmar, Noto_Sans_SC } from "next/font/google";
import type { Locale } from "./config";

/**
 * ฟอนต์เสริมตามภาษา — ทุกตัวใช้ตัวแปร --font-locale แต่ใส่ class ของภาษาปัจจุบันตัวเดียว
 * preload: false เพื่อไม่ให้หน้าไทยดึงฟอนต์ CJK/พม่า · display: swap เพราะเครื่องอาจไม่มีฟอนต์ระบบของอักษรเหล่านี้
 * th / en / id / fil ใช้ Noto Sans Thai (latin) ที่โหลดอยู่แล้ว
 */
const lao = Noto_Sans_Lao({
  variable: "--font-locale",
  subsets: ["lao", "latin"],
  weight: ["400", "500"],
  display: "swap",
  preload: false,
});

const myanmar = Noto_Sans_Myanmar({
  variable: "--font-locale",
  subsets: ["myanmar", "latin"],
  weight: ["400", "500"],
  display: "swap",
  preload: false,
});

const khmer = Noto_Sans_Khmer({
  variable: "--font-locale",
  subsets: ["khmer", "latin"],
  weight: ["400", "500"],
  display: "swap",
  preload: false,
});

const chinese = Noto_Sans_SC({
  variable: "--font-locale",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  preload: false,
});

const vietnamese = Noto_Sans({
  variable: "--font-locale",
  subsets: ["vietnamese", "latin"],
  weight: ["400", "500"],
  display: "swap",
  preload: false,
});

const LOCALE_FONT_CLASS: Partial<Record<Locale, string>> = {
  lo: lao.variable,
  my: myanmar.variable,
  km: khmer.variable,
  zh: chinese.variable,
  vi: vietnamese.variable,
};

export function localeFontClass(locale: Locale): string {
  return LOCALE_FONT_CLASS[locale] ?? "";
}
