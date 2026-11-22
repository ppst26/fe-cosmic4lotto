import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

/**
 * ชั้นเชื่อม back-end ต้องตรงกับต้นแบบ glass ทุกไฟล์ — เพื่อให้ทุกโปรเจคต่อ backend พร้อมกันด้วยโค้ดชุดเดียว
 *
 * backend-layer.manifest.json (ที่ root ของโปรเจค) สร้างโดย glass/scripts/backend-layer/sync.mjs --apply
 * เก็บ sha256 ของทุกไฟล์ในชั้นนี้ · เทสต์ล้ม = มีคนแก้ไฟล์ในชั้นนี้ที่โปรเจคปลายทางโดยตรง
 * วิธีแก้: ย้ายการแก้ไปทำที่ glass → commit → `pnpm backend:sync` ใน glass (ดู docs/api/shared-backend-layer.md §5)
 *
 * glass เป็นต้นแบบเอง (ไม่มี manifest) — ตรวจปลายทางด้วย `pnpm backend:check` แทน
 */
const ROOT = process.cwd();
const MANIFEST = join(ROOT, "backend-layer.manifest.json");
const IS_SOURCE = existsSync(join(ROOT, "scripts/backend-layer/sync.mjs"));

interface BackendLayerManifest {
  source: string;
  commit: string;
  files: Record<string, string>;
  extensions: string[];
}

const sha256 = (path: string) =>
  createHash("sha256").update(readFileSync(path, "utf8").replace(/\r\n/g, "\n")).digest("hex");

test("backend layer matches the glass manifest", { skip: IS_SOURCE && "glass คือต้นแบบ" }, () => {
  assert.ok(existsSync(MANIFEST), "ไม่พบ backend-layer.manifest.json — รัน `pnpm backend:sync` ใน glass");
  const manifest = JSON.parse(readFileSync(MANIFEST, "utf8")) as BackendLayerManifest;
  const missing: string[] = [];
  const changed: string[] = [];
  for (const [file, hash] of Object.entries(manifest.files)) {
    const path = join(ROOT, file);
    if (!existsSync(path)) missing.push(file);
    else if (sha256(path) !== hash) changed.push(file);
  }
  assert.deepEqual(missing, [], `ไฟล์ในชั้นเชื่อม back-end หายไป (glass ${manifest.commit}):\n${missing.join("\n")}`);
  assert.deepEqual(
    changed,
    [],
    `ไฟล์ต่างจากต้นแบบ glass ${manifest.commit} — แก้ที่ glass แล้วซิงก์ (docs/api/shared-backend-layer.md §5):\n${changed.join("\n")}`,
  );
});
