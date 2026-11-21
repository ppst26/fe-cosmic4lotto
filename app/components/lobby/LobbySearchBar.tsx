"use client";

import { Search, X } from "lucide-react";
import { useT } from "@/lib/i18n/I18nProvider";

type LobbySearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  /** ช่องเล็ก (h-9) สำหรับแถวหัวที่มีเมนูหมวดกินที่ด้านข้าง */
  compact?: boolean;
};

/** ช่องค้นหาค่าย/เกม — ธีมมืด-ทองของ lotto (ตรรกะเดียวกับ GameSearchBar ของ glass) */
export function LobbySearchBar({ value, onChange, placeholder, compact = false }: LobbySearchBarProps) {
  const t = useT("home");
  return (
    <form
      role="search"
      aria-label={t("search.formAriaLabel")}
      onSubmit={(e) => e.preventDefault()}
      className="w-full"
    >
      <div className={`flex w-full items-center rounded-2xl border border-white/10 bg-[var(--soft-card)] focus-within:border-[var(--brand)] ${compact ? "h-9 gap-1.5 rounded-xl px-2.5" : "h-11 gap-2.5 px-3.5"}`}>
        <Search className="h-4 w-4 shrink-0 text-[var(--text-muted)]" aria-hidden />
        <label htmlFor="lobby-search-input" className="sr-only">
          {t("search.label")}
        </label>
        <input
          id="lobby-search-input"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          spellCheck={false}
          className={`h-full min-w-0 w-full border-0 bg-transparent ${compact ? "text-xs" : "text-sm"} text-[var(--text-on-light)] outline-none placeholder:text-[var(--text-muted)]`}
        />
        {value.length > 0 ? (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label={t("search.clear")}
            className="cursor-pointer rounded-full border-0 bg-transparent p-1 text-[var(--text-muted)] hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        ) : null}
      </div>
    </form>
  );
}
