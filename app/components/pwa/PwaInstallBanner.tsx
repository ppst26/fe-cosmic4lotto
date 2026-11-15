"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { usePwaInstall } from "./PwaInstallProvider";
import { useT } from "@/lib/i18n/I18nProvider";
import type { MessageKey } from "@/lib/i18n/messages";

/** ซ่อนแบนเนอร์หลังผู้ใช้กดปิด — แสดงอีกครั้งเมื่อครบเวลานี้ */
const DISMISS_KEY = "pwa-install-banner-dismissed-at";
const DISMISS_TTL_MS = 24 * 60 * 60 * 1000;

type InstallPlatform = "android" | "ios";

const INSTALL_STEPS: Record<InstallPlatform, MessageKey<"home">[]> = {
  android: ["a2hs.steps.android1", "a2hs.steps.android2", "a2hs.steps.android3"],
  ios: ["a2hs.steps.ios1", "a2hs.steps.ios2", "a2hs.steps.ios3"],
};

/** อ่าน/เขียน localStorage แบบกัน error (โหมดส่วนตัว / ปิด storage) */
function wasDismissedRecently(): boolean {
  try {
    const at = Number(window.localStorage.getItem(DISMISS_KEY));
    return Number.isFinite(at) && at > 0 && Date.now() - at < DISMISS_TTL_MS;
  } catch {
    return false;
  }
}

function rememberDismissed() {
  try {
    window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
  } catch {
    /* ไม่มี storage — แสดงอีกครั้งตอนโหลดหน้าถัดไป */
  }
}

function isStandalone(): boolean {
  const nav = window.navigator as Navigator & { standalone?: boolean };
  return window.matchMedia("(display-mode: standalone)").matches || nav.standalone === true;
}

/**
 * แบนเนอร์ชวนติดตั้งแอป (PWA) ด้านบนสุดของหน้า — มือถือเท่านั้น แสดงตอนโหลดหน้า
 * ปุ่มปิดซ้าย · กลาง = โลโก้แบรนด์ + คำอธิบาย · ขวา = ปุ่ม「เพิ่มปุ่มลัด」
 * sticky ชิดบนสุด และตั้ง --pwa-banner-h บน <html> ให้ header แบบ fixed/sticky เลื่อนลงมาต่อใต้แบนเนอร์
 * Android ที่เบราว์เซอร์พร้อม → เปิดหน้าต่างติดตั้งทันที · อย่างอื่นแสดงขั้นตอนใต้แบนเนอร์
 */
export function PwaInstallBanner() {
  const t = useT("home");
  const { canPrompt, promptInstall } = usePwaInstall();
  const [visible, setVisible] = useState(false);
  const [platform, setPlatform] = useState<InstallPlatform>("ios");
  const [stepsOpen, setStepsOpen] = useState(false);
  const [installing, setInstalling] = useState(false);
  const rootRef = useRef<HTMLElement>(null);

  /** บอกความสูงแบนเนอร์ให้ header ที่ fixed/sticky (--pwa-banner-h) — เป็น 0 เมื่อซ่อน/จอใหญ่ */
  useEffect(() => {
    const el = rootRef.current;
    const root = document.documentElement;
    if (!visible || !el) {
      root.style.removeProperty("--pwa-banner-h");
      return;
    }
    const sync = () => root.style.setProperty("--pwa-banner-h", `${el.offsetHeight}px`);
    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(el);
    return () => {
      observer.disconnect();
      root.style.removeProperty("--pwa-banner-h");
    };
  }, [visible, stepsOpen]);

  /** ตัดสินใจหลัง mount เท่านั้น (อ่าน storage / display-mode) กัน hydration mismatch */
  /* eslint-disable react-hooks/set-state-in-effect -- ค่าอ่านได้เฉพาะฝั่ง browser หลัง mount */
  useEffect(() => {
    setPlatform(/android/i.test(window.navigator.userAgent) ? "android" : "ios");
    setVisible(!isStandalone() && !wasDismissedRecently());
    const onInstalled = () => setVisible(false);
    window.addEventListener("appinstalled", onInstalled);
    return () => window.removeEventListener("appinstalled", onInstalled);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  if (!visible) return null;

  const dismiss = () => {
    rememberDismissed();
    setVisible(false);
  };

  const handleAdd = async () => {
    if (platform === "android" && canPrompt) {
      setInstalling(true);
      const outcome = await promptInstall();
      setInstalling(false);
      if (outcome === "accepted") {
        setVisible(false);
        return;
      }
      if (outcome === "dismissed") return;
    }
    setStepsOpen((open) => !open);
  };

  return (
    <section
      ref={rootRef}
      className="sticky top-0 z-[60] w-full bg-gradient-to-b from-[#303034] to-[#1b1b1e] pt-[env(safe-area-inset-top,0px)] text-white lg:hidden"
      aria-label={t("a2hs.cardTitle")}
    >
      <div className="flex items-center gap-3 px-3 py-2.5">
        <button
          type="button"
          onClick={dismiss}
          aria-label={t("a2hs.closeAria")}
          className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-full border-0 bg-transparent text-white/80 hover:text-white"
        >
          <X size={20} aria-hidden="true" />
        </button>

        <div className="min-w-0 flex-1">
          <Image src="/cosmic-dark.png" alt="cosmicbet" width={600} height={116} className="h-6 w-auto" priority />
          <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-white/75">{t("a2hs.bannerSubtitle")}</p>
        </div>

        <button
          type="button"
          onClick={() => void handleAdd()}
          disabled={installing}
          aria-expanded={stepsOpen}
          className="shrink-0 cursor-pointer whitespace-nowrap rounded-lg border-0 bg-[var(--t-action,var(--brand,var(--action-solid,#7c3aed)))] px-4 py-2 text-xs font-bold text-white disabled:opacity-60"
        >
          {t("a2hs.addButton")}
        </button>
      </div>

      {stepsOpen ? (
        <ol className="m-0 flex list-none flex-col gap-1.5 border-t border-white/10 px-4 py-3 text-[11px] leading-snug text-white/80">
          {INSTALL_STEPS[platform].map((step, index) => (
            <li key={step} className="flex items-start gap-2">
              <span className="grid size-4 shrink-0 place-items-center rounded-full bg-white/15 text-[10px] font-bold">
                {index + 1}
              </span>
              <span>{t(step)}</span>
            </li>
          ))}
        </ol>
      ) : null}
    </section>
  );
}
