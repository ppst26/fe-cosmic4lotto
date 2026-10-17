// สคริปต์ล็อกอินสำหรับ dev — ยิง POST /api/auth/login แล้วพิมพ์ cookie session + คำสั่งตั้ง cookie ในเบราว์เซอร์
// ใช้: npm run dev:login   (หรือ DEV_LOGIN_PHONE=... DEV_LOGIN_PASSWORD=... DEV_BASE_URL=... npm run dev:login)
// ค่าเริ่มต้น = บัญชีเดโมใน lib/auth/demoCredentials.ts
// รันได้เฉพาะ localhost เท่านั้น — กันเผลอเอา credential ทดสอบไปยิงเซิร์ฟเวอร์จริง
const BASE_URL = process.env.DEV_BASE_URL ?? "http://localhost:3000";
const PHONE = process.env.DEV_LOGIN_PHONE ?? "0999999999";
const PASSWORD = process.env.DEV_LOGIN_PASSWORD ?? "demo1234";

const { hostname } = new URL(BASE_URL);
if (!["localhost", "127.0.0.1", "::1", "[::1]"].includes(hostname)) {
  console.error(`ปฏิเสธ: dev-login ใช้ได้เฉพาะ localhost (ได้ ${hostname})`);
  process.exit(1);
}

const res = await fetch(`${BASE_URL}/api/auth/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ phone: PHONE, password: PASSWORD }),
});
const body = await res.json().catch(() => ({}));

if (!res.ok || !body.ok) {
  console.error(`ล็อกอินไม่สำเร็จ (${res.status}): ${body.error ?? "unknown"}`);
  if (res.status === 401) {
    console.error(`ยังไม่มีผู้ใช้ ${PHONE} ในระบบ — สมัครผ่านหน้าเว็บก่อน (ข้อมูลเก็บที่ .data/users.json)`);
  }
  process.exit(1);
}

const cookie = res.headers.getSetCookie().find((c) => c.startsWith("cm_session="));
const token = cookie?.split(";")[0].slice("cm_session=".length);
console.log(`ล็อกอินสำเร็จ: ${body.user.firstName} ${body.user.lastName} (${PHONE})`);
if (token) {
  console.log("\nวางใน DevTools console ของหน้าเว็บเพื่อเข้าสู่ระบบ:");
  console.log(`document.cookie = "cm_session=${token}; path=/; max-age=2592000"; location.reload();`);
}
