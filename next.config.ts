import { withSerwist } from "@serwist/turbopack";
import type { NextConfig } from "next";

type RemotePattern = NonNullable<NonNullable<NextConfig["images"]>["remotePatterns"]>[number];

/**
 * host รูปจาก backend / CDN สำหรับ next/image
 * NEXT_PUBLIC_IMAGE_HOSTS = รายการ origin คั่นด้วย comma เช่น "https://cdn.cosmicbet.com,https://img.provider.io"
 * origin ของ NEXT_PUBLIC_API_BASE_URL ถูกเพิ่มให้อัตโนมัติ
 */
function imageRemotePatterns(): RemotePattern[] {
  const origins = [
    ...(process.env.NEXT_PUBLIC_IMAGE_HOSTS ?? "").split(","),
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "",
  ]
    .map((value) => value.trim())
    .filter(Boolean);

  const patterns = new Map<string, RemotePattern>();
  for (const origin of origins) {
    try {
      const url = new URL(origin);
      const protocol = url.protocol.replace(":", "") as "http" | "https";
      patterns.set(`${protocol}://${url.host}`, {
        protocol,
        hostname: url.hostname,
        ...(url.port ? { port: url.port } : {}),
        pathname: "/**",
      });
    } catch {
      throw new Error(`NEXT_PUBLIC_IMAGE_HOSTS / NEXT_PUBLIC_API_BASE_URL ไม่ใช่ URL ที่ถูกต้อง: "${origin}"`);
    }
  }
  return [...patterns.values()];
}

/**
 * security headers ทุกหน้า — กันฝัง iframe, กัน sniff ชนิดไฟล์, จำกัด referrer และสิทธิ์อุปกรณ์
 * CSP แบบเต็ม (script-src) ยังไม่ใส่ เพราะต้องใช้ nonce กับ inline script ของ Next — ทำตอนรู้โดเมน backend/CDN จริง
 */
const SECURITY_HEADERS = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  ...(process.env.NODE_ENV === "production"
    ? [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" }]
    : []),
];

/** ไฟล์ใน public/ เป็น avif/webp ที่บีบแล้ว — แคชยาว กันดึงซ้ำทุกครั้งที่เปิดหน้า */
const STATIC_IMAGE_CACHE_HEADER = {
  key: "Cache-Control",
  value: "public, max-age=2592000, stale-while-revalidate=86400",
};

const STATIC_IMAGE_SOURCES = [
  "/:path*.avif",
  "/:path*.webp",
  "/:path*.png",
  "/:path*.jpg",
  "/:path*.jpeg",
  "/:path*.gif",
  "/:path*.svg",
  "/:path*.ico",
] as const;

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    /** root layout อยู่ใต้ app/[lang] — URL ที่ไม่ตรง route ใช้ app/global-not-found.tsx */
    globalNotFound: true,
  },
  images: {
    remotePatterns: imageRemotePatterns(),
    /**
     * ข้าม /_next/image — รูป public/ เป็น avif/webp อยู่แล้ว
     * optimizer encode ใหม่ทุกใบตอน first hit (โดยเฉพาะ AVIF ไอคอนเมนู) ทำให้ทั้งหน้าช้า
     */
    unoptimized: true,
    deviceSizes: [360, 640, 828, 1080, 1920],
    imageSizes: [48, 96, 160, 256],
  },
  async headers() {
    return [
      { source: "/:path*", headers: SECURITY_HEADERS },
      ...STATIC_IMAGE_SOURCES.map((source) => ({
        source,
        headers: [STATIC_IMAGE_CACHE_HEADER],
      })),
    ];
  },
};

export default withSerwist(nextConfig);
