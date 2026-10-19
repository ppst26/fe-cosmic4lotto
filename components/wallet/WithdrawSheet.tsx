"use client";

import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import { WalletConfirmDialog } from "@/components/WalletConfirmDialog";
import {
  WALLET_CARD_INTERACTIVE,
  WALLET_ERROR,
  WALLET_HINT,
  WALLET_LABEL,
  WALLET_PRIMARY_BTN,
  WalletSheet,
  WalletSheetHeader,
  choiceBtn,
} from "@/components/wallet/walletSheetUi";
import { ResourceGate } from "@/app/components/ui/ResourceGate";
import { MONEY_AMOUNT_MAX_DIGITS, sanitizeMoneyAmount } from "@/lib/fieldInput";
import { submitWithdraw } from "@/lib/api/withdraw";
import {
  useWithdrawAccount,
  useWithdrawBalance,
  useWithdrawQuickAmounts,
} from "@/app/hooks/api/money";
import { useWallet } from "@/app/hooks/api/account";
import { formatWithdrawAmount, formatWithdrawMoney } from "@/lib/format";
import { useT } from "@/lib/i18n/I18nProvider";

interface WithdrawSheetProps {
  onClose: () => void;
  onCompleted?: (amount: number) => void;
}

/**
 * ถอนเงิน — flow เดียวกับ glass: บัญชีรับเงิน + กรอกยอด (จำกัดไม่เกินยอดถอนได้) → ยืนยันส่งคำขอ
 * mount เมื่อเปิด / unmount เมื่อปิด จึงรีเซ็ตฟอร์มทุกครั้ง
 */
export function WithdrawSheet({ onClose, onCompleted }: WithdrawSheetProps) {
  const t = useT("wallet");
  const quick = useWithdrawQuickAmounts();
  const account = useWithdrawAccount();
  const balance = useWithdrawBalance();
  const wallet = useWallet();
  /** ยังโหลดยอดถอนได้ไม่เสร็จ = 0 → ปุ่มยืนยันกดไม่ได้ */
  const available = balance.data ?? 0;
  const defaultAmount = quick.data?.defaultAmount ?? 0;

  const [amount, setAmount] = useState(defaultAmount);
  const [amountInput, setAmountInput] = useState(defaultAmount ? String(defaultAmount) : "");
  /** ยอดเริ่มต้นมาถึงหลัง mount — ตั้งค่าฟอร์มครั้งเดียวต่อค่า (ปรับระหว่าง render) */
  const [seededDefault, setSeededDefault] = useState(defaultAmount);
  if (seededDefault !== defaultAmount) {
    setSeededDefault(defaultAmount);
    setAmount(defaultAmount);
    setAmountInput(String(defaultAmount));
  }
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const applyAmount = (value: number) => {
    const capped = Math.min(Math.max(0, value), available);
    setAmount(capped);
    setAmountInput(capped > 0 ? String(capped) : "");
  };

  const handleAmountChange = (raw: string) => {
    const digits = sanitizeMoneyAmount(raw);
    setAmountInput(digits);
    applyAmount(digits ? Number.parseInt(digits, 10) : 0);
  };

  const canConfirm = amount > 0 && amount <= available;

  const handleConfirm = async () => {
    if (amount <= 0 || amount > available) return;
    setSubmitting(true);
    setSubmitMessage(null);
    const result = await submitWithdraw({ amount });
    setSubmitting(false);
    setConfirmOpen(false);
    if (!result.ok) {
      setSubmitMessage(result.error);
      return;
    }
    wallet.refresh();
    balance.refresh();
    onCompleted?.(amount);
    onClose();
  };

  const closeLabel = t("withdraw.close");

  return (
    <WalletSheet onClose={onClose} dismissible={!submitting} closeLabel={closeLabel}>
      <WalletSheetHeader
        titleIconSrc="/assets/deposit/Wallet2.avif"
        title={<h2 className="text-xl font-semibold leading-tight sm:text-2xl">{t("withdraw.title")}</h2>}
        onClose={onClose}
        closeLabel={closeLabel}
      />

      <div className="pb-3">
        <ResourceGate resource={account} loadingLabel={t("withdraw.accountLoading")} errorTitle={t("withdraw.accountError")}>
          {(bank) => (
            <button
              type="button"
              className={`${WALLET_CARD_INTERACTIVE} flex w-full items-center gap-3 px-3 py-3.5 sm:px-4 sm:py-4`}
              aria-label={t("withdraw.changeAccount")}
            >
              <KbankLogoGraphic className="h-11 w-11 shrink-0" />
              <span className="min-w-0 flex-1">
                <span className={`${WALLET_HINT} block`}>{t("withdraw.transferToYourAccount")}</span>
                <span className="mt-0.5 block text-sm font-semibold sm:text-base">{bank.bankShortName}</span>
                <span className="mt-0.5 block font-sans text-xs tracking-wider text-[var(--text-muted)]">
                  {bank.accountNumberDisplay}
                </span>
                <span className={`${WALLET_HINT} mt-0.5 block truncate`}>{bank.holderLabel}</span>
              </span>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--Card-Normal)] text-[var(--text-muted)]">
                <ChevronRight className="h-4 w-4" />
              </span>
            </button>
          )}
        </ResourceGate>

        <div className="mt-5">
          <label htmlFor="withdraw-amount" className={`${WALLET_LABEL} block text-center`}>
            {t("withdraw.amountLabel")}
          </label>
          <div className="mt-4 pb-3">
            <div className="flex items-baseline justify-center gap-0.5">
              <span className="shrink-0 text-5xl font-semibold leading-none text-[var(--brand)] sm:text-6xl" aria-hidden="true">
                ฿
              </span>
              <input
                id="withdraw-amount"
                type="text"
                inputMode="numeric"
                value={amountInput}
                maxLength={MONEY_AMOUNT_MAX_DIGITS}
                onChange={(e) => handleAmountChange(e.target.value)}
                className="min-w-[2ch] max-w-[min(72vw,320px)] bg-transparent font-sans text-5xl font-semibold leading-none tracking-tight text-[var(--text-on-light)] outline-none sm:text-6xl"
                style={{ width: `${Math.max(2, amountInput.length || 1)}.5ch` }}
              />
            </div>
          </div>
          <div className={`${WALLET_HINT} mt-2 flex flex-wrap items-center justify-between gap-2`}>
            <p>{t("withdraw.available", { amount: formatWithdrawMoney(available) })}</p>
            <button
              type="button"
              onClick={() => applyAmount(available)}
              className="cursor-pointer border-0 bg-transparent text-xs font-semibold text-[var(--brand-strong)] underline-offset-2 transition-colors hover:text-[var(--brand)] hover:underline"
            >
              {t("withdraw.withdrawAll")}
            </button>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex flex-wrap items-center justify-center gap-2 px-1 pb-1">
            {(quick.data?.amounts ?? []).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => applyAmount(value)}
                className={choiceBtn(amount === value, "shrink-0 rounded-full px-4 py-2")}
              >
                {formatWithdrawAmount(value)}
              </button>
            ))}
          </div>
          <p className={`${WALLET_HINT} mt-2 text-center`}>{t("withdraw.quickAmountHint")}</p>
        </div>

        {submitMessage && (
          <p className={`${WALLET_ERROR} mt-4`} role="alert">
            {submitMessage}
          </p>
        )}
      </div>

      <button
        type="button"
        disabled={!canConfirm || submitting}
        onClick={() => canConfirm && setConfirmOpen(true)}
        className={WALLET_PRIMARY_BTN}
      >
        {submitting ? t("shared.submitting") : t("withdraw.submit")}
      </button>

      <WalletConfirmDialog
        kind="withdraw"
        open={confirmOpen}
        loading={submitting}
        title={t("withdraw.confirm.title")}
        description={
          account.data
            ? t("withdraw.confirm.description", {
                bank: account.data.bankShortName,
                account: account.data.accountNumberDisplay,
              })
            : undefined
        }
        confirmLabel={t("withdraw.confirm.confirm")}
        amountLabel={t("withdraw.confirm.amountLabel")}
        amountDisplay={formatWithdrawAmount(amount)}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
      />
    </WalletSheet>
  );
}

/** โลโก้ KBank แบบ SVG (ตัวเดียวกับที่ glass ใช้ในแถวบัญชีรับเงิน) */
function KbankLogoGraphic({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <circle cx="24" cy="24" r="22" fill="#fff" />
      <path d="M24 8c-6 4-10 10-10 16 0 8 6 14 10 16 4-2 10-8 10-16 0-6-4-12-10-16Z" fill="#138f4a" />
      <path d="M24 12c-4 3-7 8-7 12 0 5 4 9 7 11 3-2 7-6 7-11 0-4-3-9-7-12Z" fill="#e11d48" opacity="0.85" />
    </svg>
  );
}
