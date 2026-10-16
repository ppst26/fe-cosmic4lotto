"use client";

import { useCallback, useSyncExternalStore } from "react";
import { DEFAULT_THEME, LIGHT_THEME_KEYS, THEME_KEYS, THEME_STORAGE_KEY } from "@/lib/themes";

const THEME_EVENT = "cosmic-theme-change";

function readTheme(): string {
  const key = document.documentElement.dataset.theme;
  return key && THEME_KEYS.includes(key) ? key : DEFAULT_THEME;
}

function subscribe(onChange: () => void) {
  window.addEventListener(THEME_EVENT, onChange);
  window.addEventListener("storage", onChange); // sync ข้ามแท็บ
  return () => {
    window.removeEventListener(THEME_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** ให้แถบ browser บนมือถือ (meta theme-color) ตรงกับพื้นหลังของธีมที่เลือก */
function syncThemeColorMeta() {
  const bg = getComputedStyle(document.documentElement).getPropertyValue("--cosmic-page-base").trim();
  if (!bg) return;
  document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute("content", bg));
}

/**
 * ตั้ง <html data-theme / data-mode> + จำใน localStorage (themeColor)
 * ธีมสว่างถอด class `dark` ออก (shadcn / dark: variants) · ธีมมืดใส่กลับ
 */
export function setTheme(key: string) {
  if (!THEME_KEYS.includes(key)) return;
  const root = document.documentElement;
  const isLight = LIGHT_THEME_KEYS.includes(key);
  root.dataset.theme = key;
  root.dataset.mode = isLight ? "light" : "dark";
  root.classList.toggle("dark", !isLight);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, key);
  } catch {
    /* private mode / storage ปิด — ใช้ได้เฉพาะ session นี้ */
  }
  syncThemeColorMeta();
  window.dispatchEvent(new Event(THEME_EVENT));
}

/** state ของธีมอยู่ที่ attribute บน <html> — ไม่ต้องมี Provider และไม่ re-render ทั้งแอป */
export function useTheme() {
  const theme = useSyncExternalStore(subscribe, readTheme, () => DEFAULT_THEME);
  const select = useCallback((key: string) => setTheme(key), []);
  return { theme, setTheme: select };
}
