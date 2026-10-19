"use client";

import { useState } from "react";
import type { ProfileUser } from "@/app/types/auth";
import { AVATAR_PRESETS, avatarPresetImageUrl } from "@/app/data/avatarPresets";
import { updateProfileAvatarPreset } from "@/lib/auth/client";
import { SoftDialog } from "@/app/components/ui/SoftDialog";
import { useT } from "@/lib/i18n/I18nProvider";

interface ProfileAvatarPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPresetId: string;
  onSaved: (profile: ProfileUser) => void;
}

/** เลือก avatar preset — บันทึกผ่าน PATCH /api/auth/profile (portal ไป body ที่ z-[100]) */
export function ProfileAvatarPicker({ open, onOpenChange, currentPresetId, onSaved }: ProfileAvatarPickerProps) {
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const t = useT("profile");

  const handleSelect = async (presetId: string) => {
    if (presetId === currentPresetId || savingId) return;
    setError(null);
    setSavingId(presetId);
    const profile = await updateProfileAvatarPreset(presetId);
    setSavingId(null);
    if (!profile) {
      setError(t("avatar.saveFailed"));
      return;
    }
    onSaved(profile);
    onOpenChange(false);
  };

  return (
    <SoftDialog
      open={open}
      onClose={() => onOpenChange(false)}
      title={t("avatar.pickerTitle")}
      locked={savingId !== null}
      closeLabel={t("avatar.close")}
    >
      <h3 className="pr-10 text-lg font-semibold text-[var(--text-on-light)]">{t("avatar.pickerTitle")}</h3>
      <p className="mt-1 text-xs text-[var(--text-muted)]">{t("avatar.pickerDescription")}</p>
      {error ? (
        <p className="mt-2 text-xs font-semibold text-[var(--brand-strong)]" role="alert">
          {error}
        </p>
      ) : null}

      <ul className="mt-3 grid max-h-[min(60dvh,360px)] grid-cols-3 gap-1.5 overflow-y-auto" role="list">
        {AVATAR_PRESETS.map((preset) => {
          const selected = preset.id === currentPresetId;
          const isSaving = savingId === preset.id;
          return (
            <li key={preset.id}>
              <button
                type="button"
                disabled={Boolean(savingId)}
                onClick={() => void handleSelect(preset.id)}
                className={`flex w-full min-w-0 flex-col items-center gap-1 rounded-[var(--radius-soft-sm)] p-1.5 transition-colors ${
                  selected ? "bg-[var(--brand-soft)] ring-2 ring-[var(--brand)]" : "bg-[var(--soft-surface)]"
                } ${savingId && !isSaving ? "opacity-60" : ""}`}
                aria-pressed={selected}
                aria-busy={isSaving}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={avatarPresetImageUrl(preset.id, 128)}
                  alt=""
                  width={64}
                  height={64}
                  className="h-16 w-16 rounded-full object-cover"
                  loading="lazy"
                />
                <span className="text-[11px] font-semibold text-[var(--text-muted)]">
                  {t("avatar.presetName", { n: preset.number })}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </SoftDialog>
  );
}
