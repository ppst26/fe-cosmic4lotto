/* ── จาก app/data/avatarPresets.ts ── */

export interface AvatarPreset {
  id: string;
  /** หมายเลขรูป — ชื่อแสดงผลแปลตอน render: useT("profile")("avatar.presetName", { n }) */
  number: number;
}
