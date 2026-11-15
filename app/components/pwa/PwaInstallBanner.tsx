"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import Link, { usePathname } from "@/lib/i18n/navigation";
import { useT } from "@/lib/i18n/I18nProvider";

/** ซ่อนแบนเนอร์หลังผู้ใช้กดปิด — แสดงอีกครั้งเมื่อครบเวลานี้ */
const DISMISS_KEY = "pwa-install-banner-dismissed-at";
const DISMISS_TTL_MS = 24 * 60 * 60 * 1000;

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
 * ปุ่มปิดซ้าย · กลาง = โลโก้แบรนด์ + คำอธิบาย · ขวา = ปุ่ม「เพิ่มปุ่มลัด」→ หน้า /download (ขั้นตอน + ปุ่มติดตั้ง)
 * sticky ชิดบนสุด และตั้ง --pwa-banner-h บน <html> ให้ header แบบ fixed/sticky เลื่อนลงมาต่อใต้แบนเนอร์
 */
export function PwaInstallBanner() {
  const t = useT("home");
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const onDownloadPage = pathname === "/download";

  /** ตัดสินใจหลัง mount เท่านั้น (อ่าน storage / display-mode) กัน hydration mismatch */
  /* eslint-disable react-hooks/set-state-in-effect -- ค่าอ่านได้เฉพาะฝั่ง browser หลัง mount */
  useEffect(() => {
    setVisible(!isStandalone() && !wasDismissedRecently());
    const onInstalled = () => setVisible(false);
    window.addEventListener("appinstalled", onInstalled);
    return () => window.removeEventListener("appinstalled", onInstalled);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const shown = visible && !onDownloadPage;

  /** บอกความสูงแบนเนอร์ให้ header ที่ fixed/sticky (--pwa-banner-h) — เป็น 0 เมื่อซ่อน/จอใหญ่ */
  useEffect(() => {
    const el = rootRef.current;
    const root = document.documentElement;
    if (!shown || !el) {
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
  }, [shown]);

  if (!shown) return null;

  const dismiss = () => {
    rememberDismissed();
    setVisible(false);
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
          <div className="flex items-center gap-2">
            <Image src="/cosmic-dark.png" alt="cosmicbet" width={600} height={116} className="h-6 w-auto" priority />
            {/* ลิงก์ดูวิธีโหลด — ต่อท้ายโลโก้ ตัวอักษรสีม่วงเด่น เปิดหน้า /download */}
            <Link
              href="/download"
              className="whitespace-nowrap text-xs font-extrabold text-[color-mix(in_srgb,var(--t-action,var(--brand,var(--action-solid,#7c3aed)))_55%,#ffffff)] underline decoration-2 underline-offset-2"
            >
              {t("a2hs.howTo")}
            </Link>
          </div>
          <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-white/75">{t("a2hs.bannerSubtitle")}</p>
        </div>

        <Link
          href="/download"
          className="shrink-0 whitespace-nowrap rounded-lg bg-[var(--t-action,var(--brand,var(--action-solid,#7c3aed)))] px-4 py-2 text-xs font-bold text-white no-underline"
        >
          {t("a2hs.addButton")}
        </Link>
      </div>
    </section>
  );
}
