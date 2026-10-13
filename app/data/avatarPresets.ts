import type { AvatarPreset } from "@/app/types/avatar";

/**
 * ชุด avatar preset — รูปจาก public/Avartar (ไม่มีอัปโหลดรูป)
 * ใช้ใน UserAvatar · ProfileAvatarPicker · resolveAvatarPresetId
 */

/** หมายเลขไฟล์ที่มีใน public/Avartar (ไม่มี 14.webp) */
export const AVATAR_ASSET_NUMBERS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15,
] as const;

export type AvatarAssetNumber = (typeof AVATAR_ASSET_NUMBERS)[number];

export const AVATAR_PRESETS: readonly AvatarPreset[] = AVATAR_ASSET_NUMBERS.map(
  (n) => ({
    id: `avatar-${n}`,
    number: n,
  }),
);

const PRESET_IDS = new Set(AVATAR_PRESETS.map((p) => p.id));

/** map preset Dicebear เก่า → รูป local (คงลำดับเดิม) */
const LEGACY_COSMIC_PRESET_MAP: Record<string, string> = {
  "cosmic-nova": "avatar-1",
  "cosmic-orbit": "avatar-2",
  "cosmic-pulse": "avatar-3",
  "cosmic-vega": "avatar-4",
  "cosmic-lyra": "avatar-5",
  "cosmic-comet": "avatar-6",
  "cosmic-pluto": "avatar-7",
  "cosmic-aurora": "avatar-8",
  "cosmic-nebula": "avatar-9",
  "cosmic-stellar": "avatar-10",
  "cosmic-lunar": "avatar-11",
  "cosmic-solar": "avatar-12",
};

/** path สาธารณะของรูป avatar */
export function avatarAssetPath(fileNumber: AvatarAssetNumber | number): string {
  return `/Avartar/${fileNumber}.webp`;
}

/** ตรวจว่า id อยู่ในชุด preset ที่อนุญาต */
export function isAvatarPresetId(id: string): boolean {
  return PRESET_IDS.has(id);
}

/** URL รูป preset — size ไม่ใช้กับ webp local (คงพารามิเตอร์เพื่อ API เดิม) */
export function avatarPresetImageUrl(presetId: string, _size = 160): string {
  const fromLegacy = LEGACY_COSMIC_PRESET_MAP[presetId];
  const resolved = fromLegacy ?? presetId;
  const match = /^avatar-(\d+)$/.exec(resolved);
  if (match) {
    const n = Number(match[1]);
    if ((AVATAR_ASSET_NUMBERS as readonly number[]).includes(n)) {
      return avatarAssetPath(n);
    }
  }
  return avatarAssetPath(AVATAR_ASSET_NUMBERS[0]);
}

/** preset เริ่มต้นแบบคงที่ต่อ user (ไม่สุ่มทุกครั้งที่โหลด) */
export function defaultAvatarPresetIdForUser(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i += 1) {
    hash = (hash * 31 + userId.charCodeAt(i)) | 0;
  }
  const index = Math.abs(hash) % AVATAR_PRESETS.length;
  return AVATAR_PRESETS[index]?.id ?? AVATAR_PRESETS[0].id;
}

/**
 * คืน preset ที่ใช้แสดง — ถ้ายังไม่ตั้ง ใช้ default จาก userId
 */
export function resolveAvatarPresetId(
  storedPresetId: string | undefined | null,
  userId: string,
): string {
  if (storedPresetId && isAvatarPresetId(storedPresetId)) {
    return storedPresetId;
  }
  if (storedPresetId && LEGACY_COSMIC_PRESET_MAP[storedPresetId]) {
    return LEGACY_COSMIC_PRESET_MAP[storedPresetId];
  }
  return defaultAvatarPresetIdForUser(userId);
}
