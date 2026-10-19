"use client";

import { createContext } from "react";

/** true = มีเปลือกหน้า (header/sidebar/bottom nav) จาก layout ของกลุ่ม route อยู่แล้ว — SubPageShell ไม่ต้องห่อซ้ำ */
export const ShellProvidedContext = createContext(false);
