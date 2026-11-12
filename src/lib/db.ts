import { openDB, DBSchema, IDBPDatabase } from "idb";
import { Birthday } from "../types";

interface BirthdaysDB extends DBSchema {
  birthdays: {
    key: string;
    value: Birthday;
    indexes: { "by-date": string };
  };
}

let dbPromise: Promise<IDBPDatabase<BirthdaysDB>> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<BirthdaysDB>("my-birthdays-app", 1, {
      upgrade(db) {
        const store = db.createObjectStore("birthdays", { keyPath: "id" });
        store.createIndex("by-date", "date");
      },
    });
  }
  return dbPromise;
}

export async function getAllBirthdays(): Promise<Birthday[]> {
  const db = await getDB();
  return db.getAll("birthdays");
}

export async function addBirthday(birthday: Birthday): Promise<void> {
  const db = await getDB();
  await db.put("birthdays", birthday);
}

export async function deleteBirthday(id: string): Promise<void> {
  const db = await getDB();
  await db.delete("birthdays", id);
}

export async function updateBirthday(birthday: Birthday): Promise<void> {
  const db = await getDB();
  await db.put("birthdays", birthday);
}

export async function countBirthdays(): Promise<number> {
  const db = await getDB();
  return db.count("birthdays");
}
