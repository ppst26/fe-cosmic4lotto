#!/usr/bin/env node
/**
 * Junction dump/bblotto.iltx.cc assets into lotto/public (Windows-friendly).
 * Re-run after dump updates.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const DUMP = path.resolve(ROOT, "../dump/bblotto.iltx.cc");
const PUBLIC = path.join(ROOT, "public");

const LINKS = [
  "_nuxt",
  "assets",
  "locales",
  "v4",
  "_external",
  "_pages",
  "_cdn",
  "geetest-v4.js",
  "pixel.js",
  "favicon.ico",
];

function linkOne(name) {
  const target = path.join(DUMP, name);
  const link = path.join(PUBLIC, name);
  if (!fs.existsSync(target)) {
    console.warn("skip (missing in dump):", name);
    return;
  }
  if (fs.existsSync(link)) {
    console.log("exists:", name);
    return;
  }
  fs.mkdirSync(PUBLIC, { recursive: true });
  const cmd = `cmd /c mklink /J "${link}" "${target}"`;
  try {
    execSync(cmd, { stdio: "inherit" });
    console.log("linked:", name);
  } catch {
    console.warn("junction failed, copying:", name);
    fs.cpSync(target, link, { recursive: true });
  }
}

if (!fs.existsSync(DUMP)) {
  console.error("Dump not found:", DUMP);
  process.exit(1);
}

for (const name of LINKS) linkOne(name);
console.log("Done. Static assets ready under public/");
