import { spawnSync } from "node:child_process";
import { createSerwistRoute } from "@serwist/turbopack";
import { LOCALES } from "@/lib/i18n/config";
import { withLocale } from "@/lib/i18n/routing";

const revision =
  spawnSync("git", ["rev-parse", "HEAD"], { encoding: "utf-8" }).stdout?.trim() ||
  crypto.randomUUID();

/**
 * ส่งไฟล์ service worker ที่ /serwist/sw.js
 * precache เฉพาะ JS/CSS ของ Next กับไอคอน PWA — ไม่ดึงรูป public ทั้งโฟลเดอร์
 */
export const { dynamic, dynamicParams, revalidate, generateStaticParams, GET } = createSerwistRoute({
  additionalPrecacheEntries: LOCALES.map((code) => ({ url: withLocale("/offline", code), revision })),
  swSrc: "app/sw.ts",
  useNativeEsbuild: true,
  globPatterns: [".next/static/**/*.{js,css}", "public/pwa/**/*.png"],
});
