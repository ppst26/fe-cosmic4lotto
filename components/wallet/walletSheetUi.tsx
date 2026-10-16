"use client";

import React from "react";
import { ChevronLeft, X } from "lucide-react";
import { OverlayPanel } from "@/app/components/ui/OverlayPanel";
import { LOTTO_SHEET_SURFACE } from "@/app/components/menu/lottoSurface";
import { cn } from "@/lib/utils";

/** การ์ดในแผงฝาก/ถอน — พื้นเข้มกว่าตัว sheet (เทียบ COSMIC_SHEET_SOFT_GLASS ของ glass) */
export const WALLET_CARD = "rounded-[var(--radius-soft-lg)] border border-white/10 bg-[var(--BG-Surface-Darker)]";
/** การ์ดที่กดได้ */
export const WALLET_CARD_INTERACTIVE = cn(
  WALLET_CARD,
  "cursor-pointer text-left transition-all hover:ring-1 hover:ring-[var(--brand)] active:scale-[0.99]",
);
export const WALLET_LABEL = "text-xs font-bold text-[var(--text-muted)]";
export const WALLET_HINT = "text-[11px] font-medium text-[var(--text-muted)]";
export const WALLET_ERROR =
  "rounded-xl border border-rose-500/25 bg-rose-500/10 px-3 py-2 text-xs font-medium text-rose-400 sm:text-sm";
export const WALLET_PRIMARY_BTN =
  "soft-btn-primary flex h-12 w-full cursor-pointer items-center justify-center gap-2 text-[15px] font-extrabold transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60";

/** ปุ่มเลือกยอดด่วน (เทียบ COSMIC_CHOICE_BTN) */
export function choiceBtn(active: boolean, className?: string) {
  return cn(
    "cursor-pointer rounded-xl border-0 text-xs font-black transition-all",
    active
      ? "bg-[var(--brand)] text-[#2a0607]"
      : "bg-[var(--Card-Normal)] text-[var(--text-on-light)] hover:bg-[var(--brand-soft)]",
    className,
  );
}

const ROUND_BTN =
  "flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-[var(--BG-Surface-Darker)] text-[var(--text-muted)] transition-all hover:text-[var(--text-on-light)] active:scale-95";

interface WalletSheetProps {
  onClose: () => void;
  /** ปิดด้วย backdrop/Esc ไม่ได้ระหว่างส่งข้อมูล */
  dismissible?: boolean;
  closeLabel: string;
  children: React.ReactNode;
}

/** กรอบ sheet — bottom sheet บนมือถือ · กล่องกลางจอบนเดสก์ท็อป (เหมือน responsiveSheet ของ glass) */
export function WalletSheet({ onClose, dismissible = true, closeLabel, children }: WalletSheetProps) {
  return (
    <OverlayPanel
      hideHeader
      onClose={onClose}
      dismissible={dismissible}
      closeLabel={closeLabel}
      zClassName="z-[110]"
      maxWidthClassName="md:max-w-[440px]"
      className={cn(LOTTO_SHEET_SURFACE, "!p-4 sm:!p-5")}
    >
      {children}
    </OverlayPanel>
  );
}

interface WalletSheetHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  titleIconSrc?: string;
  onBack?: () => void;
  backLabel?: string;
  onClose: () => void;
  closeLabel: string;
}

/** หัว sheet: [ย้อนกลับ] [ไอคอน] หัวข้อ/คำบรรยาย [ปิด] (เทียบ ResponsiveSheetHeader) */
export function WalletSheetHeader({
  title,
  subtitle,
  titleIconSrc,
  onBack,
  backLabel,
  onClose,
  closeLabel,
}: WalletSheetHeaderProps) {
  return (
    <div className="mb-4 flex items-start gap-3">
      {onBack ? (
        <button type="button" onClick={onBack} aria-label={backLabel} className={ROUND_BTN}>
          <ChevronLeft className="h-5 w-5 stroke-[2.5]" />
        </button>
      ) : null}
      {titleIconSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={titleIconSrc} alt="" aria-hidden="true" className="h-9 w-9 shrink-0 object-contain" />
      ) : null}
      <div className="min-w-0 flex-1 pt-0.5">
        {title}
        {subtitle}
      </div>
      <button type="button" onClick={onClose} aria-label={closeLabel} className={ROUND_BTN}>
        <X className="h-5 w-5 stroke-[2.2]" />
      </button>
    </div>
  );
}
