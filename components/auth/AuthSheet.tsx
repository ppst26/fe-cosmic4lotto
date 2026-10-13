"use client";

import { useState } from "react";
import { OverlayPanel } from "@/app/components/ui/OverlayPanel";
import { ResourceGate } from "@/app/components/ui/ResourceGate";
import { useAuth } from "@/app/components/auth/AuthProvider";
import { useSignUpOptions } from "@/app/hooks/api/member";
import { useToast } from "@/context/ToastContext";
import {
  BANK_ACCOUNT_MAX_DIGITS,
  isBankAccountNumber,
  isPasswordLengthOk,
  isPersonName,
  isThaiMobilePhone,
  PASSWORD_MAX_LENGTH,
  PERSON_NAME_MAX_LENGTH,
  PHONE_DIGIT_LENGTH,
  sanitizeBankAccount,
  sanitizePassword,
  sanitizePersonName,
  sanitizePhone,
} from "@/lib/fieldInput";
import { useT } from "@/lib/i18n/I18nProvider";
import { LOTTO_SHEET_SURFACE } from "@/app/components/menu/lottoSurface";

const inputClass =
  "h-11 w-full rounded-2xl border border-white/10 bg-[var(--input-bg)] px-3.5 text-sm text-[var(--text-on-light)] placeholder:text-[var(--text-muted)] outline-none transition-colors [color-scheme:dark] focus:border-[var(--brand)]";

const linkButtonClass =
  "cursor-pointer border-0 bg-transparent p-0 text-sm font-semibold text-[var(--brand)]";

type AuthMode = "login" | "register";

export function AuthSheet({
  mode,
  onClose,
  onSwitch,
}: {
  mode: AuthMode;
  onClose: () => void;
  onSwitch: (mode: AuthMode) => void;
}) {
  const t = useT("auth");
  const tCommon = useT("common");
  const { login, register } = useAuth();
  const { showToast } = useToast();
  const signUpOptions = useSignUpOptions();
  const [pending, setPending] = useState(false);

  const [loginPhone, setLoginPhone] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [step, setStep] = useState<1 | 2>(1);
  const [phone, setPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bankId, setBankId] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [channelId, setChannelId] = useState("");

  function switchMode(next: AuthMode) {
    setStep(1);
    onSwitch(next);
  }

  async function submitLogin(event: React.FormEvent) {
    event.preventDefault();
    const normalizedPhone = sanitizePhone(loginPhone);
    if (!isThaiMobilePhone(normalizedPhone)) {
      showToast(t("validation.phone"), "error");
      return;
    }
    if (!loginPassword) {
      showToast(t("validation.passwordRequired"), "error");
      return;
    }
    setPending(true);
    const result = await login({ phone: normalizedPhone, password: loginPassword });
    setPending(false);
    if (!result.ok) {
      showToast(result.error ?? t("loginSheet.failed"), "error");
      return;
    }
    showToast(t("loginSheet.success"), "success");
    onClose();
  }

  function continueRegisterStep1(event: React.FormEvent) {
    event.preventDefault();
    if (!isThaiMobilePhone(sanitizePhone(phone))) {
      showToast(t("validation.phone"), "error");
      return;
    }
    if (!isPasswordLengthOk(regPassword)) {
      showToast(t("validation.passwordLength"), "error");
      return;
    }
    if (regPassword !== confirmPassword) {
      showToast(t("validation.passwordMismatch"), "error");
      return;
    }
    setStep(2);
  }

  async function submitRegister(event: React.FormEvent) {
    event.preventDefault();
    if (!isPersonName(firstName)) {
      showToast(t("validation.firstName"), "error");
      return;
    }
    if (!isPersonName(lastName)) {
      showToast(t("validation.lastName"), "error");
      return;
    }
    if (!isBankAccountNumber(accountNumber)) {
      showToast(t("validation.bankAccount"), "error");
      return;
    }
    if (!bankId) {
      showToast(t("validation.bankRequired"), "error");
      return;
    }
    if (!channelId) {
      showToast(t("validation.channelRequired"), "error");
      return;
    }
    setPending(true);
    const result = await register({
      phone: sanitizePhone(phone),
      password: regPassword,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      bankAccountNumber: accountNumber,
      bankId,
      channelId,
    });
    setPending(false);
    if (!result.ok) {
      showToast(result.error ?? t("signUpSheet.failed"), "error");
      return;
    }
    showToast(t("signUpSheet.success"), "success");
    onClose();
  }

  const title = mode === "login" ? t("login") : t("signUp");
  const closeLabel = mode === "login" ? t("loginSheet.close") : t("signUpSheet.close");

  return (
    <OverlayPanel
      title={title}
      onClose={onClose}
      closeLabel={closeLabel}
      zClassName="z-[120]"
      dismissible={!pending}
      className={LOTTO_SHEET_SURFACE}
    >
      {mode === "login" ? (
        <form onSubmit={submitLogin} className="space-y-3">
          <p className="text-xs text-[var(--text-muted)]">{t("loginSheet.subtitle")}</p>
          <input
            type="tel"
            value={loginPhone}
            onChange={(event) => setLoginPhone(sanitizePhone(event.target.value))}
            placeholder={t("fields.phonePlaceholder")}
            aria-label={t("fields.phone")}
            inputMode="tel"
            maxLength={PHONE_DIGIT_LENGTH}
            className={inputClass}
            autoComplete="tel"
          />
          <input
            type="password"
            value={loginPassword}
            onChange={(event) => setLoginPassword(sanitizePassword(event.target.value))}
            placeholder={t("fields.passwordPlaceholder")}
            aria-label={t("fields.password")}
            maxLength={PASSWORD_MAX_LENGTH}
            className={inputClass}
            autoComplete="current-password"
          />
          <button
            type="submit"
            disabled={pending}
            className="soft-btn-primary h-11 w-full text-sm font-semibold"
          >
            {pending ? t("loginSheet.submitting") : t("login")}
          </button>
          <p className="text-center text-sm text-[var(--text-muted)]">
            {t("loginSheet.noAccount")}{" "}
            <button type="button" className={linkButtonClass} onClick={() => switchMode("register")}>
              {t("signUp")}
            </button>
          </p>
        </form>
      ) : step === 1 ? (
        <form onSubmit={continueRegisterStep1} className="space-y-3">
          <input
            type="tel"
            value={phone}
            onChange={(event) => setPhone(sanitizePhone(event.target.value))}
            placeholder={t("fields.phonePlaceholder")}
            aria-label={t("fields.phone")}
            inputMode="tel"
            maxLength={PHONE_DIGIT_LENGTH}
            className={inputClass}
            autoComplete="tel"
          />
          <input
            type="password"
            value={regPassword}
            onChange={(event) => setRegPassword(sanitizePassword(event.target.value))}
            placeholder={t("fields.passwordPlaceholder")}
            aria-label={t("fields.password")}
            maxLength={PASSWORD_MAX_LENGTH}
            className={inputClass}
            autoComplete="new-password"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(sanitizePassword(event.target.value))}
            placeholder={t("fields.confirmPasswordPlaceholder")}
            aria-label={t("fields.confirmPassword")}
            maxLength={PASSWORD_MAX_LENGTH}
            className={inputClass}
            autoComplete="new-password"
          />
          <button type="submit" className="soft-btn-primary h-11 w-full text-sm font-semibold">
            {tCommon("next")}
          </button>
          <p className="text-center text-sm text-[var(--text-muted)]">
            {t("signUpSheet.haveAccount")}{" "}
            <button type="button" className={linkButtonClass} onClick={() => switchMode("login")}>
              {t("login")}
            </button>
          </p>
        </form>
      ) : (
        <ResourceGate
          resource={signUpOptions}
          loadingLabel={t("signUpSheet.loadingBanks")}
          errorTitle={t("signUpSheet.banksFailed")}
        >
          {({ banks, channels }) => (
            <form onSubmit={submitRegister} className="space-y-3">
              <input
                value={firstName}
                onChange={(event) => setFirstName(sanitizePersonName(event.target.value))}
                placeholder={t("fields.firstName")}
                aria-label={t("fields.firstName")}
                maxLength={PERSON_NAME_MAX_LENGTH}
                className={inputClass}
                autoComplete="given-name"
              />
              <input
                value={lastName}
                onChange={(event) => setLastName(sanitizePersonName(event.target.value))}
                placeholder={t("fields.lastName")}
                aria-label={t("fields.lastName")}
                maxLength={PERSON_NAME_MAX_LENGTH}
                className={inputClass}
                autoComplete="family-name"
              />
              <select
                value={bankId}
                onChange={(event) => setBankId(event.target.value)}
                aria-label={t("fields.bank")}
                className={inputClass}
              >
                <option value="">{t("fields.bankPlaceholder")}</option>
                {banks.map((bank) => (
                  <option key={bank.id} value={bank.id}>
                    {bank.label}
                  </option>
                ))}
              </select>
              <input
                value={accountNumber}
                onChange={(event) => setAccountNumber(sanitizeBankAccount(event.target.value))}
                placeholder={t("fields.bankAccountPlaceholder")}
                aria-label={t("fields.bankAccount")}
                inputMode="numeric"
                maxLength={BANK_ACCOUNT_MAX_DIGITS}
                className={inputClass}
                autoComplete="off"
              />
              <select
                value={channelId}
                onChange={(event) => setChannelId(event.target.value)}
                aria-label={t("fields.channel")}
                className={inputClass}
              >
                <option value="">{t("fields.channelPlaceholder")}</option>
                {channels.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="soft-btn-outline h-11 flex-1 text-sm font-semibold"
                >
                  {tCommon("back")}
                </button>
                <button
                  type="submit"
                  disabled={pending}
                  className="soft-btn-primary h-11 flex-1 text-sm font-semibold"
                >
                  {pending ? t("signUpSheet.submitting") : t("signUp")}
                </button>
              </div>
              <p className="text-center text-sm text-[var(--text-muted)]">
                {t("signUpSheet.haveAccount")}{" "}
                <button type="button" className={linkButtonClass} onClick={() => switchMode("login")}>
                  {t("login")}
                </button>
              </p>
            </form>
          )}
        </ResourceGate>
      )}
    </OverlayPanel>
  );
}
