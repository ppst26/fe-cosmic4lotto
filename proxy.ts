import { NextResponse, type NextRequest } from "next/server";
import { API_BASE_URL } from "@/lib/api/http";
import { hasProxySession } from "@/lib/auth/proxySession";
import { LOCALE_COOKIE } from "@/lib/i18n/config";
import { decideProxyAction } from "@/lib/i18n/routing";

/**
 * Next 16 proxy · Node.js runtime
 * 1) ไทย (default) ไม่มี prefix ใน URL → rewrite ภายในไป /th/... · ภาษาอื่นใช้ /{locale}/...
 * 2) ผู้ใช้ที่เลือกภาษาอื่นไว้ (cookie → Accept-Language) เปิด URL ไทย → redirect ไปภาษานั้น
 * 3) กันหน้าที่ต้อง login (lib/auth/protectedPaths.ts) → หน้าแรกของภาษา ?layer=login
 *    วิธีตรวจ session ขึ้นกับโหมด — ดู lib/auth/proxySession.ts (mock / backend จริง)
 * เป็นด่านแรกเท่านั้น — route handler / backend ต้องตรวจสิทธิ์เองทุกครั้ง
 */
export function proxy(request: NextRequest) {
  const action = decideProxyAction({
    pathname: request.nextUrl.pathname,
    search: request.nextUrl.search,
    cookieLocale: request.cookies.get(LOCALE_COOKIE)?.value,
    acceptLanguage: request.headers.get("accept-language"),
    hasSession: hasProxySession({
      apiBaseUrl: API_BASE_URL,
      sessionCookieName: process.env.AUTH_SESSION_COOKIE,
      getCookie: (name) => request.cookies.get(name)?.value,
    }),
  });
  if (action.type === "next") return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = action.pathname;
  if (action.type === "rewrite") return NextResponse.rewrite(url);

  url.search = action.search;
  return NextResponse.redirect(url);
}

export const config = {
  // ทุกหน้า ยกเว้น API, ไฟล์ของ Next, service worker และไฟล์ที่มีนามสกุล (assets ใน public/, manifest)
  matcher: ["/((?!api|_next|serwist|.*\\..*).*)"],
};
