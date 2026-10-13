"use client";

import React, { useRef, useState } from "react";
import {
  X,
  ChevronLeft,
  Landmark,
  QrCode,
  Smartphone,
  Copy,
  Check,
  ChevronRight,
  ImageIcon,
  Plus,
  CheckCircle2,
  ArrowUpRight,
  History,
} from "lucide-react";
import Link from "@/lib/i18n/navigation";
import { WalletConfirmDialog } from "@/components/WalletConfirmDialog";
import { ResourceGate } from "@/app/components/ui/ResourceGate";
import { MONEY_AMOUNT_MAX_DIGITS, sanitizeMoneyAmount } from "@/lib/fieldInput";
import { submitDeposit } from "@/lib/api/deposit";
import { submitWithdraw } from "@/lib/api/withdraw";
import {
  useDepositBankAccount,
  useDepositMethods,
  useDepositQuickAmounts,
  useWithdrawAccount,
  useWithdrawBalance,
  useWithdrawQuickAmounts,
} from "@/app/hooks/api/money";
import { useWallet } from "@/app/hooks/api/account";
import {
  formatDepositAmount,
  formatDepositTransferAmount,
  formatWithdrawAmount,
  formatWithdrawMoney,
} from "@/lib/format";
import { useT } from "@/lib/i18n/I18nProvider";
import type { DepositBankAccountMock, DepositMethodId } from "@/app/types/wallet";

export type WalletActionTab = "deposit" | "withdraw";

export interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  tab: WalletActionTab;
  onTabChange: (tab: WalletActionTab) => void;
  onDepositCompleted?: (amount: number) => void;
  onWithdrawCompleted?: (amount: number) => void;
}

const METHOD_ICONS: Record<DepositMethodId, { Icon: typeof Landmark; color: string }> = {
  bank: { Icon: Landmark, color: "text-emerald-400" },
  gateway: { Icon: QrCode, color: "text-blue-400" },
  truemoney: { Icon: Smartphone, color: "text-amber-400" },
};

const errorBoxClass =
  "rounded-xl border border-rose-500/25 bg-rose-500/10 px-3 py-2 text-xs font-medium text-rose-400 sm:text-sm";

export function WalletModal({
  isOpen,
  onClose,
  tab,
  onTabChange,
  onDepositCompleted,
  onWithdrawCompleted,
}: WalletModalProps) {
  const t = useT("wallet");
  const tc = useT("common");
  /* ขั้นตอนฝากอยู่ในโมดัลชั้นนอกเพื่อสลับหัวข้อ/ปุ่มย้อนกลับ */
  const [depositStep, setDepositStep] = useState<"methods" | "bank" | "confirm">("methods");

  if (!isOpen) {
    if (depositStep !== "methods") setDepositStep("methods");
    return null;
  }

  const showBack = tab === "deposit" && depositStep !== "methods";

  return (
    <div className="fixed inset-0 z-[110] flex animate-fade-in select-none items-center justify-center p-3 sm:p-4">
      <div className="fixed inset-0 bg-black/60 transition-opacity" onClick={onClose} aria-hidden="true" />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={tab === "deposit" ? t("deposit.title") : t("withdraw.title")}
        className="relative z-10 flex max-h-[92vh] w-full max-w-[440px] flex-col overflow-y-auto rounded-[var(--radius-soft-xl)] border border-white/10 bg-[var(--BG-Surface-Darker)] p-4 text-[var(--text-on-light)] shadow-[var(--shadow-soft)] sm:p-5"
      >
        <div className="mb-3 flex items-center justify-between">
          {showBack ? (
            <button
              type="button"
              onClick={() => setDepositStep(depositStep === "confirm" ? "bank" : "methods")}
              aria-label={tc("back")}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-0 bg-[var(--BG-Surface-Normal)] text-[var(--text-muted)] transition-all hover:text-[var(--text-on-light)] active:scale-95"
            >
              <ChevronLeft className="h-5 w-5 stroke-[2.5]" />
            </button>
          ) : (
            <div className="h-8 w-8" />
          )}
          <h2 className="text-base font-extrabold leading-tight">
            {tab === "deposit"
              ? depositStep === "confirm"
                ? t("deposit.confirm.title")
                : t("deposit.title")
              : t("withdraw.title")}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={tab === "deposit" ? t("deposit.close") : t("withdraw.close")}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-0 bg-[var(--BG-Surface-Normal)] text-[var(--text-muted)] transition-all hover:text-[var(--text-on-light)] active:scale-95"
          >
            <X className="h-5 w-5 stroke-[2.2]" />
          </button>
        </div>

        {!showBack && (
          <div className="relative mb-3 flex border-b border-white/10">
            {(["deposit", "withdraw"] as const).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => onTabChange(id)}
                className={`relative flex-1 cursor-pointer border-0 bg-transparent py-2.5 text-center text-sm font-extrabold transition-all sm:text-base ${
                  tab === id ? "text-[var(--text-on-light)]" : "text-[var(--tab-inactive)] hover:text-[var(--text-on-light)]"
                }`}
              >
                {id === "deposit" ? t("deposit.title") : t("withdraw.title")}
                {tab === id && (
                  <span className="absolute inset-x-4 bottom-0 h-[2.5px] rounded-full bg-[var(--brand)]" />
                )}
              </button>
            ))}
          </div>
        )}

        {tab === "deposit" ? (
          <DepositPanel
            step={depositStep}
            onStepChange={setDepositStep}
            onCompleted={(amount) => {
              onDepositCompleted?.(amount);
              onClose();
            }}
          />
        ) : (
          <WithdrawPanel
            onCompleted={(amount) => {
              onWithdrawCompleted?.(amount);
              onClose();
            }}
          />
        )}

        <Link
          href="/transactions"
          onClick={onClose}
          className="mt-4 flex items-center justify-center gap-1.5 text-sm font-bold text-[var(--text-muted)] underline-offset-4 hover:text-[var(--text-primary)] hover:underline"
        >
          <History className="h-4 w-4" />
          {t("pending.viewHistory")}
        </Link>
      </div>
    </div>
  );
}

/* ───────────────────────── ฝากเงิน ───────────────────────── */

function DepositPanel({
  step,
  onStepChange,
  onCompleted,
}: {
  step: "methods" | "bank" | "confirm";
  onStepChange: (step: "methods" | "bank" | "confirm") => void;
  onCompleted: (amount: number) => void;
}) {
  const t = useT("wallet");
  const methods = useDepositMethods();
  const quick = useDepositQuickAmounts();
  const bankAccount = useDepositBankAccount();
  const wallet = useWallet();
  const defaultAmount = quick.data?.defaultAmount ?? 0;

  const [amount, setAmount] = useState(defaultAmount);
  const [amountInput, setAmountInput] = useState(defaultAmount ? String(defaultAmount) : "");
  /** ยอดเริ่มต้นมาถึงหลัง mount — ตั้งค่าฟอร์มครั้งเดียวต่อค่า */
  const [seededDefault, setSeededDefault] = useState(defaultAmount);
  if (seededDefault !== defaultAmount) {
    setSeededDefault(defaultAmount);
    setAmount(defaultAmount);
    setAmountInput(String(defaultAmount));
  }
  const [copied, setCopied] = useState(false);
  const [slipFileName, setSlipFileName] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [finalConfirmOpen, setFinalConfirmOpen] = useState(false);
  const slipInputRef = useRef<HTMLInputElement>(null);

  const handleQuickAmount = (value: number) => {
    setAmount(value);
    setAmountInput(String(value));
  };

  const handleAmountChange = (raw: string) => {
    const digits = sanitizeMoneyAmount(raw);
    setAmountInput(digits);
    setAmount(digits ? Number.parseInt(digits, 10) : 0);
  };

  const handleCopyAccount = async () => {
    try {
      if (!bankAccount.data) return;
      await navigator.clipboard.writeText(bankAccount.data.accountNumberCopy);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard ไม่พร้อม */
    }
  };

  const handleConfirmDeposit = async () => {
    if (amount <= 0) return;
    setSubmitting(true);
    setSubmitMessage(null);
    const result = await submitDeposit({ amount, methodId: "bank" });
    setSubmitting(false);
    setFinalConfirmOpen(false);
    if (!result.ok) {
      setSubmitMessage(result.error);
      return;
    }
    wallet.refresh();
    onCompleted(amount);
  };

  const bankCard = (bank: DepositBankAccountMock) => (
    <div className="rounded-[var(--radius-soft-lg)] bg-[var(--BG-Surface-Normal)] p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-[#12803b]">
          <Landmark className="h-6 w-6 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-extrabold leading-tight sm:text-[15px]">{bank.bankName}</h4>
          <p className="mt-0.5 truncate text-xs font-medium text-[var(--text-muted)]">
            {t("deposit.confirm.accountNameLabel")}
            {bank.accountName}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span className="select-all font-mono text-sm font-black tracking-wider sm:text-base">
              {bank.accountNumberDisplay}
            </span>
            <button
              type="button"
              onClick={handleCopyAccount}
              className="cursor-pointer rounded-lg border-0 bg-transparent p-1 text-[var(--brand)] transition-colors hover:bg-[var(--brand-soft)]"
              aria-label={t("shared.copyAccountNumber")}
            >
              {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
          {copied && (
            <p className="mt-1 text-xs text-emerald-400" role="status">
              {t("shared.copied")}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  if (step === "methods") {
    return (
      <ResourceGate resource={methods} loadingLabel={t("deposit.methodsLoading")} errorTitle={t("deposit.methodsError")}>
        {(list) => (
          <div className="space-y-3">
            <p className="text-xs font-bold text-[var(--text-muted)]">{t("deposit.selectMethod")}</p>
            <ul className="grid grid-cols-3 gap-2" aria-label={t("deposit.methodsAria")}>
              {list.map((method) => {
                const { Icon, color } = METHOD_ICONS[method.id];
                return (
                  <li key={method.id}>
                    <button
                      type="button"
                      onClick={() => {
                        /* gateway / truemoney — ยังไม่มี step ถัดไป (เหมือน glass) */
                        if (method.id === "bank") onStepChange("bank");
                      }}
                      className="flex w-full cursor-pointer flex-col items-center justify-center gap-1.5 rounded-2xl border-0 bg-[var(--BG-Surface-Normal)] p-2.5 text-[var(--text-on-light)] transition-all hover:ring-1 hover:ring-[var(--brand)]"
                    >
                      <Icon className={`h-5 w-5 ${color}`} />
                      <span className="text-center text-[11px] font-bold">{t(method.titleKey)}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </ResourceGate>
    );
  }

  if (step === "bank") {
    return (
      <ResourceGate resource={bankAccount} loadingLabel={t("deposit.bankAccountLoading")} errorTitle={t("deposit.bankAccountError")}>
        {(bank) => (
          <div className="space-y-3.5">
            {bankCard(bank)}

            <div className="rounded-[var(--radius-soft-lg)] bg-[var(--BG-Surface-Normal)] p-4">
              <label htmlFor="deposit-amount" className="mb-2 block text-xs font-bold text-[var(--text-muted)]">
                {t("deposit.bank.amountLabel")}
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-base font-black text-[var(--brand)]">฿</span>
                <input
                  id="deposit-amount"
                  type="text"
                  inputMode="numeric"
                  value={amountInput}
                  maxLength={MONEY_AMOUNT_MAX_DIGITS}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  className="h-11 w-full rounded-xl border border-white/10 bg-[var(--Card-Normal)] pl-9 pr-14 font-mono text-sm font-bold text-[var(--text-on-light)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/40"
                />
                <span className="absolute right-3 text-xs text-[var(--text-muted)]">{t("shared.currencyUnit")}</span>
              </div>

              <p className="mb-2 mt-3 text-xs font-bold text-[var(--text-muted)]">{t("deposit.bank.quickAmount")}</p>
              <div className="grid grid-cols-3 gap-2">
                {(quick.data?.amounts ?? []).map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleQuickAmount(value)}
                    className={`cursor-pointer rounded-xl border-0 px-1 py-2 text-xs font-black transition-all ${
                      amount === value
                        ? "bg-[var(--brand)] text-[#2a0607]"
                        : "bg-[var(--Card-Normal)] text-[var(--text-on-light)] hover:bg-[var(--brand-soft)]"
                    }`}
                  >
                    ฿{formatDepositAmount(value)}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-center text-[11px] text-[var(--text-muted)]">{t("deposit.bank.quickAmountHint")}</p>

              <button
                type="button"
                disabled={amount <= 0}
                onClick={() => {
                  if (amount <= 0) return;
                  setSubmitMessage(null);
                  onStepChange("confirm");
                }}
                className="soft-btn-primary mt-3.5 flex h-12 w-full cursor-pointer items-center justify-center gap-2 text-sm font-extrabold transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span>{t("deposit.bank.next")}</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </ResourceGate>
    );
  }

  return (
    <>
      <ResourceGate resource={bankAccount} loadingLabel={t("deposit.bankAccountLoading")} errorTitle={t("deposit.bankAccountError")}>
        {(bank) => (
          <div className="animate-fade-in space-y-3.5">
            <div className="rounded-[var(--radius-soft-lg)] bg-[var(--BG-Surface-Normal)] p-4 text-center">
              <span className="mb-1 block text-xs font-bold text-[var(--text-muted)]">
                {t("deposit.confirm.transferAmount")}
              </span>
              <div className="my-1 inline-flex items-baseline justify-center gap-1.5">
                <span className="text-xl font-black text-[var(--brand)] sm:text-2xl">฿</span>
                <span className="font-mono text-3xl font-black tracking-tight sm:text-4xl">
                  {formatDepositTransferAmount(amount)}
                </span>
              </div>
            </div>

            {bankCard(bank)}

            <div>
              <span className="mb-2 block text-xs font-extrabold sm:text-[13px]">{t("deposit.confirm.slipTitle")}</span>
              <input
                ref={slipInputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => setSlipFileName(e.target.files?.[0]?.name ?? null)}
              />
              <button
                type="button"
                onClick={() => slipInputRef.current?.click()}
                className="group flex w-full cursor-pointer items-center justify-between rounded-[20px] border-2 border-dashed border-[var(--brand)]/40 bg-[var(--BG-Surface-Normal)] p-3.5 text-left transition-all hover:border-[var(--brand)]"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--brand-soft)] text-[var(--brand)]">
                    {slipFileName ? <CheckCircle2 className="h-6 w-6 text-emerald-400" /> : <ImageIcon className="h-6 w-6" />}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-xs font-bold sm:text-[13px]">
                      {slipFileName ?? t("deposit.confirm.slipPick")}
                    </span>
                    <span className="block truncate text-[10px] text-[var(--text-muted)]">
                      {slipFileName ? t("deposit.confirm.slipChange") : t("deposit.confirm.slipFromDevice")}
                    </span>
                  </span>
                </span>
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[var(--brand)] text-[#2a0607]">
                  <Plus className="h-4 w-4 stroke-[2.5]" />
                </span>
              </button>
              <span className="mt-1.5 block text-[11px] font-medium text-[var(--text-muted)]">
                {t("deposit.confirm.slipHint")}
              </span>
            </div>

            {submitMessage && (
              <p className={errorBoxClass} role="alert">
                {submitMessage}
              </p>
            )}

            <div className="pt-2">
              <button
                type="button"
                disabled={submitting}
                onClick={() => setFinalConfirmOpen(true)}
                className="soft-btn-primary flex h-12 w-full cursor-pointer items-center justify-center gap-2 text-[15px] font-extrabold transition-transform active:scale-[0.98] disabled:opacity-60"
              >
                {submitting ? t("shared.submitting") : t("deposit.confirm.submit")}
              </button>
            </div>
          </div>
        )}
      </ResourceGate>

      <WalletConfirmDialog
        kind="deposit"
        open={finalConfirmOpen}
        loading={submitting}
        title={t("deposit.finalConfirm.title")}
        description={t("deposit.finalConfirm.description")}
        confirmLabel={t("deposit.finalConfirm.confirm")}
        amountLabel={t("deposit.finalConfirm.amountLabel")}
        amountDisplay={formatDepositTransferAmount(amount)}
        onClose={() => setFinalConfirmOpen(false)}
        onConfirm={handleConfirmDeposit}
      />
    </>
  );
}

/* ───────────────────────── ถอนเงิน ───────────────────────── */

function WithdrawPanel({ onCompleted }: { onCompleted: (amount: number) => void }) {
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
    onCompleted(amount);
  };

  return (
    <div className="animate-fade-in space-y-4 pt-1">
      <ResourceGate resource={account} loadingLabel={t("withdraw.accountLoading")} errorTitle={t("withdraw.accountError")}>
        {(bank) => (
          <div className="flex items-center justify-between rounded-[var(--radius-soft-lg)] bg-[var(--BG-Surface-Normal)] p-3.5">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#12803b]">
                <Landmark className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0 text-left">
                <span className="block text-[11px] font-medium leading-tight text-[var(--text-muted)]">
                  {t("withdraw.transferToYourAccount")}
                </span>
                <span className="mt-0.5 block text-sm font-extrabold leading-tight sm:text-[15px]">
                  {bank.bankShortName}
                </span>
                <span className="mt-0.5 block font-mono text-xs leading-tight tracking-wider text-[var(--text-muted)]">
                  {bank.accountNumberDisplay}
                </span>
                <span className="mt-0.5 block truncate text-[11px] leading-tight text-[var(--text-muted)]">
                  {bank.holderLabel}
                </span>
              </div>
            </div>
          </div>
        )}
      </ResourceGate>

      <div className="py-2 text-center">
        <label htmlFor="withdraw-amount" className="mb-2 block text-xs font-bold text-[var(--text-muted)] sm:text-[13px]">
          {t("withdraw.amountLabel")}
        </label>
        <div className="inline-flex items-baseline justify-center gap-1.5 sm:gap-2">
          <span className="text-2xl font-black text-[var(--brand)] sm:text-3xl">฿</span>
          <input
            id="withdraw-amount"
            type="text"
            inputMode="numeric"
            value={amountInput}
            maxLength={MONEY_AMOUNT_MAX_DIGITS}
            onChange={(e) => handleAmountChange(e.target.value)}
            className="w-48 border-b-2 border-transparent bg-transparent text-center font-mono text-4xl font-black tracking-tight text-[var(--text-on-light)] focus:border-[var(--brand)]/50 focus:outline-none sm:w-56 sm:text-5xl"
          />
        </div>
      </div>

      <div className="flex items-center justify-between px-1 text-xs">
        <span className="font-bold text-[var(--text-muted)]">
          {t("withdraw.available", { amount: formatWithdrawMoney(available) })}
        </span>
        <button
          type="button"
          onClick={() => applyAmount(available)}
          className="cursor-pointer border-0 bg-transparent text-xs font-bold text-[var(--brand-strong)] transition-colors hover:text-[var(--brand)]"
        >
          {t("withdraw.withdrawAll")}
        </button>
      </div>

      <div>
        <div className="mb-2 flex flex-wrap items-center justify-center gap-2">
          {(quick.data?.amounts ?? []).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => applyAmount(value)}
              className={`shrink-0 cursor-pointer rounded-full border-0 px-4 py-2 text-xs font-black transition-all ${
                amount === value
                  ? "scale-105 bg-[var(--brand)] text-[#2a0607] shadow-sm"
                  : "bg-[var(--BG-Surface-Normal)] text-[var(--text-on-light)] hover:bg-[var(--brand-soft)]"
              }`}
            >
              {formatWithdrawAmount(value)}
            </button>
          ))}
        </div>
        <span className="block text-center text-[11px] font-medium text-[var(--text-muted)]">
          {t("withdraw.quickAmountHint")}
        </span>
      </div>

      {submitMessage && (
        <p className={errorBoxClass} role="alert">
          {submitMessage}
        </p>
      )}

      <div className="pt-2">
        <button
          type="button"
          disabled={!canConfirm || submitting}
          onClick={() => canConfirm && setConfirmOpen(true)}
          className="soft-btn-primary flex h-12 w-full cursor-pointer items-center justify-center gap-2 text-[15px] font-extrabold transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? (
            t("shared.submitting")
          ) : (
            <>
              <ArrowUpRight className="h-[18px] w-[18px] stroke-[2.5]" />
              <span>{t("withdraw.submit")}</span>
            </>
          )}
        </button>
      </div>

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
    </div>
  );
}
