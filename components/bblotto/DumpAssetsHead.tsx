import {
  DUMP_HOME_STYLE_HREFS,
  DUMP_NUXT_MODULE_PRELOADS,
} from "@/lib/bblotto/dump-assets";

/** โหลด CSS/ preload JS จาก dump (ไม่ mount Nuxt — ใช้คู่ React reverse UI) */
export function DumpAssetsHead() {
  return (
    <>
      {DUMP_HOME_STYLE_HREFS.map((href) => (
        <link key={href} rel="stylesheet" href={href} crossOrigin="" />
      ))}
      {DUMP_NUXT_MODULE_PRELOADS.map((href) => (
        <link key={href} rel="modulepreload" href={href} crossOrigin="" />
      ))}
    </>
  );
}
