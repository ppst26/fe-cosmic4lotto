"use client";

import type { ReactNode } from "react";
import { SWRConfig, unstable_serialize } from "swr";

export type ApiSeedEntry = {
  /** key เดียวกับที่ hook ใช้ใน useApi เช่น ["vip-ranks"] */
  key: readonly unknown[];
  data: unknown;
};

/**
 * เติมข้อมูลที่เซิร์ฟเวอร์ดึงไว้เข้า cache ของ useApi (SWR fallback) — เฉพาะ resource สาธารณะ (scope "public")
 * hook เดิมได้ข้อมูลตั้งแต่ render แรก → HTML จากเซิร์ฟเวอร์มีเนื้อหาครบ ไม่ต้องรอ hydrate แล้วค่อยยิง fetch
 * วางใน layout (server) ของ route ที่ใช้ resource นั้น · ต้องส่ง key ให้ตรงกับ hook ใน app/hooks/api/*
 */
export function ApiSeed({ entries, children }: { entries: readonly ApiSeedEntry[]; children: ReactNode }) {
  const fallback = Object.fromEntries(
    entries.map((entry) => [unstable_serialize([...entry.key, "public"]), entry.data]),
  );
  return <SWRConfig value={{ fallback }}>{children}</SWRConfig>;
}
