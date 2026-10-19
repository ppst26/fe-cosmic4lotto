"use client";

import { SubPageShell } from "@/components/layout/SubPageShell";
import { ReferralPageContent } from "@/app/components/referral/ReferralPageContent";
import { useAuth } from "@/app/components/auth/AuthProvider";
import { useProfile } from "@/app/hooks/api/account";
import { useT } from "@/lib/i18n/I18nProvider";

/** หน้าแนะนำเพื่อน (/referral) */
export default function ReferralPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const t = useT("referral");
  const { data: profile } = useProfile();
  /** รหัสชวนเพื่อน = memberId ของผู้ใช้ที่ login · ไม่มีให้ ReferralPageContent ใช้ refCode จาก overview */
  const refCode = isAuthenticated ? profile?.memberId : undefined;

  if (isLoading) {
    return null;
  }

  return (
    <SubPageShell title={t("pageTitle")}>
      <ReferralPageContent refCode={refCode} />
    </SubPageShell>
  );
}
