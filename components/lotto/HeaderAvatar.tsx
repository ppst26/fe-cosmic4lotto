"use client";

import Image from "next/image";
import Link from "@/lib/i18n/navigation";
import { useProfile } from "@/app/hooks/api/account";

/** รูปโปรไฟล์ใน header มือถือ — กดไปหน้าโปรไฟล์ (ใช้ cache เดียวกับ useProfile ทั้งแอป) */
export function HeaderAvatar() {
  const profile = useProfile();
  const avatarUrl = profile.data?.avatarUrl;
  const name = profile.data?.displayName;

  return (
    <Link href="/profile" className="header-avatar" aria-label={name || undefined}>
      {avatarUrl ? <Image src={avatarUrl} alt="" width={40} height={40} unoptimized /> : null}
    </Link>
  );
}
