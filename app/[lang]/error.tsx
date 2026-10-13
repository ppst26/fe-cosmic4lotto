"use client";

import { useEffect } from "react";
import { StatusPageShell, StatusState } from "@/app/components/ui/StatusState";

/**
 * Error boundary ระดับ route — หน้าใดก็ตามที่ render พัง (ไม่รวม root layout → ดู global-error.tsx)
 * retry() = ดึงข้อมูลใหม่แล้ว render ส่วนนั้นซ้ำ (Next 16)
 */
export default function RouteError({
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
    <StatusPageShell>
      <StatusState
        title="เกิดข้อผิดพลาด"
        description="ขออภัย หน้านี้โหลดไม่สำเร็จ ลองใหม่อีกครั้ง"
        primaryAction={{ label: "ลองใหม่", onClick: retry }}
        secondaryAction={{ label: "กลับหน้าแรก", href: "/" }}
        code={error.digest}
      />
    </StatusPageShell>
  );
}
