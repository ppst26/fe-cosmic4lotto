"use client";

import React, { createContext, useContext, useMemo } from "react";
import dynamic from "next/dynamic";
import { useOverlayLayer } from "@/app/hooks/useOverlayLayer";
import { useLazyOverlayMount } from "@/app/hooks/useLazyOverlayMount";

/** sheet เลือกภาษาโหลดแยก chunk ตอนเปิดครั้งแรก */
const LanguagePickerSheet = dynamic(() =>
  import("./LanguagePickerSheet").then((m) => m.LanguagePickerSheet),
);

interface LanguagePickerContextValue {
  openLanguagePicker: () => void;
  closeLanguagePicker: () => void;
}

const LanguagePickerContext = createContext<LanguagePickerContextValue | null>(null);

/**
 * เปิด/ปิด sheet เลือกภาษา — sync ?layer=language · ไม่ต้องล็อกอิน
 */
export function LanguagePickerProvider({ children }: { children: React.ReactNode }) {
  const { isOpen, open, close } = useOverlayLayer("language");

  const value = useMemo(
    () => ({ openLanguagePicker: () => open(), closeLanguagePicker: close }),
    [close, open],
  );

  const sheetMounted = useLazyOverlayMount(isOpen);

  return (
    <LanguagePickerContext.Provider value={value}>
      {children}
      {sheetMounted ? <LanguagePickerSheet isOpen={isOpen} onClose={close} /> : null}
    </LanguagePickerContext.Provider>
  );
}

export function useLanguagePicker(): LanguagePickerContextValue {
  const ctx = useContext(LanguagePickerContext);
  if (!ctx) {
    throw new Error("useLanguagePicker ต้องใช้ภายใน LanguagePickerProvider");
  }
  return ctx;
}
