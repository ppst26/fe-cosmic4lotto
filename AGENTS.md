## เชื่อมต่อ back-end (มาตรฐานเดียวกับ glass)

- อ่านก่อน: `docs/api/shared-backend-layer.md` (มาตรฐานร่วม · ตารางตำแหน่งไฟล์) · `docs/api/backend-integration.md` + skill `agent/skills/cosmicbet-backend/SKILL.md`
- component เรียกเฉพาะ hook ใน `app/hooks/api/*` · ต่อ API จริงแก้เฉพาะ body ใน `lib/api/*` ด้วย `apiFetch` (ห้าม `fetch()` ตรง)
- ชั้นเชื่อม backend (ดูรายการใน `backend-layer.manifest.json`) **ห้ามแก้ที่นี่** — แก้ที่ glass → commit → `pnpm backend:sync` ใน glass · เทสต์ `lib/api/backendLayer.test.ts` จะล้มถ้าแก้ตรง
- ESLint (`eslint.backend-layer.mjs`): UI ห้าม `fetch()` / import `apiFetch` · import `*MockData` ตรงขึ้น warning

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
