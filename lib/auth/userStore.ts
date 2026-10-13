import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import type { ProfileUser, StoredUser } from "@/app/types/auth";
import { hashPassword } from "./password";
import {
  formatDisplayName,
  formatJoinedDate,
  formatMemberId,
  maskBankAccount,
  maskPhone,
} from "./profileFormat";
import {
  avatarPresetImageUrl,
  defaultAvatarPresetIdForUser,
  isAvatarPresetId,
  resolveAvatarPresetId,
} from "@/app/data/avatarPresets";
import { getSignUpBankById } from "@/app/data/signupMockData";
import { findDemoUserById, findDemoUserByPhone, setDemoUserAvatarPreset } from "./demoUser";

const DATA_DIR = path.join(process.cwd(), ".data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

interface UsersFileShape {
  users: StoredUser[];
}

async function ensureUsersFile(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(USERS_FILE);
  } catch {
    const empty: UsersFileShape = { users: [] };
    await fs.writeFile(USERS_FILE, JSON.stringify(empty, null, 2), "utf8");
  }
}

/**
 * อ่านรายการผู้ใช้ทั้งหมดจาก JSON
 */
export async function readAllUsers(): Promise<StoredUser[]> {
  try {
    await ensureUsersFile();
    const raw = await fs.readFile(USERS_FILE, "utf8");
    const parsed = JSON.parse(raw) as UsersFileShape;
    return Array.isArray(parsed.users) ? parsed.users : [];
  } catch {
    return [];
  }
}

async function writeAllUsers(users: StoredUser[]): Promise<void> {
  await ensureUsersFile();
  const payload: UsersFileShape = { users };
  await fs.writeFile(USERS_FILE, JSON.stringify(payload, null, 2), "utf8");
}

/**
 * ค้นหาผู้ใช้จากเบอร์โทร
 */
export async function findUserByPhone(phone: string): Promise<StoredUser | undefined> {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return undefined;
  const demo = findDemoUserByPhone(digits);
  if (demo) return demo;
  const users = await readAllUsers();
  return users.find((u) => u.phone.replace(/\D/g, "") === digits);
}

/**
 * ค้นหาผู้ใช้จาก id
 */
export async function findUserById(id: string): Promise<StoredUser | undefined> {
  const users = await readAllUsers();
  return users.find((u) => u.id === id) ?? findDemoUserById(id);
}

export interface CreateUserInput {
  phone: string;
  password: string;
  firstName: string;
  lastName: string;
  bankAccountNumber: string;
  bankId: string;
  channelId: string;
}

/**
 * สร้างบัญชีใหม่ — throw ถ้าเบอร์ซ้ำ
 */
export async function createUser(input: CreateUserInput): Promise<StoredUser> {
  const phone = input.phone.trim();
  const existing = await findUserByPhone(phone);
  if (existing) {
    throw new Error("PHONE_TAKEN");
  }

  const id = randomUUID();
  const user: StoredUser = {
    id,
    phone,
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    bankAccountNumber: input.bankAccountNumber.trim(),
    bankId: input.bankId,
    channelId: input.channelId,
    passwordHash: hashPassword(input.password),
    createdAt: new Date().toISOString(),
    avatarPresetId: defaultAvatarPresetIdForUser(id),
  };

  const users = await readAllUsers();
  users.push(user);
  await writeAllUsers(users);
  return user;
}

/**
 * แปลง StoredUser เป็นข้อมูล session ที่ปลอดภัยสำหรับ client
 */
export function toSessionUser(user: StoredUser) {
  return {
    id: user.id,
    phone: user.phone,
    firstName: user.firstName,
    lastName: user.lastName,
  };
}

/**
 * แปลง StoredUser เป็นข้อมูลโปรไฟล์สำหรับหน้า UI
 */
export function toProfileUser(user: StoredUser): ProfileUser {
  const bank = getSignUpBankById(user.bankId);
  const avatarPresetId = resolveAvatarPresetId(user.avatarPresetId, user.id);
  return {
    id: user.id,
    memberId: formatMemberId(user.id),
    displayName: formatDisplayName(user.firstName, user.id),
    phone: user.phone,
    phoneMasked: maskPhone(user.phone),
    firstName: user.firstName,
    lastName: user.lastName,
    bankId: user.bankId,
    bankLabel: bank?.label ?? user.bankId,
    bankAccountNumber: user.bankAccountNumber.replace(/\D/g, ""),
    bankAccountMasked: maskBankAccount(user.bankAccountNumber),
    createdAt: user.createdAt,
    joinedLabel: formatJoinedDate(user.createdAt),
    avatarPresetId,
    avatarUrl: avatarPresetImageUrl(avatarPresetId, 160),
  };
}

/**
 * บันทึก preset avatar — throw INVALID_PRESET / USER_NOT_FOUND
 */
export async function updateUserAvatarPreset(
  userId: string,
  avatarPresetId: string,
): Promise<StoredUser> {
  if (!isAvatarPresetId(avatarPresetId)) {
    throw new Error("INVALID_PRESET");
  }

  const demo = findDemoUserById(userId);
  if (demo) {
    setDemoUserAvatarPreset(avatarPresetId);
    return { ...demo, avatarPresetId };
  }

  const users = await readAllUsers();
  const index = users.findIndex((u) => u.id === userId);
  if (index < 0) {
    throw new Error("USER_NOT_FOUND");
  }

  users[index] = { ...users[index], avatarPresetId };
  await writeAllUsers(users);
  return users[index];
}
