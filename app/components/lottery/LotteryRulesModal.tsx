"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { LotteryRulesContent } from "./LotteryRulesContent";
import { useLotteryI18n } from "./useLotteryI18n";

interface LotteryRulesModalProps {
  open: boolean;
  onClose: () => void;
  marketSlug: string;
}

/** เท่ากับระยะแอนิเมชันปิดใน CSS (.lottery-rules-backdrop[data-state="closed"]) */
const EXIT_MS = 240;

/**
 * Bottom sheet กติกา / อัตราการจ่าย — เลื่อนขึ้นจากด้านล่าง ชิดขอบซ้าย-ขวา มุมล่างไม่โค้ง
 * พื้นไล่เฉดเข้มจาก token ธีม (สไตล์อยู่ใน lottery css: .lottery-rules-sheet)
 */
export function LotteryRulesModal({ open, onClose, marketSlug }: LotteryRulesModalProps) {
  const { t } = useLotteryI18n();
  const [mounted, setMounted] = useState(open);

  // เปิดแล้ว mount ทันที (ปรับ state ระหว่าง render แทน effect) · ปิดแล้วรอแอนิเมชันจบค่อย unmount
  if (open && !mounted) setMounted(true);

  useEffect(() => {
    if (open) return;
    const id = window.setTimeout(() => setMounted(false), EXIT_MS);
    return () => window.clearTimeout(id);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!mounted || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="lottery-rules-backdrop"
      data-state={open ? "open" : "closed"}
      role="presentation"
      onClick={onClose}
    >
      <div
        className="lottery-rules-sheet"
        role="dialog"
        aria-modal="true"
        aria-label={t("rules.modalTitle")}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="lottery-rules-sheet__head">
          <h2 className="lottery-rules-sheet__title">{t("rules.modalTitle")}</h2>
          <button type="button" className="lottery-rules-sheet__close" onClick={onClose} aria-label={t("rules.accept")}>
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        <div className="lottery-rules-sheet__body">
          <LotteryRulesContent marketSlug={marketSlug} />
        </div>
        <div className="lottery-rules-sheet__foot">
          <button type="button" onClick={onClose} className="soft-btn-primary min-h-11 px-5 text-sm font-semibold">
            {t("rules.accept")}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
