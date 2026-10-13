/** path (ไม่มี prefix ภาษา) ที่ต้อง login — proxy.ts เป็นด่านแรก backend ต้องตรวจซ้ำเสมอ */
export const PROTECTED_PREFIXES = [
  "/transactions",
  "/cashback",
  "/profile/account",
  "/vip",
  "/lottery/slips",
] as const;

export function isProtectedPath(path: string): boolean {
  return PROTECTED_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}
