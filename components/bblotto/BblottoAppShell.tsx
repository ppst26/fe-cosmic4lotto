"use client";

import nuxtRuntimeConfig from "@/lib/bblotto/nuxt-runtime-config.json";
import Script from "next/script";
const NUXT_DATA = [
  { prerenderedAt: 1, serverRendered: 2 },
  1789720220463,
  false,
];

export function BblottoAppShell() {
  return (
    <>
      <script
        type="application/json"
        data-nuxt-data="nuxt-app"
        data-ssr="false"
        id="__NUXT_DATA__"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(NUXT_DATA) }}
      />
      <div id="__nuxt" suppressHydrationWarning />
      <div id="teleports" suppressHydrationWarning />
      <Script src="/assets/js/theme-svg.js" strategy="beforeInteractive" />
      <Script src="/geetest-v4.js" strategy="lazyOnload" />
      <Script src="/pixel.js" strategy="lazyOnload" />
      <Script
        id="nuxt-runtime-config"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `window.__NUXT__=window.__NUXT__||{};window.__NUXT__.config=${JSON.stringify(nuxtRuntimeConfig)};`,
        }}
      />
      <Script
        type="module"
        src="/_nuxt/entry.D9y5y_CT.js"
        crossOrigin=""
        strategy="afterInteractive"
      />
    </>
  );
}

declare global {
  interface Window {
    __NUXT__?: { config: typeof nuxtRuntimeConfig };
  }
}
