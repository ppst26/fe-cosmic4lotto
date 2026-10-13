"use client";

import { Search, X } from "lucide-react";
import { useT } from "@/lib/i18n/I18nProvider";

type LobbySearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
};

/** ช่องค้นหาค่าย/เกม — ธีมมืด-ทองของ lotto (ตรรกะเดียวกับ GameSearchBar ของ glass) */
export function LobbySearchBar({ value, onChange, placeholder }: LobbySearchBarProps) {
  const t = useT("home");
  return (
    <form
      role="search"
      aria-label={t("search.formAriaLabel")}
      onSubmit={(e) => e.preventDefault()}
      className="w-full"
    >
      <div className="flex h-11 w-full items-center gap-2.5 rounded-2xl border border-white/10 bg-[var(--soft-card)] px-3.5 focus-within:border-[var(--brand)]">
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
          className="h-full w-full border-0 bg-transparent text-sm text-[var(--text-on-light)] outline-none placeholder:text-[var(--text-muted)]"
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
