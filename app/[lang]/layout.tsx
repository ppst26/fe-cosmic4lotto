import type { Metadata, Viewport } from "next";
import type React from "react";
import { Kanit } from "next/font/google";
import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import "@/app/globals.css";
import { AppProviders } from "@/components/AppProviders";
import { LOCALES, hasLocale } from "@/lib/i18n/config";
import { localeFontClass } from "@/lib/i18n/fonts";
import { MessagesBoundary } from "@/lib/i18n/MessagesBoundary";
import { NAMESPACES } from "@/lib/i18n/messages";
import { getT } from "@/lib/i18n/server";
import { DEFAULT_THEME, LIGHT_THEME_KEYS, THEME_KEYS, THEME_STORAGE_KEY } from "@/lib/themes";

/** ตั้ง data-theme / data-mode / class dark ก่อน paint ครั้งแรก — สคริปต์เดียวกับ glass */
const THEME_INIT_SCRIPT = `try{var k=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});var d=document.documentElement;if(!(k&&${JSON.stringify(THEME_KEYS)}.indexOf(k)>-1))k=${JSON.stringify(DEFAULT_THEME)};var l=${JSON.stringify(LIGHT_THEME_KEYS)}.indexOf(k)>-1;d.dataset.theme=k;d.dataset.mode=l?"light":"dark";d.classList.toggle("dark",!l)}catch(e){}`;

const kanit = Kanit({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-kanit",
});

export function generateStaticParams() {
  return LOCALES.map((code) => ({ lang: code }));
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT("meta");
  return {
    applicationName: "CM-SaturnLotto",
    title: t("title"),
    description: t("description"),
    appleWebApp: { capable: true, title: "CM-SaturnLotto", statusBarStyle: "black-translucent" },
    icons: { apple: "/pwa/apple-touch-icon.png" },
  };
}

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#0d0d0f",
};

/**
 * RootLayout ต่อภาษา — โครงตาม glass app/[lang]/layout.tsx · ฟอนต์ Kanit/ธีมมืด-ทองเป็นของ lotto
 */
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await lang();
  if (!hasLocale(locale)) notFound();

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`dark ${kanit.variable} ${localeFontClass(locale)}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <MessagesBoundary namespaces={NAMESPACES}>
          <AppProviders>{children}</AppProviders>
        </MessagesBoundary>
      </body>
    </html>
  );
}
