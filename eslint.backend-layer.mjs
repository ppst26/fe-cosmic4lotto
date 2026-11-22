/**
 * กฎขอบเขต "ชั้นเชื่อม back-end" — ไฟล์มาตรฐานเดียวกันทุกโปรเจค (ต้นฉบับอยู่ที่ glass · ซิงก์ด้วย scripts/backend-layer/sync.mjs)
 * ห้ามแก้ไฟล์นี้ในโปรเจคปลายทาง — แก้ที่ glass แล้วซิงก์ · รายละเอียดดู docs/api/shared-backend-layer.md §4
 *
 * ไฟล์ UI (app/**, components/**) ต้องเรียกข้อมูลผ่าน hook ใน app/hooks/api/* หรือฟังก์ชันใน lib/api/* เท่านั้น
 * - ห้าม fetch() ตรง · ห้าม import apiFetch (ใช้ได้เฉพาะใน lib/api/*)        → error
 * - import app/data/*MockData ตรง (หนี้เดิม ดู lib/api/mockDataImports.test.ts) → warn
 */
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

/** โปรเจคที่วางโค้ดใต้ src/ (cas) */
const SRC = existsSync(fileURLToPath(new URL("./src/app", import.meta.url))) ? "src/" : "";

const UI_FILES = [`${SRC}app/**/*.{ts,tsx}`, `${SRC}components/**/*.{ts,tsx}`];
const NOT_UI = [
  `${SRC}app/api/**`,
  `${SRC}app/sw.ts`,
  `${SRC}app/serwist/**`,
  `${SRC}app/data/**`,
  `${SRC}app/hooks/**`,
  "**/*.test.ts",
  "**/*.test.tsx",
];

export const backendLayerRules = [
  {
    files: UI_FILES,
    ignores: NOT_UI,
    rules: {
      "no-restricted-globals": [
        "error",
        {
          name: "fetch",
          message: "UI ห้าม fetch() ตรง — ใช้ hook ใน app/hooks/api/* (ต่อ API ที่ lib/api/* ด้วย apiFetch) · ดู docs/api/backend-integration.md",
        },
      ],
      "no-restricted-syntax": [
        "error",
        {
          selector: "ImportDeclaration[source.value='@/lib/api/http'] > ImportSpecifier[imported.name='apiFetch']",
          message: "apiFetch ใช้ได้เฉพาะใน lib/api/* — UI เรียกผ่าน hook หรือฟังก์ชันใน lib/api",
        },
      ],
      "no-restricted-imports": [
        "warn",
        {
          patterns: [
            {
              regex: "/data/[A-Za-z0-9_]*MockData$",
              message: "UI ไม่ควร import *MockData ตรง — ย้ายไปผ่าน lib/api + hook (ดู lib/api/mockDataImports.test.ts)",
            },
          ],
        },
      ],
    },
  },
];
