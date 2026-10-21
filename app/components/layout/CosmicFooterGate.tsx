"use client";

import { usePathname } from "@/lib/i18n/navigation";
import { CosmicFooter } from "./CosmicFooter";

/**
 * ซ่อน CosmicFooter บนหน้าเล่นเกม — ลด scroll (RootLayout)
 */
export function CosmicFooterGate() {
  const pathname = usePathname();
  if (pathname.startsWith("/play")) {
    return null;
  }
  return <CosmicFooter />;
}
