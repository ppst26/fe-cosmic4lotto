import type { Metadata, Viewport } from "next";
import type React from "react";
import { Noto_Sans_Thai } from "next/font/google";
import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import "@/app/globals.css";
import { ShellRailProvider } from "@/components/layout/shell-rail-context";
import { ResultsRail } from "@/components/lotto/ResultsRail";
import { loadBankLottoFromDump, loadDashboardLottoFromDump, loadThaiLottoFromDump } from "@/lib/lotto/load-dump-snapshots";
import { bankLottoMock, dashboardLottoMock, thaiLottoMock } from "@/lib/lotto/mock-home-data";
import { AppProviders } from "@/components/AppProviders";
import { CosmicFooterGate } from "@/app/components/layout/CosmicFooterGate";
import { LOCALES, hasLocale } from "@/lib/i18n/config";
import { localeFontClass } from "@/lib/i18n/fonts";
import { MessagesBoundary } from "@/lib/i18n/MessagesBoundary";
import { NAMESPACES } from "@/lib/i18n/messages";
import { getT } from "@/lib/i18n/server";
import { DEFAULT_THEME, LIGHT_THEME_KEYS, THEME_KEYS, THEME_STORAGE_KEY } from "@/lib/themes";

/** ตั้ง data-theme / data-mode / class dark ก่อน paint ครั้งแรก — สคริปต์เดียวกับ glass */
const THEME_INIT_SCRIPT = `try{var k=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});var d=document.documentElement;if(!(k&&${JSON.stringify(THEME_KEYS)}.indexOf(k)>-1))k=${JSON.stringify(DEFAULT_THEME)};var l=${JSON.stringify(LIGHT_THEME_KEYS)}.indexOf(k)>-1;d.dataset.theme=k;d.dataset.mode=l?"light":"dark";d.classList.toggle("dark",!l)}catch(e){}`;

const notoSans = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600"],
  variable: "--font-noto",
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
 * RootLayout ต่อภาษา — โครงตาม glass app/[lang]/layout.tsx · ฟอนต์ Noto Sans/ธีมมืด-ทองเป็นของ lotto
 */
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await lang();
  if (!hasLocale(locale)) notFound();

  // แถบผลหวยขวา (desktop) เป็นเปลือกค่าเริ่มต้นของทุกหน้า — ดึงข้อมูลที่นี่ครั้งเดียว (cache ต่อ request)
  const [thaiRaw, bankLotto, dashboardLotto] = await Promise.all([
    loadThaiLottoFromDump(),
    loadBankLottoFromDump(),
    loadDashboardLottoFromDump(),
  ]);
  const rail = (
    <ResultsRail
      thai={thaiRaw ?? thaiLottoMock}
      bank={bankLotto.length > 0 ? bankLotto : bankLottoMock}
      dashboard={dashboardLotto.length > 0 ? dashboardLotto : dashboardLottoMock}
    />
  );

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`dark ${notoSans.variable} ${localeFontClass(locale)}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="flex min-h-dvh min-w-0 flex-col">
        <MessagesBoundary namespaces={NAMESPACES}>
          <AppProviders>
            <ShellRailProvider rail={rail}>
              <div className="flex min-h-dvh min-w-0 flex-1 flex-col">
                <div className="flex min-h-0 min-w-0 flex-1 flex-col">{children}</div>
                <CosmicFooterGate />
              </div>
            </ShellRailProvider>
          </AppProviders>
        </MessagesBoundary>
      </body>
    </html>
  );
}
