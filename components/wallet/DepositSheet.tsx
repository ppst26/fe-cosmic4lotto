"use client";

import React, { useRef, useState } from "react";
import { Check, ChevronRight, Copy, ImageIcon, Plus } from "lucide-react";
import { WalletConfirmDialog } from "@/components/WalletConfirmDialog";
import {
  WALLET_CARD,
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
import { submitDeposit } from "@/lib/api/deposit";
import {
  useDepositBankAccount,
  useDepositMethods,
  useDepositQuickAmounts,
} from "@/app/hooks/api/money";
import { useWallet } from "@/app/hooks/api/account";
import { formatDepositAmount, formatDepositTransferAmount } from "@/lib/format";
import { useT } from "@/lib/i18n/I18nProvider";
import type { MessageKey } from "@/lib/i18n/messages";
import type { DepositBankAccountMock, DepositMethodId } from "@/app/types/wallet";

type DepositSheetStep = "methods" | "bank" | "confirm";

interface DepositSheetProps {
  onClose: () => void;
  onCompleted?: (amount: number) => void;
}

const METHOD_ASSETS: Record<DepositMethodId, { src: string; altKey: MessageKey<"wallet"> }> = {
  bank: { src: "/assets/deposit/bank.avif", altKey: "deposit.methods.bank.title" },
  gateway: { src: "/assets/deposit/payment.avif", altKey: "deposit.methods.gateway.title" },
  truemoney: { src: "/assets/deposit/trueWallet.avif", altKey: "deposit.methods.truemoney.title" },
};

/**
 * ฝากเงิน — flow เดียวกับ glass: step 1 ช่องทาง · step 2 บัญชี+ยอด · step 3 ยืนยัน+สลิป → ยืนยันส่งคำขอ
 * mount เมื่อเปิด / unmount เมื่อปิด จึงรีเซ็ตฟอร์มทุกครั้ง
 */
export function DepositSheet({ onClose, onCompleted }: DepositSheetProps) {
  const t = useT("wallet");
  const methods = useDepositMethods();
  const quick = useDepositQuickAmounts();
  const bankAccount = useDepositBankAccount();
  const wallet = useWallet();
  const defaultAmount = quick.data?.defaultAmount ?? 0;

  const [step, setStep] = useState<DepositSheetStep>("methods");
  const [amount, setAmount] = useState(defaultAmount);
  const [amountInput, setAmountInput] = useState(defaultAmount ? String(defaultAmount) : "");
  /** ยอดเริ่มต้นมาถึงหลัง mount — ตั้งค่าฟอร์มครั้งเดียวต่อค่า (ปรับระหว่าง render) */
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

  const handleSelectMethod = (methodId: DepositMethodId) => {
    if (methodId === "bank") setStep("bank");
    /* gateway / truemoney — step ถัดไปยังไม่ implement (เหมือน glass) */
  };

  const handleBackToMethods = () => {
    setStep("methods");
    setCopied(false);
  };

  const handleBackToBank = () => {
    setStep("bank");
    setCopied(false);
    setSubmitMessage(null);
  };

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

  const handleNext = () => {
    if (amount <= 0) return;
    setStep("confirm");
    setSubmitMessage(null);
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
    onCompleted?.(amount);
    onClose();
  };

  const closeLabel = t("deposit.close");

  return (
    <WalletSheet onClose={onClose} dismissible={!submitting} closeLabel={closeLabel}>
      {step === "methods" && (
        <>
          <WalletSheetHeader
            titleIconSrc="/assets/deposit/Wallet2.avif"
            title={<h2 className="text-xl font-semibold leading-tight sm:text-2xl">{t("deposit.title")}</h2>}
            subtitle={<p className="mt-1 text-sm text-[var(--text-muted)]">{t("deposit.selectMethod")}</p>}
            onClose={onClose}
            closeLabel={closeLabel}
          />
          <ResourceGate resource={methods} loadingLabel={t("deposit.methodsLoading")} errorTitle={t("deposit.methodsError")}>
            {(list) => (
              <ul className="flex flex-col gap-3 pb-2" aria-label={t("deposit.methodsAria")}>
                {list.map((method) => {
                  const asset = METHOD_ASSETS[method.id];
                  return (
                    <li key={method.id}>
                      <button
                        type="button"
                        onClick={() => handleSelectMethod(method.id)}
                        className={`${WALLET_CARD_INTERACTIVE} flex w-full items-center gap-3.5 px-3.5 py-3.5 sm:gap-4 sm:px-4 sm:py-4`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={asset.src} alt={t(asset.altKey)} className="h-8 w-8 shrink-0 object-contain sm:h-9 sm:w-9" />
                        <span className="min-w-0 flex-1 text-sm font-semibold sm:text-base">{t(method.titleKey)}</span>
                        <ChevronRight className="h-5 w-5 shrink-0 text-[var(--text-muted)]" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </ResourceGate>
        </>
      )}

      {step === "bank" && (
        <>
          <WalletSheetHeader
            title={<h2 className="text-lg font-semibold leading-tight">{t("deposit.bank.title")}</h2>}
            onBack={handleBackToMethods}
            backLabel={t("deposit.bank.back")}
            onClose={onClose}
            closeLabel={closeLabel}
          />
          <ResourceGate resource={bankAccount} loadingLabel={t("deposit.bankAccountLoading")} errorTitle={t("deposit.bankAccountError")}>
            {(bank) => (
              <div className="space-y-4 pb-3">
                <BankDetailCard bank={bank} copied={copied} onCopy={handleCopyAccount} />

                <div>
                  <label htmlFor="deposit-amount" className={WALLET_LABEL}>
                    {t("deposit.bank.amountLabel")}
                  </label>
                  <div className="mt-2 flex h-14 items-center rounded-xl border border-white/10 bg-[var(--Card-Normal)] focus-within:ring-2 focus-within:ring-[var(--brand)]/40">
                    <span className="px-3 text-lg font-semibold text-[var(--brand)]">฿</span>
                    <input
                      id="deposit-amount"
                      type="text"
                      inputMode="numeric"
                      value={amountInput}
                      maxLength={MONEY_AMOUNT_MAX_DIGITS}
                      onChange={(e) => handleAmountChange(e.target.value)}
                      className="min-w-0 flex-1 bg-transparent px-1 font-sans text-2xl font-semibold text-[var(--text-on-light)] outline-none"
                    />
                    <span className="shrink-0 px-3 text-sm text-[var(--text-muted)]">{t("shared.currencyUnit")}</span>
                  </div>
                </div>

                <div>
                  <p className={WALLET_LABEL}>{t("deposit.bank.quickAmount")}</p>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {(quick.data?.amounts ?? []).map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => handleQuickAmount(value)}
                        className={choiceBtn(amount === value, "py-2.5 text-sm")}
                      >
                        {formatDepositAmount(value)}
                      </button>
                    ))}
                  </div>
                  <p className={`${WALLET_HINT} mt-2 text-center`}>{t("deposit.bank.quickAmountHint")}</p>
                </div>

                <button type="button" disabled={amount <= 0} onClick={handleNext} className={WALLET_PRIMARY_BTN}>
                  {t("deposit.bank.next")}
                </button>
              </div>
            )}
          </ResourceGate>
        </>
      )}

      {step === "confirm" && (
        <>
          <WalletSheetHeader
            title={<h2 className="text-lg font-semibold leading-tight">{t("deposit.confirm.title")}</h2>}
            subtitle={<p className="mt-0.5 text-xs text-[var(--text-muted)]">{t("deposit.confirm.step", { current: 3, total: 3 })}</p>}
            onBack={handleBackToBank}
            backLabel={t("deposit.confirm.back")}
            onClose={onClose}
            closeLabel={closeLabel}
          />
          <ResourceGate resource={bankAccount} loadingLabel={t("deposit.bankAccountLoading")} errorTitle={t("deposit.bankAccountError")}>
            {(bank) => (
              <div className="space-y-3 pb-3">
                <section className={`${WALLET_CARD} px-3 py-3.5 text-center sm:px-4`}>
                  <p className={WALLET_HINT}>{t("deposit.confirm.transferAmount")}</p>
                  <p className="mt-1 font-sans text-3xl font-semibold text-[var(--brand)] sm:text-4xl">
                    ฿ {formatDepositTransferAmount(amount)}
                  </p>
                </section>

                <section className={`${WALLET_CARD} px-3 py-3 sm:px-4 sm:py-3.5`}>
                  <div className="flex items-start gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/assets/bank-logo/KBANK.webp" alt={bank.bankName} className="h-10 w-10 shrink-0 rounded-xl object-contain" />
                    <div className="min-w-0 flex-1 space-y-1.5 text-sm">
                      <p className="font-semibold">{bank.bankName}</p>
                      <p className="text-[var(--text-muted)]">
                        {t("deposit.confirm.accountNameLabel")}
                        <span className="text-[var(--text-on-light)]">{bank.accountName}</span>
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-[var(--text-muted)]">
                          {t("deposit.confirm.accountNumberLabel")}
                          <span className="font-semibold text-[var(--text-on-light)]">{bank.accountNumberDisplay}</span>
                        </p>
                        <CopyButton copied={copied} onCopy={handleCopyAccount} />
                      </div>
                      {copied && (
                        <p className="text-xs text-emerald-400" role="status">
                          {t("shared.copied")}
                        </p>
                      )}
                    </div>
                  </div>
                  <p className={`${WALLET_HINT} mt-3 text-center`}>{t("deposit.confirm.sampleNote")}</p>
                </section>

                <section className="pt-1">
                  <p className="text-sm font-semibold">{t("deposit.confirm.slipTitle")}</p>
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
                    className={`${WALLET_CARD_INTERACTIVE} mt-2 flex w-full items-center gap-3 px-3 py-3.5 sm:px-4`}
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-soft)] text-[var(--brand)]">
                      {slipFileName ? <Check className="h-6 w-6 text-emerald-400" /> : <ImageIcon className="h-6 w-6" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{slipFileName ?? t("deposit.confirm.slipPick")}</span>
                      <span className="mt-0.5 block truncate text-[11px] text-[var(--text-muted)]">
                        {slipFileName ? t("deposit.confirm.slipChange") : t("deposit.confirm.slipFromDevice")}
                      </span>
                    </span>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--brand)] text-[#2a0607]">
                      <Plus className="h-4 w-4 stroke-[2.5]" />
                    </span>
                  </button>
                  <p className={`${WALLET_HINT} mt-2`}>{t("deposit.confirm.slipHint")}</p>
                </section>

                {submitMessage && (
                  <p className={WALLET_ERROR} role="alert">
                    {submitMessage}
                  </p>
                )}

                <div className="border-t border-white/10 pt-3">
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => setFinalConfirmOpen(true)}
                    className={WALLET_PRIMARY_BTN}
                  >
                    {submitting ? t("shared.submitting") : t("deposit.confirm.submit")}
                  </button>
                </div>
              </div>
            )}
          </ResourceGate>
        </>
      )}

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
    </WalletSheet>
  );
}

function CopyButton({ copied, onCopy }: { copied: boolean; onCopy: () => void }) {
  const t = useT("wallet");
  return (
    <button
      type="button"
      onClick={onCopy}
      className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-[var(--Card-Normal)] text-[var(--brand)] transition-all hover:bg-[var(--brand-soft)] active:scale-95"
      aria-label={t("shared.copyAccountNumber")}
    >
      {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
    </button>
  );
}

/** การ์ดบัญชีรับโอน step 2 — โลโก้ธนาคารใหญ่ + ธนาคาร/ชื่อบัญชี/เลขบัญชี (layout เดียวกับ glass) */
function BankDetailCard({
  bank,
  copied,
  onCopy,
}: {
  bank: DepositBankAccountMock;
  copied: boolean;
  onCopy: () => void;
}) {
  const t = useT("wallet");
  return (
    <section className={`${WALLET_CARD} p-3.5 sm:p-4`}>
      <div className="flex items-center gap-3.5 sm:gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/bank-logo/KBANK.webp" alt={bank.bankName} className="h-16 w-16 shrink-0 rounded-xl object-contain sm:h-[72px] sm:w-[72px]" />
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-2.5">
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className={`${WALLET_HINT} shrink-0`}>{t("deposit.bank.bankLabel")}</span>
              <span className="truncate text-sm font-semibold sm:text-base">{bank.bankName}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className={`${WALLET_HINT} shrink-0`}>{t("deposit.bank.accountName")}</span>
              <span className="truncate text-sm font-semibold">{bank.accountName}</span>
            </div>
          </div>
          <div>
            <span className={WALLET_HINT}>{t("deposit.bank.accountNumber")}</span>
            <div className="mt-0.5 flex items-center justify-between gap-2">
              <span className="min-w-0 select-all font-sans text-base font-semibold tracking-wider sm:text-lg">
                {bank.accountNumberDisplay}
              </span>
              <CopyButton copied={copied} onCopy={onCopy} />
            </div>
            {copied && (
              <p className="mt-1 text-xs text-emerald-400" role="status">
                {t("shared.copied")}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
