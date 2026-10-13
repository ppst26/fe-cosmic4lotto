#!/usr/bin/env node
/** Download all ./_nuxt chunks referenced by entry (and nested imports). */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const NUXT_DIR = path.resolve(__dirname, "../../dump/bblotto.iltx.cc/_nuxt");
const BASE = "https://bblotto.iltx.cc/_nuxt/";

const CHUNK_RE =
  /(?:import\s*\(\s*["']\.\/([^"']+)["']|["']\.\/([^"']+\.(?:js|css))["'])/g;

function extractRefs(text) {
  const refs = new Set();
  CHUNK_RE.lastIndex = 0;
  let m;
  while ((m = CHUNK_RE.exec(text))) {
    const name = m[1] || m[2];
    if (name && !name.includes("*")) refs.add(name);
  }
  return refs;
}

async function download(name) {
  const url = BASE + name;
  const file = path.join(NUXT_DIR, name.replace(/\//g, path.sep));
  if (fs.existsSync(file)) return { name, status: "exists" };
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const res = await fetch(url);
  if (!res.ok) return { name, status: "fail", code: res.status };
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.slice(0, 15).toString().includes("<!DOCTYPE")) {
    return { name, status: "html" };
  }
  fs.writeFileSync(file, buf);
  return { name, status: "ok", bytes: buf.length };
}

async function main() {
  const entry = fs.readFileSync(path.join(NUXT_DIR, "entry.D9y5y_CT.js"), "utf8");
  const queue = [...extractRefs(entry)];
  const seen = new Set();
  let ok = 0;
  let fail = 0;

  while (queue.length) {
    const name = queue.shift();
    if (seen.has(name)) continue;
    seen.add(name);

    const result = await download(name);
    if (result.status === "ok") ok++;
    else if (result.status === "fail" || result.status === "html") fail++;

    const file = path.join(NUXT_DIR, name.replace(/\//g, path.sep));
    if (fs.existsSync(file) && name.endsWith(".js")) {
      const text = fs.readFileSync(file, "utf8");
      for (const ref of extractRefs(text)) {
        if (!seen.has(ref)) queue.push(ref);
      }
    }
  }

  console.log({ scanned: seen.size, downloaded: ok, failed: fail });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
