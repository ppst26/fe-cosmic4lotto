"use client";

import { LottoShellHeader } from "./LottoShellChrome";

/** header สำหรับหน้าที่ไม่ใช้ SubPageShell (เช่น หน้าเล่นเกม) — คือ header เดิมของหน้าแรก */
export function HeaderBar(_props: { onOpenLogin?: () => void; onOpenRegister?: () => void } = {}) {
  void _props;
  return <LottoShellHeader />;
}
