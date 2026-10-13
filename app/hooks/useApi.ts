"use client";

import { useEffect } from "react";
import useSWR, { unstable_serialize, useSWRConfig, preload, type SWRConfiguration } from "swr";
import type { ApiError, ApiResult } from "@/lib/api/http";
import { useAuth } from "@/app/components/auth/AuthProvider";
import { resolveApiStatus, type ResourceStatus } from "./apiStatus";

export type { ResourceStatus };

export interface ApiResource<T> {
  /** ข้อมูลล่าสุด · ระหว่างดึงใหม่ยังคงค่าเดิม (ไม่กระพริบ) */
  data: T | null;
  /** idle = ไม่ได้ขอ (resource ที่ต้อง login แต่ยังไม่ login) · loading = ยังไม่มีข้อมูลรอบแรก */
  status: ResourceStatus;
  error: ApiError | null;
  /** กำลังดึงใหม่ขณะมีข้อมูลเดิมแสดงอยู่ */
  isRefreshing: boolean;
  /** ดึงใหม่ — เรียกหลัง mutation หรือปุ่มลองใหม่ */
  refresh: () => void;
  /** แทนค่าใน cache ทันทีจากผล mutation (ทุก component ที่ใช้ key เดียวกันอัปเดตพร้อมกัน) */
  setData: (data: T) => void;
}

/** @deprecated ชื่อเดิม — ใช้ ApiResource */
export type ScopedResource<T> = ApiResource<T>;

export interface UseApiOptions {
  /** true = ต้อง login · ยังไม่ login จะไม่ยิงและ status = idle · cache แยกตาม user id */
  auth?: boolean;
  /** ส่งต่อให้ SWR (เช่น refreshInterval สำหรับข้อมูลสด) */
  swr?: SWRConfiguration;
}

/** แปลง ApiResult → ค่า/throw ให้ SWR (ApiError ถูก throw เป็น error ของ SWR) */
async function unwrap<T>(load: () => Promise<ApiResult<T>>): Promise<T> {
  const res = await load();
  if (!res.ok) throw res.error;
  return res.data;
}

/**
 * ดึงข้อมูลผ่านฟังก์ชันใน lib/api ด้วย SWR — dedupe / cache ข้าม component ตาม key
 * ใช้ผ่าน hook รายโดเมนใน app/hooks/api/* · ห้ามเรียก fetch*() ตรงจาก component
 *
 * @param key ชื่อ resource (+ พารามิเตอร์) เช่น ["vip-player"] · null = ยังไม่ขอ
 */
export function useApi<T>(
  key: readonly unknown[] | null,
  load: () => Promise<ApiResult<T>>,
  options: UseApiOptions = {},
): ApiResource<T> {
  const { user, isLoading: authLoading } = useAuth();
  const userScope = options.auth ? (user?.id ?? null) : "public";
  const swrKey = key && userScope && !(options.auth && authLoading) ? [...key, userScope] : null;

  const { data, error, isValidating, mutate } = useSWR<T, ApiError>(
    swrKey,
    () => unwrap(load),
    options.swr,
  );

  const hasData = data !== undefined;
  /** ยังเช็ก session ไม่เสร็จ = กำลังโหลด (ไม่ใช่ idle) — กันการ์ดชวน login กระพริบตอนเปิดหน้า */
  const waitingForAuth = Boolean(options.auth) && authLoading;
  return {
    data: hasData ? data : null,
    status: waitingForAuth ? "loading" : resolveApiStatus({
      hasKey: swrKey !== null,
      hasData,
      hasError: Boolean(error),
      isValidating,
    }),
    error: error ?? null,
    isRefreshing: hasData && isValidating,
    refresh: () => {
      void mutate();
    },
    setData: (next: T) => {
      void mutate(next, { revalidate: false });
    },
  };
}

/** resource ที่โหลดล่วงหน้า — key/load/auth ต้องตรงกับ hook ที่ใช้จริง (นิยามร่วมกันเป็นค่าคงที่) */
export interface PrefetchTarget {
  key: readonly unknown[];
  load: () => Promise<ApiResult<unknown>>;
  auth?: boolean;
}

/**
 * อุ่น cache ของข้อมูลแท็บอื่นล่วงหน้า — เปิดหน้าแล้วแท็บข้างเคียงโหลดเบื้องหลังตอนว่าง
 * ผู้ใช้กดสลับแท็บแล้วเห็นข้อมูลทันที ไม่ต้องรอโหลดครั้งแรก · ข้ามตัวที่มีข้อมูลใน cache แล้ว
 * targets ต้องเป็นค่าคงที่ (นอก component) หรือ useMemo เพื่อไม่ให้ effect รันซ้ำ
 */
export function usePrefetchApi(targets: readonly PrefetchTarget[], enabled = true): void {
  const { user, isLoading: authLoading } = useAuth();
  const { cache } = useSWRConfig();
  const userId = user?.id ?? null;

  useEffect(() => {
    if (!enabled || authLoading) return;

    const run = () => {
      for (const target of targets) {
        const scope = target.auth ? userId : "public";
        if (!scope) continue;
        const swrKey = [...target.key, scope];
        if (cache.get(unstable_serialize(swrKey))?.data !== undefined) continue;
        preload(swrKey, () => unwrap(target.load)).catch(() => {
          /* พลาดตอนอุ่น — ตอนเปิดแท็บ useApi จะโหลดและแสดง error เอง */
        });
      }
    };

    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(run, { timeout: 1500 });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(run, 300);
    return () => window.clearTimeout(id);
  }, [targets, enabled, authLoading, userId, cache]);
}
