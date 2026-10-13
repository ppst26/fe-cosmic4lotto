"use client";

import { useEffect } from "react";
import { SubPageShell } from "@/components/layout/SubPageShell";
import { ProfileAccountPageContent } from "@/app/components/profile/ProfileAccountPageContent";
import { useAuth } from "@/app/components/auth/AuthProvider";
import { useRouter } from "@/lib/i18n/navigation";
import { useT } from "@/lib/i18n/I18nProvider";

/** หน้าข้อมูลบัญชี (/profile/account) — protected โดย proxy (lib/auth/protectedPaths.ts) และ redirect "/" เมื่อยังไม่ login เหมือน glass */
export default function ProfileAccountPage() {
  const router = useRouter();
  const t = useT("profile");
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return null;
  }

  return (
    <SubPageShell title={t("account.title")}>
      <ProfileAccountPageContent />
    </SubPageShell>
  );
}
