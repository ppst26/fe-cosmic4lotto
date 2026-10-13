import type { MetadataRoute } from "next";

/**
 * Web App Manifest — ให้มือถือติดตั้ง XGAMBET เป็นแอป (Add to Home Screen)
 * ไอคอนอยู่ที่ public/pwa · ใช้คู่กับ service worker ใน app/sw.ts
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "XGAMBET",
    short_name: "XGAMBET",
    description: "XGAMBET หวยออนไลน์",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0d0d0f",
    theme_color: "#0d0d0f",
    icons: [
      {
        src: "/pwa/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/pwa/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/pwa/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
