import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    /** root layout อยู่ใต้ app/[lang] — URL ที่ไม่ตรง route ใช้ app/global-not-found.tsx */
    globalNotFound: true,
  },
};

export default nextConfig;
