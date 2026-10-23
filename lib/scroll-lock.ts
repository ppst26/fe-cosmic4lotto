/**
 * ล็อกการเลื่อนหน้า (body) แบบนับจำนวนผู้ล็อก — overlay หลายตัวซ้อน/สลับกัน (เช่น drawer ปิดแล้วเปิด sheet ต่อ)
 * จะปลดล็อกก็ต่อเมื่อไม่เหลือผู้ล็อกแล้วเท่านั้น (เดิมแต่ละตัวเก็บ/คืนค่า overflow เอง ทำให้ค้าง hidden แล้วเลื่อนไม่ได้)
 */
let locks = 0;

export function lockBodyScroll(): () => void {
  if (typeof document === "undefined") return () => undefined;
  locks += 1;
  document.body.style.overflow = "hidden";
  let released = false;
  return () => {
    if (released) return;
    released = true;
    locks = Math.max(0, locks - 1);
    if (locks === 0) document.body.style.removeProperty("overflow");
  };
}
