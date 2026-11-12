import type { Birthday, Category } from "../types";
import { addBirthday, getAllBirthdays } from "./db";

const CATEGORIES: Category[] = ["family", "work", "friends", "school", "vip", "acquaintances", "partners", "other"];
const MAX_BYTES = 5 * 1024 * 1024;
const MAX_ITEMS = 5000;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function isBirthday(value: unknown): value is Birthday {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const b = value as Record<string, unknown>;
  if (typeof b.id !== "string" || !b.id.trim() || b.id.length > 200) return false;
  if (typeof b.name !== "string" || !b.name.trim() || b.name.length > 500) return false;
  if (typeof b.date !== "string" || !DATE_PATTERN.test(b.date)) return false;
  const [year, month, day] = b.date.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (!Number.isInteger(year) || year < 1 || year > 9999 ||
      date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return false;
  if (!CATEGORIES.includes(b.category as Category)) return false;
  if (typeof b.createdAt !== "number" || !Number.isFinite(b.createdAt)) return false;
  if (b.notes !== undefined && (typeof b.notes !== "string" || b.notes.length > 10000)) return false;
  return true;
}

export async function downloadBirthdayBackup(): Promise<number> {
  const birthdays = await getAllBirthdays();
  const backup = { app: "my-birthdays", version: 1, exportedAt: new Date().toISOString(), birthdays };
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  try {
    const link = document.createElement("a");
    link.href = url;
    link.download = `my-birthdays-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.append(link);
    link.click();
    link.remove();
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return birthdays.length;
}

export async function importBirthdayBackup(file: File): Promise<{ added: number; skipped: number }> {
  if (file.size > MAX_BYTES) throw new Error("This backup file is too large (maximum 5 MB).");
  let parsed: unknown;
  try { parsed = JSON.parse(await file.text()); }
  catch { throw new Error("This isn't a valid JSON backup file."); }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("This isn't a My Birthdays backup.");
  }
  const data = parsed as Record<string, unknown>;
  if (data.app !== "my-birthdays" || data.version !== 1 || !Array.isArray(data.birthdays)) {
    throw new Error("Choose a My Birthdays backup created with Export backup.");
  }
  if (data.birthdays.length > MAX_ITEMS) throw new Error("This backup contains too many entries.");
  if (!data.birthdays.every(isBirthday)) throw new Error("The backup has invalid birthday records. Nothing was imported.");
  const existing = new Set((await getAllBirthdays()).map(b => b.id));
  let added = 0;
  let skipped = 0;
  for (const birthday of data.birthdays as Birthday[]) {
    if (existing.has(birthday.id)) { skipped++; continue; }
    await addBirthday(birthday);
    existing.add(birthday.id);
    added++;
  }
  return { added, skipped };
}
