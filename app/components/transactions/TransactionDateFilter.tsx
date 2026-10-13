"use client";

import React, { useState } from "react";
import { Calendar } from "lucide-react";
import { formatTransactionDateRangeLabel } from "@/app/lib/transactionDateUtils";
import { TransactionDateRangeDialog } from "./TransactionDateRangeDialog";
import { useT } from "@/lib/i18n/I18nProvider";
import { useLocale } from "@/lib/i18n/navigation";

interface TransactionDateFilterProps {
  draftFrom: Date;
  draftTo: Date;
  onDraftChange: (from: Date, to: Date) => void;
  onSearch: () => void;
  onClear: () => void;
}

const fieldClass =
  "flex h-11 cursor-pointer items-center rounded-[var(--radius-soft-sm)] border-0 bg-[var(--soft-card-elevated)] px-3 text-[var(--text-on-light)]";

/** ฟิลเตอร์วันที่ — ช่องเลือกช่วง · ล้าง · ค้นหา */
export function TransactionDateFilter({
  draftFrom,
  draftTo,
  onDraftChange,
  onSearch,
  onClear,
}: TransactionDateFilterProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const t = useT("transactions");
  const locale = useLocale();

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-[var(--text-muted)]">{t("filter.label")}</span>

      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => setPickerOpen(true)} className={`${fieldClass} min-w-0 flex-1`}>
          <span className="min-w-0 flex-1 truncate text-left text-sm tabular-nums">
            {formatTransactionDateRangeLabel(draftFrom, draftTo, locale)}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className={`${fieldClass} shrink-0`}
          aria-label={t("filter.openCalendar")}
        >
          <Calendar className="h-[1.125rem] w-[1.125rem]" aria-hidden="true" />
        </button>
        <button type="button" onClick={onClear} className="soft-btn-outline h-11 shrink-0 px-4 text-sm font-semibold">
          {t("filter.clear")}
        </button>
        <button type="button" onClick={onSearch} className="soft-btn-primary h-11 shrink-0 px-5 text-sm font-semibold">
          {t("filter.search")}
        </button>
      </div>

      <TransactionDateRangeDialog
        open={pickerOpen}
        from={draftFrom}
        to={draftTo}
        onOpenChange={setPickerOpen}
        onConfirm={onDraftChange}
      />
    </div>
  );
}
