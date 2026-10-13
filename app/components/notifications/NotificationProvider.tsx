"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useLazyOverlayMount } from "@/app/hooks/useLazyOverlayMount";

/** sheet แจ้งเตือนมือถือโหลดแยก chunk ตอนเปิดครั้งแรก — ไม่ติดไป bundle แรกของทุกหน้า */
const NotificationMobileSheet = dynamic(() =>
  import("./NotificationMobileSheet").then((m) => m.NotificationMobileSheet),
);

interface NotificationContextValue {
  openNotifications: () => void;
  closeNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

/**
 * เปิด sheet แจ้งเตือนมือถือ — desktop ใช้ NotificationDesktopPopover ใน Header
 */
export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const openNotifications = useCallback(() => setMobileOpen(true), []);
  const closeNotifications = useCallback(() => setMobileOpen(false), []);

  const value = useMemo(
    () => ({ openNotifications, closeNotifications }),
    [openNotifications, closeNotifications],
  );

  const sheetMounted = useLazyOverlayMount(mobileOpen);

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {sheetMounted ? (
        <NotificationMobileSheet isOpen={mobileOpen} onClose={closeNotifications} />
      ) : null}
    </NotificationContext.Provider>
  );
}

export function useNotifications(): NotificationContextValue {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error("useNotifications ต้องใช้ภายใน NotificationProvider");
  }
  return ctx;
}
