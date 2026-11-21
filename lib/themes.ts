/**
 * รายการธีม (สร้างจาก scripts/themes/gen-themes.js — อย่าแก้มือ) — colors/bgColor ใช้วาดการ์ดตัวอย่างใน ThemePickerSheet
 * ค่า token จริงอยู่ใน app/styles/themes.css (ธีมเริ่มต้นอยู่ใน tokens.css)
 */
export const DEFAULT_THEME = "cosmic";
export const THEME_STORAGE_KEY = "themeColor";

export interface ThemeOption {
  key: string;
  name: string;
  isDark: boolean;
  /** solid = navbar เรียบ · gradient = ไล่สี */
  group: "solid" | "gradient";
  /** solid: tonal | complementary · gradient: mono | duo */
  style: "tonal" | "complementary" | "mono" | "duo";
  colors: string[];
  bgColor: string;
}

export const THEMES: ThemeOption[] = [
  {
    "key": "cosmic",
    "name": "Cosmic",
    "isDark": true,
    "group": "gradient",
    "style": "mono",
    "colors": [
      "#4930df",
      "#121127",
      "#0968f8"
    ],
    "bgColor": "#0d0814"
  },
  {
    "key": "thunder-x",
    "name": "Thunder X",
    "isDark": true,
    "group": "gradient",
    "style": "mono",
    "colors": [
      "#202020",
      "#0b0d11",
      "#ffd600"
    ],
    "bgColor": "#0c0303"
  },
  {
    "key": "sanim",
    "name": "Sanim",
    "isDark": true,
    "group": "gradient",
    "style": "mono",
    "colors": [
      "#202020",
      "#0b0d11",
      "#df6709"
    ],
    "bgColor": "#0c0303"
  },
  {
    "key": "gatsby",
    "name": "Gatsby",
    "isDark": true,
    "group": "gradient",
    "style": "mono",
    "colors": [
      "#101421",
      "#002830",
      "#fef1cf"
    ],
    "bgColor": "#000000"
  },
  {
    "key": "navy",
    "name": "Navy",
    "isDark": true,
    "group": "gradient",
    "style": "mono",
    "colors": [
      "#090c0f",
      "#0c121f",
      "#f7edd2"
    ],
    "bgColor": "#05070a"
  },
  {
    "key": "emerald-night",
    "name": "Emerald Night",
    "isDark": true,
    "group": "gradient",
    "style": "mono",
    "colors": [
      "#0f5c43",
      "#052e22",
      "#34d399"
    ],
    "bgColor": "#040b09"
  },
  {
    "key": "crimson-noir",
    "name": "Crimson Noir",
    "isDark": true,
    "group": "gradient",
    "style": "mono",
    "colors": [
      "#9f1239",
      "#4c0519",
      "#fb7185"
    ],
    "bgColor": "#0b0506"
  },
  {
    "key": "ocean-deep",
    "name": "Ocean Deep",
    "isDark": true,
    "group": "gradient",
    "style": "mono",
    "colors": [
      "#0e5a8a",
      "#052a45",
      "#38bdf8"
    ],
    "bgColor": "#03080d"
  },
  {
    "key": "graphite",
    "name": "Graphite",
    "isDark": true,
    "group": "gradient",
    "style": "mono",
    "colors": [
      "#2b3038",
      "#0e1013",
      "#e2e8f0"
    ],
    "bgColor": "#07080a"
  },
  {
    "key": "orchid",
    "name": "Orchid",
    "isDark": true,
    "group": "gradient",
    "style": "mono",
    "colors": [
      "#a21caf",
      "#4a044e",
      "#e879f9"
    ],
    "bgColor": "#0c0610"
  },
  {
    "key": "solid-violet",
    "name": "Violet Solid",
    "isDark": true,
    "group": "solid",
    "style": "tonal",
    "colors": [
      "#2a1660",
      "#4527a0",
      "#a78bfa"
    ],
    "bgColor": "#17171b"
  },
  {
    "key": "solid-teal",
    "name": "Teal Solid",
    "isDark": true,
    "group": "solid",
    "style": "tonal",
    "colors": [
      "#0b3b3a",
      "#0f766e",
      "#2dd4bf"
    ],
    "bgColor": "#17171b"
  },
  {
    "key": "solid-rose",
    "name": "Rose Solid",
    "isDark": true,
    "group": "solid",
    "style": "tonal",
    "colors": [
      "#5b1230",
      "#be185d",
      "#f472b6"
    ],
    "bgColor": "#17171b"
  },
  {
    "key": "solid-azure",
    "name": "Azure Solid",
    "isDark": true,
    "group": "solid",
    "style": "tonal",
    "colors": [
      "#0c2a5c",
      "#1d4ed8",
      "#60a5fa"
    ],
    "bgColor": "#17171b"
  },
  {
    "key": "solid-violet-gold",
    "name": "Violet + Gold",
    "isDark": true,
    "group": "solid",
    "style": "complementary",
    "colors": [
      "#3b1a7a",
      "#facc15",
      "#facc15"
    ],
    "bgColor": "#111114"
  },
  {
    "key": "solid-teal-coral",
    "name": "Teal + Coral",
    "isDark": true,
    "group": "solid",
    "style": "complementary",
    "colors": [
      "#0b4a47",
      "#fb7185",
      "#fb7185"
    ],
    "bgColor": "#111114"
  },
  {
    "key": "solid-navy-orange",
    "name": "Navy + Orange",
    "isDark": true,
    "group": "solid",
    "style": "complementary",
    "colors": [
      "#14306e",
      "#f97316",
      "#fb923c"
    ],
    "bgColor": "#1d1d22"
  },
  {
    "key": "solid-crimson-mint",
    "name": "Crimson + Mint",
    "isDark": true,
    "group": "solid",
    "style": "complementary",
    "colors": [
      "#6b0f2c",
      "#34d399",
      "#34d399"
    ],
    "bgColor": "#111114"
  },
  {
    "key": "grad-mocha",
    "name": "Mocha",
    "isDark": true,
    "group": "gradient",
    "style": "mono",
    "colors": [
      "#78350f",
      "#271405",
      "#e0b184"
    ],
    "bgColor": "#17171b"
  },
  {
    "key": "duo-violet-gold",
    "name": "Violet → Gold",
    "isDark": true,
    "group": "gradient",
    "style": "duo",
    "colors": [
      "#4c1d95",
      "#2a1660",
      "#facc15"
    ],
    "bgColor": "#111114"
  },
  {
    "key": "duo-wine-teal",
    "name": "Wine → Teal",
    "isDark": true,
    "group": "gradient",
    "style": "duo",
    "colors": [
      "#7a1236",
      "#3a0f22",
      "#2dd4bf"
    ],
    "bgColor": "#17171b"
  },
  {
    "key": "duo-navy-coral",
    "name": "Navy → Coral",
    "isDark": true,
    "group": "gradient",
    "style": "duo",
    "colors": [
      "#1b2f7a",
      "#14214f",
      "#fb7185"
    ],
    "bgColor": "#17171b"
  },
  {
    "key": "duo-forest-amber",
    "name": "Forest → Amber",
    "isDark": true,
    "group": "gradient",
    "style": "duo",
    "colors": [
      "#14532d",
      "#0f3a22",
      "#fbbf24"
    ],
    "bgColor": "#17171b"
  }
];

export const THEME_KEYS: string[] = THEMES.map((t) => t.key);
export const LIGHT_THEME_KEYS: string[] = THEMES.filter((t) => !t.isDark).map((t) => t.key);
