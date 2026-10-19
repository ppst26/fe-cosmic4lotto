"use client";

import React, { useState } from "react";
import { X, Ticket } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { useWallet } from "@/app/hooks/api/account";
import { submitCoupon } from "@/lib/api/coupon";
import { COUPON_CODE_MAX_LENGTH, sanitizeCouponCode } from "@/lib/fieldInput";
import { useT } from "@/lib/i18n/I18nProvider";

export interface CouponModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CouponModal({ isOpen, onClose }: CouponModalProps) {
  if (!isOpen) return null;
  return <CouponModalBody onClose={onClose} />;
}

function CouponModalBody({ onClose }: { onClose: () => void }) {
  const t = useT("common");
  const { showToast } = useToast();
  const wallet = useWallet();
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = sanitizeCouponCode(code);
    if (!normalized) {
      showToast(t("coupon.codeRequired"), "error");
      return;
    }

    setSubmitting(true);
    const result = await submitCoupon(normalized);
    setSubmitting(false);
    if (result.ok) {
      wallet.refresh();
      showToast(result.message, "success");
      setCode("");
      return;
    }
    showToast(result.error, "error");
  };

  return (
    <div className="fixed inset-0 z-[120] flex animate-fade-in select-none items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 transition-opacity" onClick={onClose} aria-hidden="true" />

      <div
        className="overlay-theme relative z-10 w-full max-w-[380px] rounded-3xl border border-white/10 bg-[var(--BG-Surface-Darker)] p-5 text-[var(--text-on-light)] shadow-[var(--shadow-soft)] sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="coupon-modal-title"
        aria-describedby="coupon-modal-desc"
      >
        <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center text-[var(--brand)]">
              <Ticket className="h-4 w-4" />
            </div>
            <div>
              <h2 id="coupon-modal-title" className="text-lg font-semibold tracking-wide">
                {t("coupon.title")}
              </h2>
              <p id="coupon-modal-desc" className="text-[11px] text-[var(--text-muted)]">
                {t("coupon.description")}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t("coupon.close")}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-[var(--text-muted)] transition-colors hover:text-[var(--text-on-light)] active:scale-95"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleRedeem} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="coupon-input" className="text-xs font-semibold text-[var(--text-muted)]">
              {t("coupon.codeLabel")}
            </label>
            <div className="relative">
              <input
                id="coupon-input"
                type="text"
                autoComplete="off"
                value={code}
                onChange={(e) => setCode(sanitizeCouponCode(e.target.value))}
                placeholder={t("coupon.codePlaceholder")}
                autoFocus
                maxLength={COUPON_CODE_MAX_LENGTH}
                className="h-12 w-full rounded-xl border border-white/10 bg-[var(--BG-Surface-Normal)] px-4 font-sans text-[15px] font-semibold uppercase tracking-wider text-[var(--text-on-light)] placeholder:normal-case placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/40"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="soft-btn-primary flex h-12 w-full cursor-pointer items-center justify-center rounded-xl border-0 text-[15px] font-semibold transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? t("coupon.submitting") : t("coupon.submit")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
