"use client";

import { useEffect } from "react";
import { StatusState } from "@/app/components/ui/StatusState";
import "./globals.css";

/**
 * Error boundary สุดท้าย — root layout พัง (เช่น provider throw) แทนที่ทั้งเอกสาร
 * ไม่มี layout / font ของแอป จึงต้องมี <html> <body> และ CSS เอง
 */
export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    // TODO(monitoring): ส่งไป error reporting service เมื่อเลือกเครื่องมือแล้ว
    console.error(error);
  }, [error]);

  return (
    <html lang="th" className="dark h-full antialiased">
      <body className="flex min-h-dvh items-center justify-center app-bg px-4">
        <title>เกิดข้อผิดพลาด — XGAMBET</title>
        <StatusState
          title="ระบบขัดข้องชั่วคราว"
          description="ขออภัย เว็บไซต์โหลดไม่สำเร็จ ลองใหม่อีกครั้งในอีกสักครู่"
          primaryAction={{ label: "ลองใหม่", onClick: retry }}
          code={error.digest}
        />
      </body>
    </html>
  );
}
