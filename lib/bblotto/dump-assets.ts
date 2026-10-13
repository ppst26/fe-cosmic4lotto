/**
 * ตำแหน่ง static จาก mirror dump → ใช้ใน Next ผ่าน `npm run link-dump`
 *
 * ต้นทาง (source of truth):
 *   dump/bblotto.iltx.cc/
 *     _nuxt/css/*.css     — สไตล์รวม + แต่ละ Vue chunk
 *     _nuxt/*.js          — Nuxt entry + lazy chunks
 *     assets/js/          — theme-svg.js
 *     locales/*.yml
 *
 * หลัง link แล้วใน dev/build เรียกผ่าน URL:
 *   /_nuxt/css/entry.CzK-PLgR.css
 *   /_nuxt/entry.D9y5y_CT.js
 *   /assets/js/theme-svg.js
 */

/** CSS หลักจาก index.html */
export const DUMP_CORE_STYLES = [
  "/_nuxt/css/entry.CzK-PLgR.css",
  "/_nuxt/css/swiper-vue.BgHRhF7y.css",
  "/_nuxt/css/default.CkhMGEuA.css",
  "/_nuxt/css/Wrapper.Bm2o2Twg.css",
  "/_nuxt/css/askmebet.LTQ3Y3-X.css",
] as const;

/** CSS หน้าแรก / lobby (class จาก dump home) */
export const DUMP_HOME_STYLES = [
  "/_nuxt/css/ThaiLotto.Djyvu_QF.css",
  "/_nuxt/css/BankLotto.DTNwxSMv.css",
  "/_nuxt/css/LottoCard.BiItQEnM.css",
  "/_nuxt/css/LottoDashboard.BzaukkKv.css",
  "/_nuxt/css/LottoShowcase.BawtV0jk.css",
  "/_nuxt/css/CasinoShowcase.BbTqbymR.css",
  "/_nuxt/css/SlotShowcase.D-UwwPF3.css",
  "/_nuxt/css/GameCard.DZ_2vQrZ.css",
  "/_nuxt/css/ContentSwiper.Czw91WMW.css",
  "/_nuxt/css/FooterLotto.Cg5GnUJ7.css",
] as const;

export const DUMP_HOME_STYLE_HREFS = [
  ...DUMP_CORE_STYLES,
  ...DUMP_HOME_STYLES,
] as const;

/** Preload สำหรับ Nuxt (ถ้า mount ทั้งแอป — ดู BblottoAppShell) */
export const DUMP_NUXT_MODULE_PRELOADS = [
  "/_nuxt/entry.D9y5y_CT.js",
  "/_nuxt/swiper-vue.74t8JrMP.js",
] as const;

export const DUMP_STANDALONE_SCRIPTS = [
  { src: "/assets/js/theme-svg.js", strategy: "beforeInteractive" as const },
] as const;

export const DUMP_NUXT_ENTRY = "/_nuxt/entry.D9y5y_CT.js";
