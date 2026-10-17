/**
 * ตัวสร้างธีม (glass) — รัน: node scripts/themes/gen-themes.js (จาก root โปรเจกต์ไหนก็ได้ ไม่ต้องติดตั้งอะไรเพิ่ม)
 * เขียนทับ 2 ไฟล์: app/styles/themes.css และ lib/themes.ts — ห้ามแก้สองไฟล์นั้นมือ ให้แก้ที่นี่แล้วรันใหม่
 * กฎ CSS ที่ใช้ร่วมทุกธีมอยู่ใน scripts/themes/themes-static.css (ถูกต่อท้าย themes.css อัตโนมัติ)
 * ธีมเริ่มต้น "cosmic" = token ใน :root ของ app/styles/tokens.css (ไม่มี block แยก)
 * ดูคู่มือ: docs/THEME-SWITCH-GUIDE.md
 */
const fs = require("fs");
const path = require("path");
process.chdir(path.resolve(__dirname, "../.."));

const DEFAULT_THEME = "cosmic";

// page/nav/card/card2/inner = พื้นผิวธีมมืด · ps/pe = ปุ่มหลักเริ่ม/จบ · accent = สีเน้น · colors/bg = การ์ดตัวอย่างใน modal
const DARK_SURF = { page: "#06070a", nav: "#0b0d11", card: "#17181b", card2: "#121316", inner: "#202020" };
const T = [
  { key: "thunder-x", name: "Thunder X", dark: true, colors: ["#202020", "#0b0d11", "#ffd600"], bg: "#0c0303", ...DARK_SURF, accent: "#ffd600" },
  { key: "dark-mix-berry", name: "Dark Mix Berry", dark: true, colors: ["#ff2d95", "#b5179e", "#ff7ac3"], bg: "#0f0f12", page: "#0b0b0e", nav: "#101015", card: "#17131a", card2: "#130f16", inner: "#1d1722", accent: "#ff7ac3" },
  { key: "tron", name: "Tron", dark: true, colors: ["#102993", "#050f3b", "#51b0ff"], bg: "#0c0303", page: "#030821", nav: "#040b30", card: "#081348", card2: "#061038", inner: "#0a1a62", accent: "#51b0ff" },
  { key: "sanim", name: "Sanim", dark: true, colors: ["#202020", "#0b0d11", "#df6709"], bg: "#0c0303", ...DARK_SURF, accent: "#df6709" },
  { key: "gatsby", name: "Gatsby", dark: true, colors: ["#101421", "#002830", "#fef1cf"], bg: "#000000", page: "#04060b", nav: "#0a0d18", card: "#101421", card2: "#0c101b", inner: "#0b2229", accent: "#fef1cf" },
  { key: "navy", name: "Navy", dark: true, colors: ["#090c0f", "#0c121f", "#f7edd2"], bg: "#05070a", page: "#06080b", nav: "#0a0e14", card: "#0f1520", card2: "#0b1019", inner: "#131c2b", accent: "#f7edd2" },
  { key: "wisdom", name: "Wisdom", dark: true, colors: ["#772639", "#400A1A", "#E6E6E6"], bg: "#0C0303", page: "#12040a", nav: "#2a0a14", card: "#300d1b", card2: "#260a15", inner: "#400a1a", accent: "#e6e6e6" },
  { key: "sunfire", name: "Sunfire", dark: false, colors: ["#d9202e", "#99121d", "#ffd864"], bg: "#e4e4e4", accent: "#d9202e" },
  { key: "blue-syrah", name: "Blue Syrah", dark: false, colors: ["#4ea8ff", "#0078ab", "#ffd864"], bg: "#e4e4e4", accent: "#0078ab" },
  { key: "good-witch", name: "Good Witch", dark: false, colors: ["#5ed076", "#10943e", "#ffd864"], bg: "#e4e4e4", accent: "#10943e" },
  { key: "mix-berry", name: "Mix Berry", dark: false, colors: ["#df5c90", "#741a61", "#ffd864"], bg: "#e4e4e4", accent: "#741a61" },
  { key: "mr-bond", name: "Mr Bond", dark: false, colors: ["#1f2735", "#0e131c", "#72a3f9"], bg: "#e4e4e4", accent: "#2f5fc4" },
];

// บทบาทสี: ga→gb ไล่สี header/footer/bottom nav/หัวแถวเกม · icon = ไอคอน+ขอบ · action(+at ตัวอักษร) = ปุ่มหลัก · active(+act) = แท็บ/ชิป active
const ROLES = {
  "thunder-x": { ga: "#202020", gb: "#0b0d11", icon: "#ffd600", action: "#ffd600", at: "#111111", active: "#ffd600", act: "#111111" },
  "dark-mix-berry": { ga: "#ff2d95", gb: "#b5179e", icon: "#ff7ac3", action: "#ff7ac3", at: "#2a0a1c", active: "#ff2d95", act: "#ffffff" },
  tron: { ga: "#102993", gb: "#050f3b", icon: "#51b0ff", action: "#51b0ff", at: "#04123a", active: "#102993", act: "#ffffff" },
  sanim: { ga: "#202020", gb: "#0b0d11", icon: "#df6709", action: "#df6709", at: "#ffffff", active: "#df6709", act: "#ffffff" },
  gatsby: { ga: "#101421", gb: "#002830", icon: "#fef1cf", action: "#fef1cf", at: "#1a1405", active: "#fef1cf", act: "#1a1405" },
  navy: { ga: "#090c0f", gb: "#0c121f", icon: "#f7edd2", action: "#f7edd2", at: "#090c0f", active: "#f7edd2", act: "#090c0f" },
  wisdom: { ga: "#772639", gb: "#400a1a", icon: "#e6e6e6", action: "#e6e6e6", at: "#2a0a14", active: "#772639", act: "#ffffff" },
  sunfire: { ga: "#d9202e", gb: "#99121d", icon: "#99121d", action: "#ffd864", at: "#3a2a00", active: "#d9202e", act: "#ffffff" },
  "blue-syrah": { ga: "#4ea8ff", gb: "#0078ab", icon: "#0078ab", action: "#ffd864", at: "#3a2a00", active: "#4ea8ff", act: "#08233d" },
  "good-witch": { ga: "#5ed076", gb: "#10943e", icon: "#10943e", action: "#ffd864", at: "#3a2a00", active: "#5ed076", act: "#0a2a14" },
  "mix-berry": { ga: "#df5c90", gb: "#741a61", icon: "#741a61", action: "#ffd864", at: "#3a2a00", active: "#df5c90", act: "#ffffff" },
  "mr-bond": { ga: "#1f2735", gb: "#0e131c", icon: "#0e131c", action: "#72a3f9", at: "#0b1530", active: "#1f2735", act: "#ffffff" },
};
for (const t of T) Object.assign(t, ROLES[t.key]);

const mix = (a, pa, b) => `color-mix(in srgb, ${a} ${pa}%, ${b})`;

/** token ที่ได้จากบทบาทสี — ใช้ทั้งธีมมืดและสว่าง (ชื่อ token = ของ glass: tokens.css) */
function common(t) {
  return `  --t-ga: ${t.ga};
  --t-gb: ${t.gb};
  --t-icon: ${t.icon};
  --t-action: ${t.action};
  --t-action-text: ${t.at};
  --t-active: ${t.active};
  --t-active-text: ${t.act};
  --t-accent: ${t.accent};
  --t-chrome-bg: linear-gradient(180deg, var(--t-ga) 0%, var(--t-gb) 100%);
  --header-desktop-chrome-start: var(--t-ga);
  --header-desktop-chrome-end: var(--t-gb);
  --header-desktop-chrome-bg: var(--t-gb);
  --header-desktop-chrome-gradient: var(--t-chrome-bg);
  --bottom-nav-bg: var(--t-gb);
  --bottom-nav-radial: radial-gradient(ellipse 92% 150% at 50% 100%, ${mix("var(--t-ga)", 55, "var(--t-gb)")} 0%, var(--t-gb) 70%);
  --nav-top-line: rgba(255, 255, 255, 0.14);
  --cosmic-chrome-border: rgba(255, 255, 255, 0.12);
  --lobby-announcement-mobile-lead-fill: var(--t-gb);
  --lobby-announcement-mobile-marquee-fill: var(--t-ga);
  --lobby-announcement-mobile-fade-edge: var(--t-ga);
  --lobby-section-title-band-start: ${mix("var(--t-ga)", 94, "transparent")};
  --lobby-section-title-band-mid: ${mix("var(--t-ga)", 70, "var(--t-gb)")};
  --lobby-section-title-band-fade: ${mix("var(--t-gb)", 38, "transparent")};
  --lobby-section-title-band-tail: ${mix("var(--t-gb)", 10, "transparent")};
  --menu-drawer-scrim: radial-gradient(ellipse 110% 56% at 50% -4%, ${mix("var(--t-ga)", 60, "var(--t-gb)")} 0%, transparent 74%), linear-gradient(180deg, var(--t-gb) 0%, ${mix("var(--t-gb)", 55, "black")} 100%);
  --menu-bottom: ${mix("var(--t-gb)", 60, "black")};
  --menu-border: ${mix("var(--t-action)", 80, "white")};
  --accent-primary: var(--t-accent);
  --accent-highlight: var(--focus-ring);
  --focus-ring: ${mix("var(--t-accent)", 70, "white")};
  --border-active: ${mix("var(--t-accent)", 55, "var(--border-subtle)")};
  --line-tab-neon-gradient: linear-gradient(90deg, var(--t-active) 0%, ${mix("var(--t-active)", 78, "white")} 100%);
  --line-tab-neon-glow: 0 0 8px ${mix("var(--t-active)", 70, "transparent")}, 0 0 16px ${mix("var(--t-active)", 38, "transparent")};
  --category-active-gradient: linear-gradient(110deg, var(--t-active), ${mix("var(--t-active)", 78, "black")});
  --action-solid: var(--t-action);
  --action-solid-hover: ${mix("var(--t-action)", 86, "white")};
  --action-gradient: linear-gradient(90deg, var(--t-action), ${mix("var(--t-action)", 78, "black")});
  --cta-primary-gradient: var(--action-gradient);
  --cta-primary-fg: var(--t-action-text);
  --btn-primary-gradient: var(--action-gradient);
  --btn-primary-fg: var(--t-action-text);
  --confirm-btn-gradient: linear-gradient(135deg, var(--t-action) 0%, ${mix("var(--t-action)", 78, "black")} 100%);
  --confirm-btn-fg: var(--t-action-text);
  --confirm-btn-shadow: 0 6px 18px ${mix("var(--t-action)", 35, "transparent")};
  --auth-register-gradient: linear-gradient(180deg, ${mix("var(--t-action)", 100, "white")} 0%, var(--t-action) 34%, ${mix("var(--t-action)", 78, "black")} 100%);
  --auth-register-border: ${mix("var(--t-action)", 80, "white")};
  --primary: var(--t-action);
  --primary-foreground: var(--t-action-text);
  --sidebar-primary: var(--t-action);
  --chart-1: var(--t-action);
  --chart-2: var(--t-accent);
  --value-accent: var(--t-accent);
  --toast-icon-info: var(--t-accent);
  --glass-fill: linear-gradient(135deg, rgb(255 255 255 / 0.1), ${mix("var(--t-accent)", 16, "transparent")});
  --glass-fill-subtle: linear-gradient(135deg, rgb(255 255 255 / 0.07), ${mix("var(--t-accent)", 10, "transparent")});
  --chip-accent-start: ${mix("var(--t-accent)", 28, "transparent")};
  --chip-accent-end: ${mix("var(--t-ga)", 18, "transparent")};
  --nebula-violet: ${mix("var(--t-accent)", 30, "transparent")};
  --nebula-blue: ${mix("var(--t-ga)", 28, "transparent")};
  --cosmic-nebula-bg-image: radial-gradient(ellipse 55% 38% at 42% 0%, ${mix("var(--t-accent)", 20, "transparent")}, transparent 75%), radial-gradient(ellipse 42% 32% at 75% 0%, ${mix("var(--t-ga)", 18, "transparent")}, transparent 78%), radial-gradient(ellipse 30% 32% at 29% 55%, ${mix("var(--t-gb)", 26, "transparent")}, transparent 78%), radial-gradient(ellipse 32% 34% at 65% 54%, ${mix("var(--t-accent)", 12, "transparent")}, transparent 80%);`;
}

function darkBlock(t) {
  return `[data-theme="${t.key}"] {
  color-scheme: dark;
  --cosmic-page-base: ${t.page};
  --surface-start: ${t.card};
  --surface-mid: ${t.card2};
  --surface-end: ${t.page};
  --surface-hover: ${mix(t.card2, 88, "white")};
  --surface-selected: ${mix(t.card2, 78, t.accent)};
  --surface-solid-outer: ${t.card2};
  --surface-solid-inner: ${t.inner};
  --sheet-row-fill: ${mix(t.inner, 94, "white")};
  --sheet-row-fill-hover: ${mix(t.inner, 88, "white")};
  --sheet-icon-well-fill: ${mix(t.inner, 90, "white")};
  --sheet-field-fill: ${mix(t.inner, 92, "white")};
  --sheet-field-fill-focus: ${mix(t.inner, 86, "white")};
  --sheet-field-addon-bg: ${mix(t.inner, 90, "black")};
  --cosmic-chrome-surface-bg: ${t.nav};
  --cosmic-dialog-shell-bg: linear-gradient(168deg, ${t.card} 0%, ${t.card2} 52%, ${t.page} 100%);
  --cosmic-mobile-sheet-bg: linear-gradient(168deg, ${mix(t.card, 92, "white")} 0%, ${t.card} 46%, ${t.card2} 100%);
  --cosmic-sheet-title-notch-bg: linear-gradient(180deg, ${mix(t.card, 90, "white")} 0%, ${t.card2} 100%);
  --cosmic-sheet-title-capsule-deep-bg: linear-gradient(to bottom, ${t.card}, ${t.page});
  --hub-lobby-shell-bg: ${t.card2};
  --hub-lobby-chrome: ${t.inner};
  --hub-dialog-card-bg: ${mix(t.card, 78, "transparent")};
  --vip-panel-bg: ${t.card};
  --border-subtle: ${mix(t.card, 82, "white")};
${common(t)}
}`;
}

const LIGHT_BASE = `  color-scheme: light;
  --cosmic-page-base: #ffffff;
  --cosmic-nebula-bg-image: none;
  --surface-start: #f4f4f6;
  --surface-mid: #ffffff;
  --surface-end: #e2e2e6;
  --surface-hover: #ebebf0;
  --surface-selected: #e3e3ea;
  --surface-solid-outer: #ffffff;
  --surface-solid-inner: #f0f0f3;
  --sheet-row-fill: #f0f0f3;
  --sheet-row-fill-hover: #e6e6ec;
  --sheet-icon-well-fill: #e4e4ea;
  --sheet-field-fill: #ececf1;
  --sheet-field-fill-focus: #e2e2e9;
  --sheet-field-addon-bg: #e0e0e7;
  --cosmic-chrome-surface-bg: #ffffff;
  --cosmic-dialog-shell-bg: #ffffff;
  --cosmic-mobile-sheet-bg: #ffffff;
  --cosmic-mobile-sheet-shadow: 0 -16px 40px rgb(20 24 33 / 0.18);
  --cosmic-mobile-sheet-handle: rgb(20 24 33 / 0.18);
  --cosmic-sheet-title-notch-bg: #f4f4f6;
  --cosmic-sheet-title-notch-highlight: none;
  --cosmic-sheet-title-capsule-deep-bg: #e9e9ee;
  --dialog-overlay-bg: rgb(20 24 33 / 0.55);
  --hub-lobby-shell-bg: #f4f4f6;
  --hub-lobby-chrome: #ffffff;
  --hub-dialog-card-bg: rgb(255 255 255 / 0.9);
  --glass-border: rgb(20 24 33 / 0.1);
  --glass-shadow: inset 0 1px 0 rgb(255 255 255 / 0.6), 0 12px 32px rgb(20 24 33 / 0.12);
  --vip-panel-bg: #ffffff;
  --vip-panel-border: rgb(20 24 33 / 0.1);
  --vip-progress-track-bg: #dcdce3;
  --toast-bg: #ffffff;
  --toast-border: rgb(20 24 33 / 0.1);
  --text-primary: #1b2230;
  --text-secondary: #4a5265;
  --text-muted: #6b7385;
  --icon-default: #4a5265;
  --icon-active: #1b2230;
  --border-subtle: #dcdce3;
  --line-tab-track: rgb(20 24 33 / 0.12);
  --value-reward-fg: #b7791f;
  --success: #15803d;
  --warning: #b45309;
  --destructive: #dc2626;
  --scrollbar-thumb: rgb(20 24 33 / 0.28);
  --color-white: #111827;
  --color-zinc-50: #09090b;
  --color-zinc-100: #18181b;
  --color-zinc-200: #27272a;
  --color-zinc-300: #3f3f47;
  --color-zinc-400: #52525c;
  --color-zinc-500: #71717b;
  --color-zinc-600: #9f9fa9;
  --color-zinc-700: #d4d4d8;
  --color-zinc-800: #e4e4e7;
  --color-zinc-900: #f4f4f5;
  --color-zinc-950: #fafafa;
  --color-emerald-300: #15803d;
  --color-emerald-400: #16a34a;
  --color-emerald-500: #15803d;
  --color-green-300: #15803d;
  --color-green-400: #16a34a;
  --color-green-500: #15803d;
  --color-rose-300: #b91c1c;
  --color-rose-400: #dc2626;
  --color-rose-500: #b91c1c;
  --color-red-300: #b91c1c;
  --color-red-400: #dc2626;
  --color-red-500: #b91c1c;
  --color-amber-300: #b45309;
  --color-amber-400: #d97706;
  --color-amber-500: #b45309;
  --color-yellow-300: #b45309;
  --color-yellow-400: #d97706;
  --color-yellow-500: #b45309;`;

/** ธีมสว่าง: พื้นผิวย่อย/ช่อง/ตาราง/pagination เอียงเข้าหาสีธีม (แทนเทากลาง) */
function lightTint(t) {
  const tint = (p) => mix("var(--t-ga)", p, "#ffffff");
  return `  --sheet-row-fill: ${tint(18)};
  --sheet-row-fill-hover: ${tint(25)};
  --inner-card-fill: ${tint(18)};
  --inner-card-fill-hover: ${tint(25)};
  --sheet-field-fill: ${tint(12)};
  --sheet-field-fill-focus: ${tint(18)};
  --sheet-soft-fill: ${tint(18)};
  --sheet-soft-fill-hover: ${tint(25)};
  --surface-solid-inner: ${tint(14)};
  --surface-hover: ${tint(12)};
  --surface-selected: ${tint(18)};
  --border-subtle: ${mix("var(--t-ga)", 16, "#d6d6de")};
  --glass-fill-subtle: ${tint(8)};
  --cosmic-nested-surface: ${tint(14)};
  --cosmic-formula-cell-bg: ${tint(14)};
  --value-reward-fg: var(--t-gb);
  --value-reward: var(--t-gb);
  --value-accent: var(--t-gb);
  --vip-benefit-value: var(--t-gb);
  --text-gold: var(--t-gb);
  --cosmic-pagination-track-bg: ${tint(6)};
  --cosmic-pagination-bg: #ffffff;
  --cosmic-pagination-bg-hover: ${tint(14)};
  --cosmic-pagination-border: ${mix("var(--t-ga)", 25, "#d6d6de")};
  --cosmic-pagination-active-bg: var(--t-gb);
  --cosmic-pagination-active-fg: #ffffff;
  --cosmic-nebula-bg-image: none;
  --btn-primary-gradient: linear-gradient(90deg, var(--t-ga), var(--t-gb));
  --btn-primary-fg: #ffffff;
  --cta-primary-gradient: var(--btn-primary-gradient);
  --cta-primary-fg: #ffffff;
  --confirm-btn-gradient: var(--btn-primary-gradient);
  --confirm-btn-fg: #ffffff;
  --auth-register-gradient: var(--btn-primary-gradient);
  --auth-register-border: transparent;`;
}

function lightBlock(t) {
  return `[data-theme="${t.key}"] {
${LIGHT_BASE}
  --standalone-page-bg: #ffffff;
  --standalone-page-bg-radial: linear-gradient(180deg, #ffffff 0%, #ffffff 100%);
  --page-sub-header-bg: #ffffff;
${common(t)}
${lightTint(t)}
}`;
}

const header = `/**
 * Themes — สลับด้วย <html data-theme="key"> (ดู lib/theme.ts)
 * ไฟล์นี้สร้างจาก scripts/themes/gen-themes.js (อย่าแก้มือ) — ธีมเริ่มต้น (${DEFAULT_THEME}) อยู่ใน tokens.css
 * มืด: เปลี่ยนพื้นผิว + สีปุ่มหลัก · สว่าง: กลับสเกลตัวอักษร/เส้น และกลับสเกล --color-white/zinc ของ Tailwind
 */
`;
fs.writeFileSync(
  "app/styles/themes.css",
  header + T.map((t) => (t.dark ? darkBlock(t) : lightBlock(t))).join("\n\n") + "\n" + fs.readFileSync(__dirname + "/themes-static.css", "utf8"),
);

const ts = `/**
 * รายการธีม (สร้างจาก scripts/themes/gen-themes.js — อย่าแก้มือ) — colors/bgColor ใช้วาดการ์ดตัวอย่างใน ThemePickerSheet
 * ค่า token จริงอยู่ใน app/styles/themes.css (ธีมเริ่มต้นอยู่ใน tokens.css)
 */
export const DEFAULT_THEME = ${JSON.stringify(DEFAULT_THEME)};
export const THEME_STORAGE_KEY = "themeColor";

export interface ThemeOption {
  key: string;
  name: string;
  isDark: boolean;
  colors: string[];
  bgColor: string;
}

export const THEMES: ThemeOption[] = ${JSON.stringify(
  [
    { key: DEFAULT_THEME, name: "Cosmic", isDark: true, colors: ["#4930df", "#121127", "#0968f8"], bgColor: "#0d0814" },
    ...T.map((t) => ({ key: t.key, name: t.name, isDark: t.dark, colors: t.colors, bgColor: t.bg })),
  ],
  null,
  2,
)};

export const THEME_KEYS: string[] = THEMES.map((t) => t.key);
export const LIGHT_THEME_KEYS: string[] = THEMES.filter((t) => !t.isDark).map((t) => t.key);
`;
fs.writeFileSync("lib/themes.ts", ts);
console.log("ok");
