"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { MessageCircle, Palette } from "lucide-react";
import { usePathname } from "@/lib/i18n/navigation";
import { useT } from "@/lib/i18n/I18nProvider";
import { useToast } from "@/context/ToastContext";
import { useLazyOverlayMount } from "@/app/hooks/useLazyOverlayMount";

/** sheet เลือกธีมโหลดแยก chunk ตอนเปิดครั้งแรก */
const ThemePickerSheet = dynamic(() =>
  import("@/app/components/theme/ThemePickerSheet").then((m) => m.ThemePickerSheet),
);

/** หน้าที่ไม่ใส่ปุ่มลอย — เล่นเกมเต็มจอ และหน้าเลือกเลขหวยที่มี action bar ล่างสุดแทน bottom nav */
function isFloatingHidden(pathname: string): boolean {
  if (pathname.startsWith("/play")) return true;
  const seg = pathname.split("/").filter(Boolean);
  return seg[0] === "lottery" && seg.length === 3 && seg[1] !== "rules" && seg[1] !== "slips";
}

/**
 * ปุ่มลอยมุมล่างขวา (ธีมสี + live chat) — mount ครั้งเดียวใน AppProviders · แสดงทั้ง mobile และ desktop
 * mobile: เหนือ bottom nav · desktop: ชิดล่างขวา · live chat ยังไม่เชื่อมต่อ → toast
 * (ลำดับ logic เดียวกับ glass · สไตล์ปุ่มอยู่ใน styles/lotto-floating-actions.css)
 */
export function FloatingActions() {
  const pathname = usePathname();
  const t = useT("common");
  const { showToast } = useToast();
  const [themeOpen, setThemeOpen] = useState(false);
  const themeMounted = useLazyOverlayMount(themeOpen);

  return (
    <>
      {isFloatingHidden(pathname) ? null : (
        <div className="lotto-fab" role="group" aria-label={t("theme.floatingLabel")}>
          <button
            type="button"
            className="lotto-fab__btn"
            onClick={() => setThemeOpen(true)}
            aria-label={t("theme.fab")}
            title={t("theme.fab")}
          >
            <Palette className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="lotto-fab__btn lotto-fab__btn--chat"
            onClick={() => showToast(t("theme.chatUnavailable"), "info")}
            aria-label={t("theme.chat")}
            title={t("theme.chat")}
          >
            <MessageCircle className="h-6 w-6" aria-hidden="true" />
            <span className="lotto-fab__dot" aria-hidden="true" />
          </button>
        </div>
      )}
      {themeMounted ? <ThemePickerSheet isOpen={themeOpen} onClose={() => setThemeOpen(false)} /> : null}
    </>
  );
}
