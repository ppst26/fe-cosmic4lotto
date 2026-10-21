import type { ReactNode } from "react";
import { LobbyTabsShell } from "@/components/lotto/LobbyTabsShell";

/**
 * Layout ของแท็บหมวดเกม — เปลือก (header / แบนเนอร์ / ฝาก-ถอน / เมนูหมวด / bottom nav) อยู่ที่นี่ที่เดียว
 * แถบผลหวยขวา (desktop) มาจากเปลือกค่าเริ่มต้นใน root layout
 */
export default function LobbyTabsLayout({ children }: { children: ReactNode }) {
  return <LobbyTabsShell>{children}</LobbyTabsShell>;
}
