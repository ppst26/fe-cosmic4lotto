"use client";

import type { ProfileUser } from "@/app/types/auth";
import { avatarPresetImageUrl, resolveAvatarPresetId } from "@/app/data/avatarPresets";
import { useT } from "@/lib/i18n/I18nProvider";

type UserAvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

const SIZE_PX: Record<UserAvatarSize, number> = { xs: 32, sm: 40, md: 44, lg: 56, xl: 96 };

const SIZE_CLASS: Record<UserAvatarSize, string> = {
  xs: "h-8 w-8 rounded-full",
  sm: "h-10 w-10 rounded-full",
  md: "h-11 w-11 rounded-full",
  lg: "h-14 w-14 rounded-xl",
  xl: "h-24 w-24 rounded-full",
};

export interface UserAvatarProps {
  profile: Pick<ProfileUser, "id" | "displayName" | "avatarPresetId">;
  size?: UserAvatarSize;
  className?: string;
}

/** รูปโปรไฟล์จาก preset */
export function UserAvatar({ profile, size = "md", className = "" }: UserAvatarProps) {
  const t = useT("profile");
  const px = SIZE_PX[size];
  const presetId = resolveAvatarPresetId(profile.avatarPresetId, profile.id);
  const src = avatarPresetImageUrl(presetId, px * 2);

  return (
    <span className={`relative inline-flex shrink-0 overflow-hidden bg-[var(--soft-surface)] ${SIZE_CLASS[size]} ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" width={px} height={px} className="h-full w-full object-cover" loading="lazy" decoding="async" />
      <span className="sr-only">{t("avatar.srLabel", { name: profile.displayName })}</span>
    </span>
  );
}
