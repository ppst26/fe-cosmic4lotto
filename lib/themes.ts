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
  colors: string[];
  bgColor: string;
}

export const THEMES: ThemeOption[] = [
  {
    "key": "cosmic",
    "name": "Cosmic",
    "isDark": true,
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
    "colors": [
      "#202020",
      "#0b0d11",
      "#ffd600"
    ],
    "bgColor": "#0c0303"
  },
  {
    "key": "dark-mix-berry",
    "name": "Dark Mix Berry",
    "isDark": true,
    "colors": [
      "#ff2d95",
      "#b5179e",
      "#ff7ac3"
    ],
    "bgColor": "#0f0f12"
  },
  {
    "key": "tron",
    "name": "Tron",
    "isDark": true,
    "colors": [
      "#102993",
      "#050f3b",
      "#51b0ff"
    ],
    "bgColor": "#0c0303"
  },
  {
    "key": "sanim",
    "name": "Sanim",
    "isDark": true,
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
    "colors": [
      "#090c0f",
      "#0c121f",
      "#f7edd2"
    ],
    "bgColor": "#05070a"
  },
  {
    "key": "wisdom",
    "name": "Wisdom",
    "isDark": true,
    "colors": [
      "#772639",
      "#400A1A",
      "#E6E6E6"
    ],
    "bgColor": "#0C0303"
  },
  {
    "key": "midnight-violet",
    "name": "Midnight Violet",
    "isDark": true,
    "colors": [
      "#4c1d95",
      "#1e0b45",
      "#a78bfa"
    ],
    "bgColor": "#08060f"
  },
  {
    "key": "emerald-night",
    "name": "Emerald Night",
    "isDark": true,
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
    "colors": [
      "#0e5a8a",
      "#052a45",
      "#38bdf8"
    ],
    "bgColor": "#03080d"
  },
  {
    "key": "royal-gold",
    "name": "Royal Gold",
    "isDark": true,
    "colors": [
      "#5a4310",
      "#231a05",
      "#fbbf24"
    ],
    "bgColor": "#0a0804"
  },
  {
    "key": "ember",
    "name": "Ember",
    "isDark": true,
    "colors": [
      "#c2410c",
      "#5a1d06",
      "#fb923c"
    ],
    "bgColor": "#0b0603"
  },
  {
    "key": "graphite",
    "name": "Graphite",
    "isDark": true,
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
    "colors": [
      "#a21caf",
      "#4a044e",
      "#e879f9"
    ],
    "bgColor": "#0c0610"
  },
  {
    "key": "venom",
    "name": "Venom",
    "isDark": true,
    "colors": [
      "#3f6212",
      "#1a2e05",
      "#a3e635"
    ],
    "bgColor": "#060a04"
  },
  {
    "key": "nebula",
    "name": "Nebula",
    "isDark": true,
    "colors": [
      "#3730a3",
      "#1e1b4b",
      "#818cf8"
    ],
    "bgColor": "#05060f"
  }
];

export const THEME_KEYS: string[] = THEMES.map((t) => t.key);
export const LIGHT_THEME_KEYS: string[] = THEMES.filter((t) => !t.isDark).map((t) => t.key);
