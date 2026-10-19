"use client";

import { useCallback, useState } from "react";
import { LogOut } from "lucide-react";
import { useAuth } from "@/app/components/auth/AuthProvider";
import { OverlayPanel } from "@/app/components/ui/OverlayPanel";
import { useT } from "@/lib/i18n/I18nProvider";
import { LOTTO_SHEET_SURFACE } from "@/app/components/menu/lottoSurface";

/**
 * เปิด confirm ก่อน logout — ใช้ใน header / เมนู / โปรไฟล์ (API เดียวกับ glass)
 */
export function useLogoutConfirm(onSuccess?: () => void) {
  const { logout } = useAuth();
  const t = useT("auth");
  const tCommon = useT("common");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const openLogoutConfirm = useCallback(() => setOpen(true), []);

  const handleConfirm = useCallback(async () => {
    setLoading(true);
    try {
      await logout();
      onSuccess?.();
      setOpen(false);
    } finally {
      setLoading(false);
    }
  }, [logout, onSuccess]);

  const LogoutConfirmDialog = useCallback(
    () => (
      <OverlayPanel
        open={open}
        onClose={() => setOpen(false)}
        role="alertdialog"
        zClassName="z-[130]"
        hideHeader
        dismissible={!loading}
        maxWidthClassName="md:max-w-[360px]"
        className={`${LOTTO_SHEET_SURFACE} p-5 text-center`}
      >
        <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ef4a52]/15 text-[#ef4a52]">
          <LogOut className="h-6 w-6" aria-hidden />
        </div>
        <h3 className="text-lg font-semibold text-[var(--text-on-light)]">{t("logoutConfirm.title")}</h3>
        <p className="mt-1 text-sm text-[var(--text-muted)]">{t("logoutConfirm.description")}</p>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={loading}
            onClick={() => setOpen(false)}
            className="soft-btn-outline h-11 cursor-pointer text-sm font-semibold disabled:opacity-50"
          >
            {t("logoutConfirm.stay")}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => void handleConfirm()}
            className="h-11 cursor-pointer rounded-full border-0 bg-gradient-to-b from-[#ef4a52] to-[#d93642] text-sm font-semibold text-white disabled:opacity-60"
          >
            {loading ? tCommon("processing") : t("logout")}
          </button>
        </div>
      </OverlayPanel>
    ),
    [open, loading, handleConfirm, t, tCommon],
  );

  return { openLogoutConfirm, LogoutConfirmDialog };
}
