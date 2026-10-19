"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { useT } from "@/lib/i18n/I18nProvider";
import { cn } from "@/lib/utils";

interface MockGameViewportProps {
  gameId: string;
  title: string;
  provider?: string;
  className?: string;
}

/** Fullscreen API ที่เบราว์เซอร์นี้ใช้ได้ (รวมแบบ webkit) — iPhone Safari ไม่มีให้ element ทั่วไป */
type FullscreenCapableElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
};
type FullscreenCapableDocument = Document & {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void> | void;
};

function nativeFullscreenElement(): Element | null {
  const doc = document as FullscreenCapableDocument;
  return doc.fullscreenElement ?? doc.webkitFullscreenElement ?? null;
}

/**
 * พื้นที่ mock เกมกลางจอ (หน้า /play/[gameId])
 * ปุ่มเต็มจอ: Fullscreen API ก่อน · ไม่รองรับ/ถูกปฏิเสธ → โหมดเต็มจอแบบ CSS (fixed คลุม viewport) · ออกด้วยปุ่มเดิมหรือ Esc
 */
export function MockGameViewport({ gameId, title, provider, className }: MockGameViewportProps) {
  const t = useT("games");
  const rootRef = useRef<HTMLElement>(null);
  const [isNativeFullscreen, setIsNativeFullscreen] = useState(false);
  const [isPseudoFullscreen, setIsPseudoFullscreen] = useState(false);
  const isFullscreen = isNativeFullscreen || isPseudoFullscreen;

  useEffect(() => {
    const onChange = () => setIsNativeFullscreen(nativeFullscreenElement() === rootRef.current);
    document.addEventListener("fullscreenchange", onChange);
    document.addEventListener("webkitfullscreenchange", onChange);
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      document.removeEventListener("webkitfullscreenchange", onChange);
    };
  }, []);

  /** โหมดเต็มจอแบบ CSS: ล็อกการเลื่อนของหน้า + ออกด้วย Esc */
  useEffect(() => {
    if (!isPseudoFullscreen) return;
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsPseudoFullscreen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.documentElement.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isPseudoFullscreen]);

  const toggleFullscreen = useCallback(async () => {
    const el = rootRef.current as FullscreenCapableElement | null;
    if (!el) return;

    if (isPseudoFullscreen) {
      setIsPseudoFullscreen(false);
      return;
    }
    if (nativeFullscreenElement() === el) {
      const doc = document as FullscreenCapableDocument;
      try {
        await (doc.exitFullscreen?.() ?? doc.webkitExitFullscreen?.());
      } catch {
        /* ปล่อยให้ผู้ใช้ออกด้วยท่าทางของเบราว์เซอร์ */
      }
      return;
    }

    const request = el.requestFullscreen?.bind(el) ?? el.webkitRequestFullscreen?.bind(el);
    if (request) {
      try {
        await request();
        if (nativeFullscreenElement() === el) return;
      } catch {
        /* ถูกปฏิเสธ — ใช้แบบ CSS */
      }
    }
    setIsPseudoFullscreen(true);
  }, [isPseudoFullscreen]);

  const Icon = isFullscreen ? Minimize2 : Maximize2;

  return (
    <section
      ref={rootRef}
      className={cn(
        "relative flex h-full w-full items-center justify-center overflow-hidden bg-[var(--soft-canvas)]",
        isPseudoFullscreen && "fixed inset-0 z-[200] h-dvh w-screen",
        className,
      )}
      aria-label={t("play.playingAriaLabel", { title })}
    >
      <button
        type="button"
        onClick={() => void toggleFullscreen()}
        aria-label={isFullscreen ? t("play.exitFullscreen") : t("play.fullscreen")}
        aria-pressed={isFullscreen}
        className="soft-btn-outline absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full"
      >
        <Icon className="h-4 w-4" aria-hidden />
      </button>

      <div className="soft-panel mx-4 flex w-full max-w-xl flex-col items-center gap-2 border border-dashed border-[var(--brand)] px-6 py-14 text-center">
        <p className="rounded-full bg-[var(--brand-soft)] px-2.5 py-0.5 text-[10px] font-semibold tracking-widest text-[var(--brand-strong)]">
          MOCK
        </p>
        <h2 className="text-xl font-semibold text-[var(--text-on-light)] sm:text-2xl">{title}</h2>
        {provider ? <p className="text-sm text-[var(--text-muted)]">{provider}</p> : null}
        <p className="text-xs text-[var(--text-muted)]">{t("play.iframePlaceholder")}</p>
        <p className="font-sans text-[11px] text-[var(--text-muted)]">gameId: {gameId}</p>
      </div>
    </section>
  );
}
