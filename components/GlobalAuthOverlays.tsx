"use client";

import dynamic from "next/dynamic";
import { useAuthUI } from "@/context/AuthUIContext";

/** โหลด sheet เข้าสู่ระบบ/สมัครเมื่อเปิดครั้งแรกเท่านั้น — ไม่รวมใน bundle แรกของทุกหน้า */
const AuthSheet = dynamic(() => import("@/components/auth/AuthSheet").then((m) => m.AuthSheet));

export function GlobalAuthOverlays() {
  const { mode, closeAuth, switchToLogin, switchToRegister } = useAuthUI();

  if (!mode) return null;

  return (
    <AuthSheet
      mode={mode}
      onClose={closeAuth}
      onSwitch={(next) => (next === "login" ? switchToLogin() : switchToRegister())}
    />
  );
}
