"use client";

import React from "react";
import { OverlayPanel } from "@/app/components/ui/OverlayPanel";
import { LocaleFlag } from "./LocaleFlag";
import { LOCALES, LOCALE_LABELS, type Locale } from "@/lib/i18n/config";
import { useT } from "@/lib/i18n/I18nProvider";
import { useLocale, useSwitchLocale } from "@/lib/i18n/navigation";
import { clearLayerParams } from "@/lib/overlayUrl";
import { cn } from "@/lib/utils";
import { LOTTO_SHEET_SURFACE } from "@/app/components/menu/lottoSurface";

interface LanguagePickerSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Sheet เลือกภาษา (ธง + ชื่อภาษาในภาษานั้น)
 * เลือกภาษาอื่น → ตั้ง cookie แล้วโหลดหน้าเดิมในภาษาใหม่ (ตัด ?layer=language ออก)
 */
export function LanguagePickerSheet({ isOpen, onClose }: LanguagePickerSheetProps) {
  const t = useT("common");
  const current = useLocale();
  const switchLocale = useSwitchLocale();

  const select = (code: Locale) => {
    if (code === current) {
      onClose();
      return;
    }
    const params = new URLSearchParams(window.location.search);
    clearLayerParams(params, "language");
    const qs = params.toString();
    switchLocale(code, `${window.location.pathname}${qs ? `?${qs}` : ""}`);
  };

  return (
    <OverlayPanel
      open={isOpen}
      onClose={onClose}
      zClassName="z-[140]"
      className={LOTTO_SHEET_SURFACE}
      title={t("languagePicker.title")}
      closeLabel={t("languagePicker.close")}
    >
      <p className="mb-3 text-xs text-[var(--text-muted)]">{t("languagePicker.description")}</p>
      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2" role="list">
        {LOCALES.map((code) => {
          const selected = code === current;
          return (
            <li key={code}>
              <button
                type="button"
                lang={code}
                aria-pressed={selected}
                onClick={() => select(code)}
                className={cn(
                  "flex min-h-14 w-full cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-[var(--BG-Surface-Darker)] px-3.5 py-2.5 text-left outline-none hover:bg-[var(--brand-soft)]",
                  selected && "border-[var(--brand)] shadow-[inset_0_0_0_1px_var(--brand)]",
                )}
              >
                <LocaleFlag locale={code} className="h-8 w-8" />
                <span className="min-w-0 flex-1 truncate text-base font-semibold text-[var(--text-on-light)]">
                  {LOCALE_LABELS[code].native}
                </span>
                {selected ? <CheckIcon className="h-5 w-5 shrink-0 text-[var(--brand)]" /> : null}
              </button>
            </li>
          );
        })}
      </ul>
    </OverlayPanel>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}
