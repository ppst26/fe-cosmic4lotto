"use client";

import { useState } from "react";
import { loginUser } from "@/lib/auth/client";
import { DEMO_LOGIN_PASSWORD, DEMO_LOGIN_PHONE } from "@/lib/auth/demoCredentials";
import { useToast } from "@/context/ToastContext";

/**
 * ปุ่มล็อกอินคลิกเดียวสำหรับ dev — ใช้บัญชีเดโมใน lib/auth/demoCredentials.ts (เปิดอัตโนมัติเมื่อไม่ใช่ production)
 * แสดงเฉพาะ NODE_ENV !== "production" · สำเร็จแล้วโหลดหน้าใหม่ให้ server component เห็น cookie
 */
export function DevQuickLogin({ className }: { className?: string }) {
  const { showToast } = useToast();
  const [busy, setBusy] = useState(false);

  if (process.env.NODE_ENV === "production") return null;

  const run = async () => {
    setBusy(true);
    const res = await loginUser({ phone: DEMO_LOGIN_PHONE, password: DEMO_LOGIN_PASSWORD });
    if (res.ok) {
      window.location.reload();
      return;
    }
    setBusy(false);
    showToast(`Dev login ไม่สำเร็จ: ${res.error ?? "unknown"}`, "error");
  };

  return (
    <button type="button" className={className} onClick={run} disabled={busy}>
      {busy ? "…" : "Dev Login"}
    </button>
  );
}
