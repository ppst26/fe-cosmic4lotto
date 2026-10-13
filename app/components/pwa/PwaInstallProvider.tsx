"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

/** ตรงกับ breakpoint lg ของการ์ดเพิ่มปุ่มลัด — ลงทะเบียน SW เฉพาะมือถือ */
const MOBILE_INSTALL_QUERY = "(max-width: 1023px)";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

type InstallOutcome = "accepted" | "dismissed" | "unavailable";

interface PwaInstallContextValue {
  canPrompt: boolean;
  promptInstall: () => Promise<InstallOutcome>;
}

const PwaInstallContext = createContext<PwaInstallContextValue | null>(null);

/**
 * ฟัง beforeinstallprompt และลงทะเบียน service worker บนมือถือเท่านั้น
 * ใช้ใน AppProviders · ปุ่มติดตั้งอยู่ที่ HomeScreenShortcutPromo
 */
export function PwaInstallProvider({ children }: { children: React.ReactNode }) {
  const deferredRef = useRef<BeforeInstallPromptEvent | null>(null);
  const [canPrompt, setCanPrompt] = useState(false);

  useEffect(() => {
    const onPrompt = (event: Event) => {
      event.preventDefault();
      deferredRef.current = event as BeforeInstallPromptEvent;
      setCanPrompt(true);
    };
    const onInstalled = () => {
      deferredRef.current = null;
      setCanPrompt(false);
    };

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);

    const media = window.matchMedia(MOBILE_INSTALL_QUERY);

    const unregisterAllWorkers = () => {
      void navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          void registration.unregister();
        }
      });
    };

    const unregisterSerwistWorkers = () => {
      void navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          const scriptUrl =
            registration.active?.scriptURL ??
            registration.installing?.scriptURL ??
            registration.waiting?.scriptURL ??
            "";
          if (scriptUrl.includes("/serwist/")) void registration.unregister();
        }
      });
    };

    const syncWorker = () => {
      if (!("serviceWorker" in navigator)) return;
      /** dev — ถอด SW ทั้งหมด กันแคช chunk/CSS ค้างจน Turbopack HMR พัง */
      if (process.env.NODE_ENV !== "production") {
        unregisterAllWorkers();
        return;
      }
      if (!media.matches) {
        unregisterSerwistWorkers();
        return;
      }
      void navigator.serviceWorker.register("/serwist/sw.js", { scope: "/", type: "module" });
    };

    syncWorker();
    media.addEventListener("change", syncWorker);

    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
      media.removeEventListener("change", syncWorker);
    };
  }, []);

  const promptInstall = useCallback(async (): Promise<InstallOutcome> => {
    const event = deferredRef.current;
    if (!event) return "unavailable";
    await event.prompt();
    const choice = await event.userChoice;
    deferredRef.current = null;
    setCanPrompt(false);
    return choice.outcome;
  }, []);

  const value = useMemo(() => ({ canPrompt, promptInstall }), [canPrompt, promptInstall]);

  return <PwaInstallContext.Provider value={value}>{children}</PwaInstallContext.Provider>;
}

/** อ่านสถานะติดตั้ง PWA — ใช้ใน HomeScreenShortcutPromo */
export function usePwaInstall() {
  const context = useContext(PwaInstallContext);
  if (!context) {
    throw new Error("usePwaInstall ต้องใช้ภายใน PwaInstallProvider");
  }
  return context;
}
