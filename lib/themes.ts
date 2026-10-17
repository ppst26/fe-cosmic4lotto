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
    "key": "sunfire",
    "name": "Sunfire",
    "isDark": false,
    "colors": [
      "#d9202e",
      "#99121d",
      "#ffd864"
    ],
    "bgColor": "#e4e4e4"
  },
  {
    "key": "blue-syrah",
    "name": "Blue Syrah",
    "isDark": false,
    "colors": [
      "#4ea8ff",
      "#0078ab",
      "#ffd864"
    ],
    "bgColor": "#e4e4e4"
  },
  {
    "key": "good-witch",
    "name": "Good Witch",
    "isDark": false,
    "colors": [
      "#5ed076",
      "#10943e",
      "#ffd864"
    ],
    "bgColor": "#e4e4e4"
  },
  {
    "key": "mix-berry",
    "name": "Mix Berry",
    "isDark": false,
    "colors": [
      "#df5c90",
      "#741a61",
      "#ffd864"
    ],
    "bgColor": "#e4e4e4"
  },
  {
    "key": "mr-bond",
    "name": "Mr Bond",
    "isDark": false,
    "colors": [
      "#1f2735",
      "#0e131c",
      "#72a3f9"
    ],
    "bgColor": "#e4e4e4"
  }
];

export const THEME_KEYS: string[] = THEMES.map((t) => t.key);
export const LIGHT_THEME_KEYS: string[] = THEMES.filter((t) => !t.isDark).map((t) => t.key);
