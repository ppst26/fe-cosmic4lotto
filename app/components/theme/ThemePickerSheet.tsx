"use client";

import React from "react";
import { OverlayPanel } from "@/app/components/ui/OverlayPanel";
import { LOTTO_SHEET_SURFACE } from "@/app/components/menu/lottoSurface";
import { DEFAULT_THEME, THEMES, type ThemeOption } from "@/lib/themes";
import { useTheme } from "@/lib/theme";
import { useT } from "@/lib/i18n/I18nProvider";
import { cn } from "@/lib/utils";

interface ThemePickerSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * ธีมเริ่มต้น ("cosmic" ในตาราง glass) = หน้าตาดำ-ทองเดิมของ lotto ไม่มี block ใน themes.css
 * จึงวาดการ์ดตัวอย่างและชื่อด้วยสีของ lotto แทนสีม่วงของ glass
 */
const LOTTO_DEFAULT_PREVIEW: Pick<ThemeOption, "name" | "colors" | "bgColor"> = {
  name: "CM-SaturnLotto",
  colors: ["#610000", "#1a1a1d", "#ffd15c"],
  bgColor: "#0d0d0f",
};

function ThemeGrid({
  title,
  themes,
  activeTheme,
  onSelect,
}: {
  title: string;
  themes: ThemeOption[];
  activeTheme: string;
  onSelect: (key: string) => void;
}) {
  const t = useT("common");
  return (
    <section className="mt-4 first:mt-0">
      <div className="mb-2.5 flex items-center gap-2">
        <span className="h-4 w-1.5 rounded-full bg-[var(--brand)]" aria-hidden="true" />
        <h3 className="text-sm font-semibold tracking-wide text-[var(--text-muted)]">{title}</h3>
      </div>
      <ul className="grid grid-cols-2 gap-3" role="list">
        {themes.map((theme) => {
          const selected = activeTheme === theme.key;
          const view = theme.key === DEFAULT_THEME ? { ...theme, ...LOTTO_DEFAULT_PREVIEW } : theme;
          return (
            <li key={theme.key}>
              <button
                type="button"
                aria-pressed={selected}
                onClick={() => onSelect(theme.key)}
                className={cn(
                  "block w-full cursor-pointer overflow-hidden rounded-2xl border-0 p-0 text-left outline-none transition-transform focus-visible:shadow-[0_0_0_2px_var(--brand)]",
                  selected ? "shadow-[0_0_0_2px_var(--brand)]" : "hover:scale-[1.02]",
                )}
              >
                <span className="flex h-9 w-full">
                  {view.colors.map((c, i) => (
                    <span key={i} className="h-full flex-1" style={{ backgroundColor: c }} />
                  ))}
                </span>
                <span className="flex items-center justify-between gap-2 p-2.5" style={{ backgroundColor: view.bgColor }}>
                  <span className="min-w-0">
                    <span
                      className="block truncate text-xs font-bold"
                      style={{ color: theme.isDark ? "#ffffff" : "#1f2937" }}
                    >
                      {view.name}
                    </span>
                    <span className="block text-[10px]" style={{ color: theme.isDark ? "#a1a1aa" : "#6b7280" }}>
                      {theme.isDark ? t("theme.darkLabel") : t("theme.lightLabel")}
                    </span>
                  </span>
                  {selected ? (
                    <span
                      className="grid h-5 w-5 shrink-0 place-items-center rounded-full"
                      style={{ backgroundColor: view.colors[0], color: "#ffffff" }}
                      aria-hidden="true"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-3 w-3"
                      >
                        <path d="m5 12.5 4.5 4.5L19 7.5" />
                      </svg>
                    </span>
                  ) : null}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/**
 * Sheet เลือกธีมสี — เปิดจากปุ่มลอยล่างขวา (FloatingActions)
 * เลือกแล้ว setTheme (data-theme บน <html> + localStorage) และปิด sheet
 */
export function ThemePickerSheet({ isOpen, onClose }: ThemePickerSheetProps) {
  const t = useT("common");
  const { theme, setTheme } = useTheme();

  const pick = (key: string) => {
    setTheme(key);
    onClose();
  };

  return (
    <OverlayPanel
      open={isOpen}
      onClose={onClose}
      zClassName="z-[140]"
      className={cn(LOTTO_SHEET_SURFACE, "max-h-[min(85dvh,680px)]")}
      title={t("theme.title")}
      closeLabel={t("theme.close")}
    >
      <p className="mb-3 text-xs text-[var(--text-muted)]">{t("theme.description")}</p>
      <ThemeGrid title={t("theme.dark")} themes={THEMES.filter((x) => x.isDark)} activeTheme={theme} onSelect={pick} />
      <ThemeGrid title={t("theme.light")} themes={THEMES.filter((x) => !x.isDark)} activeTheme={theme} onSelect={pick} />
    </OverlayPanel>
  );
}
