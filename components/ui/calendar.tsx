"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** shadcn/ui Calendar (react-day-picker) — สีตาม token ธีม · ส่ง locale ของ react-day-picker ผ่าน prop `locale` */
export function Calendar({ className, classNames, showOutsideDays = true, ...props }: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-1", className)}
      classNames={{
        root: "w-fit",
        months: "relative flex flex-col gap-4",
        month: "flex flex-col gap-3",
        month_caption: "flex h-9 items-center justify-center px-9",
        caption_label: "text-sm font-semibold",
        nav: "absolute inset-x-0 top-0 flex items-center justify-between",
        button_previous:
          "inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent text-[var(--text-muted)] hover:bg-white/10 hover:text-[var(--text-on-light)] disabled:opacity-40",
        button_next:
          "inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent text-[var(--text-muted)] hover:bg-white/10 hover:text-[var(--text-on-light)] disabled:opacity-40",
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday: "w-10 pb-1 text-center text-xs font-semibold text-[var(--text-muted)]",
        week: "mt-1 flex w-full",
        day: "relative h-10 w-10 p-0 text-center text-sm",
        day_button:
          "inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent font-medium text-[var(--text-on-light)] transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30",
        selected: "[&>button]:!bg-[var(--t-accent,var(--brand))] [&>button]:!text-[var(--t-action-text,#0c090f)] [&>button]:font-semibold",
        today: "[&>button]:ring-1 [&>button]:ring-white/30",
        outside: "opacity-40",
        disabled: "opacity-30",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className: c }) =>
          orientation === "left" ? <ChevronLeft className={cn("h-4 w-4", c)} /> : <ChevronRight className={cn("h-4 w-4", c)} />,
      }}
      {...props}
    />
  );
}
