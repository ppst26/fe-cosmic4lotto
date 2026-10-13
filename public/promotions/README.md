# Promotions mock data (back office placeholder)

- `catalog.json` — รายการโปร, แท็บหมวด, hero/featured/activities/mobileList
- `details.json` — เนื้อหา modal รายละเอียด (key = promotion id)
- `mock-pro*.avif` — แบนเนอร์รายการมือถือ

API:

- `GET /api/promotions` → `catalog.json`
- `GET /api/promotions/[id]` → รายการใน `details.json`

อัปเดต catalog: `node scripts/export-promotions-catalog.mjs`  
อัปเดต details: แก้ `details.json` โดยตรง หรือ regenerate จาก seed ใน repo history
