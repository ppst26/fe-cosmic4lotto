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
    <html lang={locale} className={`dark ${kanit.variable} ${localeFontClass(locale)}`}>
      <body>
        <MessagesBoundary namespaces={NAMESPACES}>
          <AppProviders>{children}</AppProviders>
        </MessagesBoundary>
      </body>
    </html>
  );
}
