#!/usr/bin/env node
/**
 * codemod ครั้งเดียว: เปลี่ยน import ให้ใช้ตัวห่อใน lib/i18n/navigation (เติม/ตัด prefix ภาษาอัตโนมัติ)
 * - import Link from "next/link"            → import Link from "@/lib/i18n/navigation"
 * - useRouter / usePathname จาก next/navigation → @/lib/i18n/navigation (ตัวอื่นคงไว้)
 * ไม่แตะ redirect / permanentRedirect (ต้องแก้มือเป็น localizedRedirect แบบ async)
 * ใช้: node scripts/i18n-swap-imports.mjs
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOTS = ["app", "components", "lib"];
const SKIP = [path.normalize("lib/i18n"), path.normalize("app/api")];
const MOVED = new Set(["useRouter", "usePathname"]);
const TARGET = "@/lib/i18n/navigation";

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (SKIP.some((skip) => full.startsWith(skip))) continue;
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.(ts|tsx)$/.test(name) && !name.endsWith(".test.ts")) out.push(full);
  }
  return out;
}

function transform(source) {
  let next = source.replace(
    /import\s+(\w+)\s+from\s+["']next\/link["'];?/g,
    (_, name) => `import ${name} from "${TARGET}";`,
  );

  next = next.replace(
    /import\s+\{([^}]*)\}\s+from\s+["']next\/navigation["'];?/g,
    (whole, list) => {
      const names = list
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const moved = names.filter((n) => MOVED.has(n.split(/\s+as\s+/)[0]));
      if (moved.length === 0) return whole;
      const kept = names.filter((n) => !moved.includes(n));
      const lines = [];
      if (kept.length) lines.push(`import { ${kept.join(", ")} } from "next/navigation";`);
      lines.push(`import { ${moved.join(", ")} } from "${TARGET}";`);
      return lines.join("\n");
    },
  );
  return next;
}

const changed = [];
for (const root of ROOTS) {
  for (const file of walk(root)) {
    const source = readFileSync(file, "utf8");
    const next = transform(source);
    if (next !== source) {
      writeFileSync(file, next);
      changed.push(file);
    }
  }
}
console.log(`[i18n-swap-imports] แก้ ${changed.length} ไฟล์`);
for (const file of changed) console.log(`  ${file}`);
