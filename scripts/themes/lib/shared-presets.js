/**
 * ตัวอ่าน + ตรวจ preset กลาง (presets.shared.json) — ไฟล์นี้และ JSON เหมือนกันทุกโปรเจกต์ (glass / black-purple / lotto / cas)
 * gen-themes.js ของแต่ละโปรเจกต์เรียก loadSharedPresets() แล้วแปลงเป็น token ของตัวเอง
 *
 * ตรวจตอน generate (ไม่ผ่าน = throw):
 *  - ตัวอักษรบน navbar / category nav / ปุ่ม ต้อง contrast >= 4.5
 *  - พื้นหลังชั้นหลังสุด (page) ต้องเป็นสีกลางเข้ม: luminance <= 0.06 และ chroma ต่ำ
 *  - group "solid" ต้อง chrome.from === chrome.to
 */
const fs = require("fs");
const path = require("path");

const hexToRgb = (hex) => {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.replace(/./g, "$&$&") : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const channel = (v) => {
  const c = v / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
};
const luminance = (hex) => {
  const [r, g, b] = hexToRgb(hex).map(channel);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
/** chroma 0–1 (max-min ของ RGB) — ใช้ดูว่าพื้นหลังยัง "กลาง" อยู่ไหม */
const chroma = (hex) => {
  const rgb = hexToRgb(hex);
  return (Math.max(...rgb) - Math.min(...rgb)) / 255;
};

const NEUTRALS = {
  black: { page: "#050506", card: "#111113", card2: "#0c0c0e", inner: "#1a1a1d" },
  charcoal: { page: "#0a0a0b", card: "#141416", card2: "#101012", inner: "#1d1d20" },
  graphite: { page: "#0f0f11", card: "#18181b", card2: "#141417", inner: "#222226" },
};

const HEX = /^#[0-9a-f]{6}$/i;
const GROUPS = ["solid", "gradient"];
const STYLES = { solid: ["tonal", "complementary"], gradient: ["mono", "duo"] };

function fail(key, msg) {
  throw new Error(`[presets.shared.json] ${key}: ${msg}`);
}

function check(key, label, fg, bg, min = 4.5) {
  const ratio = contrast(fg, bg);
  if (ratio < min) fail(key, `${label} contrast ${ratio.toFixed(2)} < ${min} (${fg} on ${bg})`);
  return ratio;
}

/**
 * คืน row กลาง (ยังไม่ผูกกับ token ของโปรเจกต์ใด):
 * { key,name,group,style,page,nav,card,card2,inner,accent,icon,
 *   ga,gb,chromeFg, action,at, active,act, rail|null, glow, colors[3], bg }
 */
function loadSharedPresets(themesDir = path.resolve(__dirname, "..")) {
  const spec = JSON.parse(fs.readFileSync(path.join(themesDir, "presets.shared.json"), "utf8"));
  const seen = new Set();
  const report = [];
  const rows = spec.presets.map((p) => {
    const key = p.key;
    if (!/^[a-z0-9-]+$/.test(key || "")) fail(key, "key ต้องเป็น a-z 0-9 -");
    if (seen.has(key)) fail(key, "key ซ้ำ");
    seen.add(key);
    if (!GROUPS.includes(p.group)) fail(key, `group ต้องเป็น ${GROUPS.join("|")}`);
    if (!STYLES[p.group].includes(p.style)) fail(key, `style ของ ${p.group} ต้องเป็น ${STYLES[p.group].join("|")}`);

    const neutral = { ...(NEUTRALS[p.neutral || "charcoal"] || fail(key, "neutral ไม่รู้จัก")), ...(p.surface || {}) };
    const { from, to, fg } = p.chrome;
    for (const [label, v] of Object.entries({ from, to, fg, "action.color": p.action.color, "action.text": p.action.text, accent: p.accent, icon: p.icon })) {
      if (!HEX.test(v || "")) fail(key, `${label} ต้องเป็น hex 6 หลัก (ได้ ${v})`);
    }
    if (p.group === "solid" && from.toLowerCase() !== to.toLowerCase()) fail(key, "solid ต้อง chrome.from === chrome.to");

    // พื้นหลังชั้นหลังสุดต้องกลาง+เข้ม
    if (luminance(neutral.page) > 0.06) fail(key, `page ${neutral.page} สว่างเกินไป (ต้องเป็นดำ/เทาเข้ม)`);
    if (chroma(neutral.page) > 0.06) fail(key, `page ${neutral.page} มีสีเกินไป (ต้องเป็นสีกลาง)`);

    const ratios = {
      chrome: Math.min(check(key, "chrome.fg/from", fg, from), check(key, "chrome.fg/to", fg, to)),
      action: check(key, "action.text/color", p.action.text, p.action.color),
    };
    let rail = null;
    if (p.rail) {
      for (const [label, v] of Object.entries(p.rail)) if (!HEX.test(v)) fail(key, `rail.${label} ต้องเป็น hex`);
      ratios.rail = check(key, "rail.fg/bg", p.rail.fg, p.rail.bg);
      ratios.railActive = check(key, "rail.activeFg/activeBg", p.rail.activeFg, p.rail.activeBg);
      rail = p.rail;
    }
    report.push({ key, group: p.group, style: p.style, ...Object.fromEntries(Object.entries(ratios).map(([k, v]) => [k, v.toFixed(1)])) });

    return {
      key,
      name: p.name,
      dark: true,
      group: p.group,
      style: p.style,
      ...neutral,
      nav: to,
      accent: p.accent,
      icon: p.icon,
      ga: from,
      gb: to,
      chromeFg: fg,
      action: p.action.color,
      at: p.action.text,
      active: rail ? rail.activeBg : p.action.color,
      act: rail ? rail.activeFg : p.action.text,
      rail,
      glow: p.glow === true,
      colors: [from, rail ? rail.bg : to, p.action.color],
      bg: neutral.page,
    };
  });
  return { rows, report };
}

const lum = luminance;

/** ใช้ใน gen-themes: สร้างบล็อก token ใหม่ (--t-chrome-*, --t-rail-*) — ธีมเดิม (ไม่มี chromeFg/rail) ไม่ได้ token พวกนี้ → CSS ใช้ fallback เดิม */
function extraTokens(t) {
  const lines = [];
  if (t.chromeFg && t.chromeFg.toLowerCase() !== "#ffffff") {
    const darkFg = lum(t.chromeFg) < 0.4;
    lines.push(
      `--t-chrome-fg: ${t.chromeFg};`,
      `--t-chrome-fg-soft: color-mix(in srgb, ${t.chromeFg} 88%, transparent);`,
      `--t-chrome-fg-muted: color-mix(in srgb, ${t.chromeFg} 72%, transparent);`,
      `--t-chrome-inner-fill: ${darkFg ? "rgba(255, 255, 255, 0.38)" : "rgba(0, 0, 0, 0.24)"};`,
      `--t-chrome-inner-fill-hover: ${darkFg ? "rgba(255, 255, 255, 0.52)" : "rgba(0, 0, 0, 0.34)"};`,
      `--t-chrome-logo-filter: ${darkFg ? "brightness(0)" : "brightness(0) invert(1)"};`,
    );
    if (darkFg) lines.push(`--t-chrome-label: ${t.chromeFg};`);
  }
  if (t.rail) {
    lines.push(
      `--t-rail-bg: ${t.rail.bg};`,
      `--t-rail-fg: ${t.rail.fg};`,
      `--t-rail-item-bg: color-mix(in srgb, ${t.rail.fg} 14%, ${t.rail.bg});`,
      `--t-rail-active-bg: ${t.rail.activeBg};`,
      `--t-rail-active-fg: ${t.rail.activeFg};`,
    );
  }
  return lines;
}

/**
 * group "solid" = ปุ่ม/แท็บ/ชิป เรียบสีเดียว (ไม่มี gradient ไล่เข้มลง) — ใช้กับโปรเจกต์ที่ใช้ชุด token แบบ glass (glass / lotto / cas)
 * ใส่ท้าย block ของ preset เพื่อ override ค่าที่ common() สร้างไว้ก่อนหน้า
 */
function solidFlatTokens(t) {
  if (t.group !== "solid") return [];
  const flat = (v) => `linear-gradient(${v}, ${v})`;
  return [
    `--action-gradient: ${flat("var(--t-action)")};`,
    `--confirm-btn-gradient: ${flat("var(--t-action)")};`,
    `--auth-register-gradient: ${flat("var(--t-action)")};`,
    `--category-active-gradient: ${flat("var(--t-active)")};`,
    `--line-tab-neon-gradient: ${flat("var(--t-active)")};`,
    `--t-chrome-bg: ${flat("var(--t-ga)")};`,
  ];
}

/** selector รวมของ preset ที่ตัวอักษร chrome เป็นสีเข้ม (พื้นสว่าง/พาสเทล) — ใช้สร้างกฎเฉพาะโปรเจกต์ เช่น header ของ lotto/cas */
function darkChromeSelector(rows) {
  const keys = rows.filter((r) => r.chromeFg && luminance(r.chromeFg) < 0.4).map((r) => `[data-theme="${r.key}"]`);
  return keys.length ? `:is(${keys.join(",")})` : ":not(*)";
}

/** selector รวมของ preset กลุ่ม solid (ปุ่มเรียบสีเดียว) */
function solidSelector(rows) {
  const keys = rows.filter((r) => r.group === "solid").map((r) => `[data-theme="${r.key}"]`);
  return keys.length ? `:is(${keys.join(",")})` : ":not(*)";
}

module.exports = { loadSharedPresets, extraTokens, solidFlatTokens, darkChromeSelector, solidSelector, contrast, luminance, chroma, NEUTRALS };
