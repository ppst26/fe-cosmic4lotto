"use client";

import * as React from "react";
import { CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { th } from "react-day-picker/locale";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

/** ตัวเลือกวันที่ (shadcn Popover + Calendar) — ค่าเป็น Date | undefined · ใช้แทน <input type="date"> */
export function DatePicker({
  value,
  onChange,
  min,
  max,
  placeholder = "เลือกวันที่",
  ariaLabel,
  className,
}: {
  value?: Date;
  onChange: (date: Date) => void;
  min?: Date;
  max?: Date;
  placeholder?: string;
  ariaLabel?: string;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={ariaLabel}
          className={cn(
            "flex h-10 w-full cursor-pointer items-center justify-between gap-2 rounded-lg border border-white/10 bg-[var(--Card-Normal)] px-3 text-sm font-semibold text-[var(--text-on-light)] outline-none transition-colors hover:border-white/20 focus-visible:border-[var(--brand)] data-[state=open]:border-[var(--brand)]",
            !value && "text-[var(--text-muted)]",
            className,
          )}
        >
          <span className="truncate">{value ? format(value, "dd/MM/yyyy") : placeholder}</span>
          <CalendarDays className="h-4 w-4 shrink-0 text-[var(--text-muted)]" />
        </button>
      </PopoverTrigger>
      <PopoverContent>
        <Calendar
          mode="single"
          locale={th}
          selected={value}
          defaultMonth={value}
          onSelect={(date) => {
            if (!date) return;
            onChange(date);
            setOpen(false);
          }}
          disabled={[...(min ? [{ before: min }] : []), ...(max ? [{ after: max }] : [])]}
        />
      </PopoverContent>
    </Popover>
  );
}
