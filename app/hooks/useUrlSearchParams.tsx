"use client";

import React, { Suspense, createContext, useContext, useLayoutEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const EMPTY_PARAMS = new URLSearchParams();

const UrlSearchParamsContext = createContext<URLSearchParams>(EMPTY_PARAMS);

/** อ่าน useSearchParams ใน Suspense ของตัวเอง — bailout เฉพาะตัวนี้ ไม่ลาก SSR ทั้งหน้าไปด้วย */
function SearchParamsReader({ onChange }: { onChange: (params: URLSearchParams) => void }) {
  const searchParams = useSearchParams();
  useLayoutEffect(() => {
    onChange(new URLSearchParams(searchParams.toString()));
  }, [searchParams, onChange]);
  return null;
}

/**
 * แชร์ query string ให้ provider/overlay — ตอน prerender ได้ params ว่าง แล้วซิงก์ค่าจริงหลัง hydrate
 * ใช้แทน useSearchParams ใน component ระดับ layout เพื่อให้ HTML ฝั่ง server มีเนื้อหาครบ
 */
export function UrlSearchParamsProvider({ children }: { children: React.ReactNode }) {
  const [params, setParams] = useState<URLSearchParams>(EMPTY_PARAMS);
  return (
    <UrlSearchParamsContext.Provider value={params}>
      <Suspense fallback={null}>
        <SearchParamsReader onChange={setParams} />
      </Suspense>
      {children}
    </UrlSearchParamsContext.Provider>
  );
}

export function useUrlSearchParams(): URLSearchParams {
  return useContext(UrlSearchParamsContext);
}
