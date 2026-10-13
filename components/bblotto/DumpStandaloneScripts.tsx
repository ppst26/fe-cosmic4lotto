"use client";

import Script from "next/script";
import { DUMP_STANDALONE_SCRIPTS } from "@/lib/bblotto/dump-assets";

/** JS จาก dump ที่ใช้ร่วมกับ React ได้ (ไม่ใช่ entry Nuxt ทั้งก้อน) */
export function DumpStandaloneScripts() {
  return (
    <>
      {DUMP_STANDALONE_SCRIPTS.map((s) => (
        <Script key={s.src} src={s.src} strategy={s.strategy} />
      ))}
    </>
  );
}
