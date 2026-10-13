import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // ลิงก์/redirect ต้องผ่าน lib/i18n เพื่อให้ URL มี prefix ภาษาเสมอ
  {
    files: ["**/*.{ts,tsx}"],
    ignores: ["lib/i18n/**", "app/api/**", "components/lotto/**", "components/bblotto/**"],
    rules: {
      "@typescript-eslint/no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "next/link",
              message: "ใช้ Link จาก @/lib/i18n/navigation (เติม prefix ภาษาให้)",
              allowTypeImports: true,
            },
            {
              name: "next/navigation",
              importNames: ["useRouter", "usePathname", "redirect", "permanentRedirect"],
              message: "ใช้ตัวจาก @/lib/i18n/navigation หรือ @/lib/i18n/server",
            },
          ],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // build output ของ lottery kit และไฟล์ dump ชั่วคราว
    "exports/**",
    ".tmp-*",
  ]),
]);

export default eslintConfig;
