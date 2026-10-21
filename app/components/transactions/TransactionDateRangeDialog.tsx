"use client";

import React, { useMemo, useState } from "react";
import { SelectField } from "@/components/ui/select";
import {
  getCalendarMonthCells,
  getMonthOptionLabels,
  getWeekdayShortLabels,
  isSameDay,
  startOfDay,
} from "@/app/lib/transactionDateUtils";
import { SoftDialog } from "../ui/SoftDialog";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/I18nProvider";
import { useLocale } from "@/lib/i18n/navigation";

interface TransactionDateRangeDialogProps {
  open: boolean;
  from: Date;
  to: Date;
  onOpenChange: (open: boolean) => void;
  onConfirm: (from: Date, to: Date) => void;
  /** จำกัดวันที่เลือกได้ — วันนอกช่วงกดไม่ได้ */
  minDate?: Date;
  maxDate?: Date;
}

/** เลือกช่วงวันที่ — ปฏิทินเดือน + ยืนยัน/ยกเลิก (portal เหนือ hub modal ผ่าน SoftDialog) */
export function TransactionDateRangeDialog({
  open,
  from,
  to,
  onOpenChange,
  onConfirm,
  minDate,
  maxDate,
}: TransactionDateRangeDialogProps) {
  const [viewMonth, setViewMonth] = useState(() => startOfDay(from));
  const [rangeStart, setRangeStart] = useState<Date | null>(from);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(to);
  const t = useT("transactions");
  const locale = useLocale();
  const monthLabels = useMemo(() => getMonthOptionLabels(locale), [locale]);
  const weekdayLabels = useMemo(() => getWeekdayShortLabels(locale), [locale]);

  /** เปิด dialog หรือช่วงจากภายนอกเปลี่ยนขณะเปิด → เริ่มจากช่วงปัจจุบัน (ปรับระหว่าง render) */
  const [synced, setSynced] = useState({ open, from, to });
  if (synced.open !== open || synced.from !== from || synced.to !== to) {
    setSynced({ open, from, to });
    if (open) {
      setViewMonth(startOfDay(from));
      setRangeStart(from);
      setRangeEnd(to);
    }
  }

  const cells = useMemo(() => getCalendarMonthCells(viewMonth), [viewMonth]);

  const isOutOfBounds = (day: Date) =>
    (minDate !== undefined && day.getTime() < startOfDay(minDate).getTime()) ||
    (maxDate !== undefined && day.getTime() > startOfDay(maxDate).getTime());

  const handleDayClick = (date: Date) => {
    const day = startOfDay(date);
    if (isOutOfBounds(day)) return;
    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(day);
      setRangeEnd(null);
      return;
    }
    if (day.getTime() < rangeStart.getTime()) {
      setRangeEnd(rangeStart);
      setRangeStart(day);
      return;
    }
    setRangeEnd(day);
  };

  const handleConfirm = () => {
    if (!rangeStart) return;
    const end = rangeEnd ?? rangeStart;
    onConfirm(rangeStart, end);
    onOpenChange(false);
  };

  const years = useMemo(() => {
    if (minDate || maxDate) {
      const first = (minDate ?? new Date()).getFullYear();
      const last = (maxDate ?? new Date()).getFullYear();
      return Array.from({ length: Math.max(1, last - first + 1) }, (_, i) => first + i);
    }
    const current = new Date().getFullYear();
    return Array.from({ length: 8 }, (_, i) => current - 3 + i);
  }, [minDate, maxDate]);

  return (
    <SoftDialog
      open={open}
      onClose={() => onOpenChange(false)}
      title={t("calendar.title")}
      closeLabel={t("calendar.close")}
    >
      <h2 className="mb-3 pr-10 text-sm font-semibold text-[var(--text-on-light)]">{t("calendar.title")}</h2>

      <div className="mb-3 flex gap-2">
        <SelectField
          className="min-w-0 flex-1"
          value={String(viewMonth.getMonth())}
          onValueChange={(value) => setViewMonth(new Date(viewMonth.getFullYear(), Number(value), 1))}
          options={monthLabels.map((label, index) => ({ value: String(index), label }))}
        />
        <SelectField
          className="w-28"
          value={String(viewMonth.getFullYear())}
          onValueChange={(value) => setViewMonth(new Date(Number(value), viewMonth.getMonth(), 1))}
          options={years.map((year) => ({ value: String(year), label: String(year) }))}
        />
      </div>

      <div className="mb-1 grid grid-cols-7">
        {weekdayLabels.map((day, index) => (
          <span key={index} className="py-1 text-center text-xs font-semibold text-[var(--text-muted)]">
            {day}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1">
        {cells.map(({ date, inMonth }) => {
          const day = startOfDay(date);
          const isStart = rangeStart && isSameDay(day, rangeStart);
          const isEnd = rangeEnd && isSameDay(day, rangeEnd);
          const inRange =
            rangeStart &&
            rangeEnd &&
            day.getTime() >= rangeStart.getTime() &&
            day.getTime() <= rangeEnd.getTime();

          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => handleDayClick(day)}
              disabled={isOutOfBounds(day)}
              className={cn(
                "mx-auto flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-0 text-sm tabular-nums transition-colors disabled:cursor-not-allowed disabled:opacity-30",
                !inMonth && "opacity-40",
                isStart || isEnd
                  ? "bg-[var(--brand)] font-semibold text-[#2a0607]"
                  : inRange
                    ? "bg-[var(--brand-soft)] text-[var(--text-on-light)]"
                    : "bg-transparent text-[var(--text-on-light)] hover:bg-white/10",
              )}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="soft-btn-outline h-11 w-full text-sm font-semibold"
        >
          {t("calendar.cancel")}
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={!rangeStart}
          className="soft-btn-primary h-11 w-full text-sm font-semibold disabled:opacity-45"
        >
          {t("calendar.confirm")}
        </button>
      </div>
    </SoftDialog>
  );
}
