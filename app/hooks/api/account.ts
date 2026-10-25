"use client";

import type { ProfileUser } from "@/app/types/auth";
import { fetchProfile } from "@/lib/auth/client";
import { fetchWalletBalance, type WalletBalance } from "@/lib/api/profile";
import { useApi, type ApiResource } from "@/app/hooks/useApi";

/**
 * โปรไฟล์เต็มของผู้ใช้ที่ login — cache เดียวทั้งแอป · setData(profile) หลังบันทึก avatar ฯลฯ
 * ใช้ใน ProfileSlideOverCard · DesktopHubAccountBody · MenuDrawerUserAvatar · /profile/account · /referral
 */
export function useProfile(): ApiResource<ProfileUser> {
  // header ถูก mount ใหม่ทุกครั้งที่เปลี่ยนหน้า — มีใน cache แล้วไม่ต้องดึงซ้ำ (อัปเดตผ่าน setData หลังแก้โปรไฟล์)
  return useApi(["profile"], fetchProfile, { auth: true, swr: { revalidateIfStale: false } });
}

/**
 * ยอดเครดิตหลัก — แหล่งเดียวสำหรับ Header · เมนู · reward hub
 * เรียก refresh() หลัง mutation ที่กระทบยอด (ฝาก · ถอน · คูปอง · รับ cashback)
 */
export function useWallet(): ApiResource<WalletBalance> {
  return useApi(["wallet-balance"], fetchWalletBalance, { auth: true });
}
