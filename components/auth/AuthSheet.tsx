"use client";

import { useState } from "react";
import Image from "next/image";
import { Eye, EyeOff, Lock, Smartphone, X } from "lucide-react";
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
import { SelectField } from "@/components/ui/select";

/** ช่องกรอกแบบ glass — พื้นเข้ม โค้งมน ไอคอนซ้าย */
const fieldRowClass =
  "flex h-12 items-center gap-2.5 rounded-2xl border border-white/10 bg-[var(--input-bg)] px-3 transition-colors focus-within:border-[var(--brand)]";
const fieldInputClass =
  "min-w-0 flex-1 bg-transparent text-sm text-[var(--text-on-light)] outline-none placeholder:text-[var(--text-muted)] [color-scheme:dark]";
const fieldLabelClass = "text-sm font-medium text-[var(--text-muted)]";
const primaryButtonClass =
  "soft-btn-primary h-12 w-full rounded-full text-sm font-semibold disabled:opacity-60";

function Field({
  id,
  label,
  icon,
  trailing,
  children,
}: {
  id?: string;
  label: string;
  icon?: React.ReactNode;
  trailing?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className={fieldLabelClass}>
        {label}
      </label>
      <div className={fieldRowClass}>
        {icon ? <span className="shrink-0 text-[var(--text-muted)]">{icon}</span> : null}
        {children}
        {trailing}
      </div>
    </div>
  );
}

function PasswordToggle({ shown, onToggle, label }: { shown: boolean; onToggle: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={label}
      className="shrink-0 cursor-pointer border-0 bg-transparent p-0 text-[var(--text-muted)] hover:text-[var(--text-on-light)]"
    >
      {shown ? <EyeOff className="h-5 w-5" aria-hidden /> : <Eye className="h-5 w-5" aria-hidden />}
    </button>
  );
}

/** แบนเนอร์สมัครสมาชิก — มือถือด้านบน (1200:491) · desktop แนวตั้งด้านขวา */
function SignUpHero() {
  return (
    <div className="relative aspect-[1200/491] w-full shrink-0 overflow-hidden md:hidden" aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/signup/banner.webp" alt="" width={960} height={393} decoding="async" className="absolute inset-0 h-full w-full object-cover" />
    </div>
  );
}

function SignUpSideBanner() {
  return (
    <div className="relative hidden w-[280px] shrink-0 self-stretch overflow-hidden md:block" aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/signup/banner-tall.webp" alt="" width={640} height={1137} decoding="async" className="absolute inset-0 h-full w-full object-cover" />
    </div>
  );
}

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
  const toggleLabel = (shown: boolean) => (shown ? "Hide password" : "Show password");

  const footerLink = (label: string, action: string, target: AuthMode) => (
    <p className="text-center text-sm text-[var(--text-muted)]">
      {label}{" "}
      <button type="button" className={linkButtonClass} onClick={() => switchMode(target)}>
        {action}
      </button>
    </p>
  );

  const closeButton = (
    <button
      type="button"
      onClick={onClose}
      disabled={pending}
      aria-label={closeLabel}
      className="absolute right-3 top-3 z-20 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-0 bg-black/40 text-[var(--text-muted)] backdrop-blur-sm hover:text-[var(--text-on-light)] disabled:opacity-50"
    >
      <X className="h-4 w-4" aria-hidden />
    </button>
  );

  return (
    <OverlayPanel
      title={title}
      onClose={onClose}
      closeLabel={closeLabel}
      zClassName="z-[120]"
      hideHeader
      dismissible={!pending}
      maxWidthClassName={mode === "login" ? "md:max-w-[440px]" : "md:max-w-[740px]"}
      className={`${LOTTO_SHEET_SURFACE} !p-0`}
    >
      {closeButton}
      {mode === "login" ? (
        <form onSubmit={submitLogin} className="flex flex-col gap-4 px-5 pb-6 pt-14">
          <div className="flex justify-center">
            <Image src="/cosmic-dark.png" alt="Cosmicbet" width={180} height={52} priority className="h-10 w-auto max-w-[190px] object-contain" />
          </div>
          <h2 className="sr-only">{title}</h2>
          <Field id="login-phone" label={t("fields.phone")} icon={<Smartphone className="h-5 w-5" aria-hidden />}>
            <input
              id="login-phone"
              type="tel"
              value={loginPhone}
              onChange={(event) => setLoginPhone(sanitizePhone(event.target.value))}
              placeholder={t("fields.phonePlaceholder")}
              inputMode="tel"
              maxLength={PHONE_DIGIT_LENGTH}
              className={fieldInputClass}
              autoComplete="tel"
            />
          </Field>
          <Field id="login-password" label={t("fields.password")} icon={<Lock className="h-5 w-5" aria-hidden />}>
            <input
              id="login-password"
              type="password"
              value={loginPassword}
              onChange={(event) => setLoginPassword(sanitizePassword(event.target.value))}
              placeholder={t("fields.passwordPlaceholder")}
              maxLength={PASSWORD_MAX_LENGTH}
              className={fieldInputClass}
              autoComplete="current-password"
            />
          </Field>
          <button type="submit" disabled={pending} className={`${primaryButtonClass} mt-1`}>
            {pending ? t("loginSheet.submitting") : t("login")}
          </button>
          {footerLink(t("loginSheet.noAccount"), t("signUp"), "register")}
        </form>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col md:flex-row">
          <SignUpHero />
          <div className="min-w-0 flex-1 overflow-y-auto px-4 pb-6 pt-4 sm:px-5 md:px-8 md:py-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <h2 className="mb-4 text-2xl font-medium text-[var(--text-on-light)]">{title}</h2>
            {step === 1 ? (
              <form onSubmit={continueRegisterStep1} className="flex flex-col gap-4">
                <Field id="reg-phone" label={t("fields.phone")} icon={<Smartphone className="h-5 w-5" aria-hidden />}>
                  <input
                    id="reg-phone"
                    type="tel"
                    value={phone}
                    onChange={(event) => setPhone(sanitizePhone(event.target.value))}
                    placeholder={t("fields.phonePlaceholder")}
                    inputMode="tel"
                    maxLength={PHONE_DIGIT_LENGTH}
                    className={fieldInputClass}
                    autoComplete="tel"
                  />
                </Field>
                <Field
                  id="reg-password"
                  label={t("fields.password")}
                  icon={<Lock className="h-5 w-5" aria-hidden />}
                  trailing={<PasswordToggle shown={showPassword} onToggle={() => setShowPassword((v) => !v)} label={toggleLabel(showPassword)} />}
                >
                  <input
                    id="reg-password"
                    type={showPassword ? "text" : "password"}
                    value={regPassword}
                    onChange={(event) => setRegPassword(sanitizePassword(event.target.value))}
                    placeholder={t("fields.passwordPlaceholder")}
                    maxLength={PASSWORD_MAX_LENGTH}
                    className={fieldInputClass}
                    autoComplete="new-password"
                  />
                </Field>
                <Field
                  id="reg-confirm"
                  label={t("fields.confirmPassword")}
                  icon={<Lock className="h-5 w-5" aria-hidden />}
                  trailing={<PasswordToggle shown={showConfirm} onToggle={() => setShowConfirm((v) => !v)} label={toggleLabel(showConfirm)} />}
                >
                  <input
                    id="reg-confirm"
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(sanitizePassword(event.target.value))}
                    placeholder={t("fields.confirmPasswordPlaceholder")}
                    maxLength={PASSWORD_MAX_LENGTH}
                    className={fieldInputClass}
                    autoComplete="new-password"
                  />
                </Field>
                <button type="submit" className={`${primaryButtonClass} mt-1`}>
                  {tCommon("next")}
                </button>
                {footerLink(t("signUpSheet.haveAccount"), t("login"), "login")}
              </form>
            ) : (
              <ResourceGate
                resource={signUpOptions}
                loadingLabel={t("signUpSheet.loadingBanks")}
                errorTitle={t("signUpSheet.banksFailed")}
              >
                {({ banks, channels }) => (
                  <form onSubmit={submitRegister} className="flex flex-col gap-4">
                    <Field id="reg-first" label={t("fields.firstName")}>
                      <input
                        id="reg-first"
                        value={firstName}
                        onChange={(event) => setFirstName(sanitizePersonName(event.target.value))}
                        placeholder={t("fields.firstName")}
                        maxLength={PERSON_NAME_MAX_LENGTH}
                        className={fieldInputClass}
                        autoComplete="given-name"
                      />
                    </Field>
                    <Field id="reg-last" label={t("fields.lastName")}>
                      <input
                        id="reg-last"
                        value={lastName}
                        onChange={(event) => setLastName(sanitizePersonName(event.target.value))}
                        placeholder={t("fields.lastName")}
                        maxLength={PERSON_NAME_MAX_LENGTH}
                        className={fieldInputClass}
                        autoComplete="family-name"
                      />
                    </Field>
                    <div className="space-y-1.5">
                      <span className={fieldLabelClass}>{t("fields.bank")}</span>
                      <SelectField
                        value={bankId}
                        onValueChange={setBankId}
                        ariaLabel={t("fields.bank")}
                        placeholder={t("fields.bankPlaceholder")}
                        options={banks.map((bank) => ({ value: bank.id, label: bank.label }))}
                        className="h-11"
                      />
                    </div>
                    <Field id="reg-account" label={t("fields.bankAccount")}>
                      <input
                        id="reg-account"
                        value={accountNumber}
                        onChange={(event) => setAccountNumber(sanitizeBankAccount(event.target.value))}
                        placeholder={t("fields.bankAccountPlaceholder")}
                        inputMode="numeric"
                        maxLength={BANK_ACCOUNT_MAX_DIGITS}
                        className={fieldInputClass}
                        autoComplete="off"
                      />
                    </Field>
                    <div className="space-y-1.5">
                      <span className={fieldLabelClass}>{t("fields.channel")}</span>
                      <SelectField
                        value={channelId}
                        onValueChange={setChannelId}
                        ariaLabel={t("fields.channel")}
                        placeholder={t("fields.channelPlaceholder")}
                        options={channels.map((item) => ({ value: item.id, label: item.label }))}
                        className="h-11"
                      />
                    </div>
                    <div className="mt-1 flex gap-2">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="soft-btn-outline h-12 flex-1 rounded-full text-sm font-semibold"
                      >
                        {tCommon("back")}
                      </button>
                      <button type="submit" disabled={pending} className={`${primaryButtonClass} flex-1`}>
                        {pending ? t("signUpSheet.submitting") : t("signUp")}
                      </button>
                    </div>
                    {footerLink(t("signUpSheet.haveAccount"), t("login"), "login")}
                  </form>
                )}
              </ResourceGate>
            )}
          </div>
          <SignUpSideBanner />
        </div>
      )}
    </OverlayPanel>
  );
}
