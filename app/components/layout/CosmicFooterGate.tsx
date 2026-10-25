"use client";

import { usePathname } from "@/lib/i18n/navigation";
import { LazyMount } from "@/components/lotto/LazyMount";
import { CosmicFooter } from "./CosmicFooter";

/**
 * ซ่อน CosmicFooter บนหน้าเล่นเกม — ลด scroll (RootLayout)
 */
export function CosmicFooterGate() {
  const pathname = usePathname();
  if (pathname.startsWith("/play")) {
    return null;
  }
  /* ฟุตเตอร์อยู่ท้ายหน้า — hydrate เมื่อเลื่อนใกล้ถึง ลดงาน JS ตอนเปิดหน้า */
  return (
    <LazyMount minHeight={320}>
      <CosmicFooter />
    </LazyMount>
  );
}
