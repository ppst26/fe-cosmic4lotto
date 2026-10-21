"use client";

import { createContext, useContext, type ReactNode } from "react";

const ShellRailContext = createContext<ReactNode>(null);

/** เก็บแถบผลหวยขวา (desktop) ที่ root layout สร้างไว้ — LottoShellFrame ดึงไปแสดงเป็นค่าเริ่มต้นของทุกหน้า */
export function ShellRailProvider({ rail, children }: { rail: ReactNode; children: ReactNode }) {
  return <ShellRailContext.Provider value={rail}>{children}</ShellRailContext.Provider>;
}

export function useShellRail(): ReactNode {
  return useContext(ShellRailContext);
}
