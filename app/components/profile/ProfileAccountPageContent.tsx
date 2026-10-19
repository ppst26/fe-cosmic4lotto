"use client";

import { useState } from "react";
import { Copy, LogOut } from "lucide-react";
import Link, { useRouter } from "@/lib/i18n/navigation";
import { useAuth } from "@/app/components/auth/AuthProvider";
import { useProfile } from "@/app/hooks/api/account";
import { useReferralOverview, useVipPlayer } from "@/app/hooks/api/member";
import { useUrlTab } from "@/app/hooks/useUrlTab";
import { ResourceGate } from "@/app/components/ui/ResourceGate";
import { SoftDialog } from "@/app/components/ui/SoftDialog";
import { getVipRankTier } from "@/app/data/vipMockData";
import { buildReferralLink } from "@/lib/domain/referral";
import type { ProfileUser } from "@/app/types/auth";
import { useToast } from "@/context/ToastContext";
import { useT } from "@/lib/i18n/I18nProvider";
import { ProfileAvatarPicker } from "./ProfileAvatarPicker";
import { UserAvatar } from "./UserAvatar";

type ProfileAccountTab = "personal" | "bank";

const TABS: { id: ProfileAccountTab; labelKey: "account.tabs.personal" | "account.tabs.bank" }[] = [
  { id: "personal", labelKey: "account.tabs.personal" },
  { id: "bank", labelKey: "account.tabs.bank" },
];

const parseTab = (value: string | null): ProfileAccountTab => (value === "bank" ? "bank" : "personal");

/**
 * เนื้อหาข้อมูลบัญชี — ใช้ใน /profile/account และ hub modal
 * embedded: แท็บเป็น local state (ไม่เขียน ?tab=) · dialog portal ไป body ที่ z-[100] เสมอ
 */
export function ProfileAccountPageContent({ embedded = false }: { embedded?: boolean }) {
  const t = useT("profile");
  const profile = useProfile();
  return (
    <ResourceGate
      resource={profile}
      loadingLabel={t("account.loading")}
      errorTitle={t("account.loadErrorTitle")}
    >
      {(data) => <ProfileAccountView profile={data} onProfileUpdated={profile.setData} embedded={embedded} />}
    </ResourceGate>
  );
}

function ProfileAccountView({
  profile,
  onProfileUpdated,
  embedded,
}: {
  profile: ProfileUser;
  onProfileUpdated: (profile: ProfileUser) => void;
  embedded: boolean;
}) {
  const t = useT("profile");
  const { showToast } = useToast();
  const [urlTab, setUrlTab] = useUrlTab<ProfileAccountTab>("tab", parseTab, "personal");
  const [localTab, setLocalTab] = useState<ProfileAccountTab>("personal");
  const activeTab = embedded ? localTab : urlTab;
  const selectTab = embedded ? setLocalTab : setUrlTab;
  const [pickerOpen, setPickerOpen] = useState(false);

  const vipPlayer = useVipPlayer();
  /** ระดับ VIP — "—" ระหว่างโหลด */
  const vipRankLabel = vipPlayer.data ? getVipRankTier(vipPlayer.data.currentRankId).label : "—";

  const copy = async (text: string, okMessage: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast(okMessage, "success", 2500);
    } catch {
      showToast(t("account.copyFailed"), "error");
    }
  };

  return (
    <div className="space-y-3">
      <section className="soft-panel flex flex-col items-center gap-2 p-4">
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
          aria-label={t("avatar.change")}
        >
          <UserAvatar profile={profile} size="xl" />
        </button>
        <p className="text-xs text-[var(--text-muted)]">{t("avatar.tapToChange")}</p>
        <p className="text-lg font-semibold text-[var(--text-on-light)]">{profile.displayName}</p>
        <p className="text-sm text-[var(--text-muted)]">{profile.phoneMasked}</p>
      </section>

      <div className="grid grid-cols-2 gap-2" role="tablist" aria-label={t("account.title")}>
        {TABS.map(({ id, labelKey }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={activeTab === id}
            onClick={() => selectTab(id)}
            className={`h-10 rounded-[var(--radius-soft-sm)] text-xs font-semibold sm:text-sm ${
              activeTab === id ? "soft-btn-primary" : "border border-white/10 bg-[var(--soft-card)] text-[var(--text-on-light)]"
            }`}
          >
            {t(labelKey)}
          </button>
        ))}
      </div>

      {activeTab === "personal" ? (
        <div role="tabpanel" className="space-y-2">
          <FieldRow
            label={t("account.gameUser")}
            value={profile.memberId}
            action={
              <button
                type="button"
                onClick={() => void copy(profile.memberId, t("account.gameUserCopied"))}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[var(--brand-strong)]"
                aria-label={t("account.copyGameUser")}
              >
                <Copy className="h-4 w-4" />
              </button>
            }
          />
          <Link href="/vip" className="block">
            <FieldRow label="VIP" value={vipRankLabel} accent action={<span aria-hidden="true">›</span>} />
          </Link>
          <ReferralInviteCard onCopy={copy} />
        </div>
      ) : (
        <div role="tabpanel" className="space-y-2">
          <BankAccountCard profile={profile} />
        </div>
      )}

      <LogoutButton />

      <ProfileAvatarPicker
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        currentPresetId={profile.avatarPresetId}
        onSaved={onProfileUpdated}
      />
    </div>
  );
}

function FieldRow({
  label,
  value,
  accent = false,
  action,
}: {
  label: string;
  value: string;
  accent?: boolean;
  action?: React.ReactNode;
}) {
  return (
    <div className="soft-card flex items-center gap-2 px-3 py-3 sm:px-3.5">
      <span className="w-[5.5rem] shrink-0 text-xs text-[var(--text-muted)] sm:w-24 sm:text-[13px]">{label}</span>
      <span
        className={`min-w-0 flex-1 truncate text-end text-sm font-semibold tabular-nums ${
          accent ? "text-[var(--brand-strong)]" : "text-[var(--text-on-light)]"
        }`}
      >
        {value}
      </span>
      <div className="flex w-9 shrink-0 justify-end text-[var(--text-muted)]">{action}</div>
    </div>
  );
}

/** ชวนเพื่อน — ลิงก์คัดลอก (รหัสจาก useReferralOverview) */
function ReferralInviteCard({ onCopy }: { onCopy: (text: string, okMessage: string) => Promise<void> }) {
  const t = useT("profile");
  const overview = useReferralOverview();
  /** ลิงก์พร้อมเมื่อโหลดรหัสแนะนำแล้ว · ระหว่างโหลดแสดง "—" */
  const referralLink = overview.data ? buildReferralLink(overview.data.refCode) : null;

  return (
    <section className="space-y-2 pt-3">
      <div className="text-center">
        <h2 className="text-sm font-semibold text-[var(--text-on-light)] sm:text-base">{t("referralInvite.title")}</h2>
        <p className="mt-1 text-xs text-[var(--text-muted)] sm:text-sm">{t("referralInvite.description")}</p>
      </div>
      <FieldRow
        label={t("referralInvite.linkLabel")}
        value={referralLink ?? "—"}
        action={
          referralLink ? (
            <button
              type="button"
              onClick={() => void onCopy(referralLink, t("referralInvite.linkCopied"))}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[var(--brand-strong)]"
              aria-label={t("referralInvite.copyLink")}
            >
              <Copy className="h-4 w-4" />
            </button>
          ) : null
        }
      />
    </section>
  );
}

/** จัดรูปเลขบัญชีสำหรับแสดงบนหน้าโปรไฟล์ */
function formatBankAccountForDisplay(accountNumber: string): string {
  const digits = accountNumber.replace(/\D/g, "");
  if (digits.length === 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 4)}-${digits.slice(4, 9)}-${digits.slice(9)}`;
  }
  return digits || accountNumber;
}

/** การ์ดบัญชีธนาคาร (อ่านอย่างเดียว) จาก ProfileUser */
function BankAccountCard({ profile }: { profile: ProfileUser }) {
  return (
    <article className="soft-card flex items-start gap-3 px-3 py-3 sm:px-3.5">
      <span
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--brand-soft)] text-xs font-semibold uppercase text-[var(--brand-strong)]"
        aria-hidden="true"
      >
        {profile.bankLabel.slice(0, 3)}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold leading-snug text-[var(--text-on-light)]">{profile.bankLabel}</p>
        <p className="mt-1.5 text-base font-semibold tracking-tight tabular-nums">
          {formatBankAccountForDisplay(profile.bankAccountNumber)}
        </p>
        <p className="mt-1 truncate text-xs text-[var(--text-muted)]">{profile.displayName}</p>
      </div>
    </article>
  );
}

/** ปุ่มออกจากระบบ + ยืนยัน (auth.logoutConfirm) */
function LogoutButton() {
  const t = useT("profile");
  const tAuth = useT("auth");
  const router = useRouter();
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await logout();
      router.replace("/");
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="soft-btn-outline flex h-11 w-full items-center justify-center gap-2 text-sm font-semibold"
      >
        <LogOut className="h-4 w-4" />
        {t("logout")}
      </button>

      <SoftDialog
        open={open}
        onClose={() => setOpen(false)}
        title={tAuth("logoutConfirm.title")}
        locked={loading}
        closeLabel={t("avatar.close")}
      >
        <h3 className="pr-10 text-lg font-semibold text-[var(--text-on-light)]">{tAuth("logoutConfirm.title")}</h3>
        <p className="mt-1 text-sm text-[var(--text-muted)]">{tAuth("logoutConfirm.description")}</p>
        <div className="mt-5 flex items-center gap-2.5">
          <button
            type="button"
            disabled={loading}
            onClick={() => setOpen(false)}
            className="h-11 flex-1 cursor-pointer rounded-lg border border-white/10 bg-[var(--soft-surface)] text-sm font-semibold text-[var(--text-on-light)] disabled:opacity-50"
          >
            {tAuth("logoutConfirm.stay")}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => void handleConfirm()}
            className="soft-btn-primary h-11 flex-1 cursor-pointer text-sm font-semibold disabled:opacity-60"
          >
            {t("logout")}
          </button>
        </div>
      </SoftDialog>
    </>
  );
}
