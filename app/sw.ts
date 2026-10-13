/// <reference lib="esnext" />
/// <reference lib="webworker" />
import { defaultCache } from "@serwist/turbopack/worker";
import { NetworkOnly, type PrecacheEntry, type SerwistGlobalConfig, Serwist } from "serwist";
import { DEFAULT_LOCALE, LOCALES } from "../lib/i18n/config";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

/**
 * entry แรกที่ match ชนะ — ภาษาอื่นเทียบ prefix ก่อน แล้วไทยรับทุก document ที่เหลือ
 * ไทยไม่มี prefix ใน URL (/offline) — ต้องตรงกับ additionalPrecacheEntries ใน app/serwist/[path]/route.ts
 */
const offlineFallbacks = [
  ...LOCALES.filter((code) => code !== DEFAULT_LOCALE).map((code) => ({
    url: `/${code}/offline`,
    matcher({ request }: { request: Request }) {
      const { pathname } = new URL(request.url);
      return request.destination === "document" && (pathname === `/${code}` || pathname.startsWith(`/${code}/`));
    },
  })),
  {
    url: "/offline",
    matcher({ request }: { request: Request }) {
      return request.destination === "document";
    },
  },
];

/**
 * Service worker ของ PWA มือถือ
 * API และคำขอข้าม origin ไม่ถูก cache — กันยอดเงิน/เซสชันค้าง
 * ถูก build โดย app/serwist/[path]/route.ts
 */
const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    {
      matcher: ({ sameOrigin, url: { pathname } }) => sameOrigin && pathname.startsWith("/api/"),
      handler: new NetworkOnly(),
    },
    {
      matcher: ({ sameOrigin }) => !sameOrigin,
      handler: new NetworkOnly(),
    },
    ...defaultCache,
  ],
  fallbacks: { entries: offlineFallbacks },
});

serwist.addEventListeners();
