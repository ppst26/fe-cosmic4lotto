"use client";

import Link from "@/lib/i18n/navigation";
import { Ticket } from "lucide-react";
import { useLotterySlipFirstPage } from "@/app/hooks/api/lotterySlips";
import { useLotteryI18n } from "./useLotteryI18n";

/**
 * ปุ่ม "โพยของฉัน" บนหัวหน้าแรกหวย (/lottery) — ไปหน้ารายการโพย /lottery/slips
 * ป้ายตัวเลข = จำนวนโพยที่กำลังดำเนินการ (เฉพาะผู้ใช้ที่ login)
 * ใช้ cache key เดียวกับแท็บ "กำลังดำเนินการ" ของหน้าโพย → กดเข้าไปแล้วรายการขึ้นทันที
 */
export function LotterySlipsEntryButton({ className }: { className?: string }) {
  const { t } = useLotteryI18n();
  const pending = useLotterySlipFirstPage(
    { scope: "pending", market: "", result: "", range: "" },
    () => ({ scope: "pending" }),
  );
  const count = pending.data?.summary.count ?? 0;

  return (
    <Link
      href="/lottery/slips"
      className={`soft-btn-outline relative inline-flex h-9 shrink-0 items-center gap-1.5 px-3 text-xs font-semibold no-underline${className ? ` ${className}` : ""}`}
      aria-label={count > 0 ? t("hub.mySlipsPendingAria", { count }) : t("hub.mySlipsAria")}
    >
      <Ticket className="h-4 w-4" aria-hidden />
      <span>{t("hub.mySlips")}</span>
      {count > 0 ? (
        <span
          className="absolute -right-1.5 -top-1.5 grid h-[1.125rem] min-w-[1.125rem] place-items-center rounded-full bg-[var(--brand)] px-1 text-[0.6875rem] font-semibold leading-none tabular-nums text-[var(--btn-text)]"
          aria-hidden="true"
        >
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </Link>
  );
}
