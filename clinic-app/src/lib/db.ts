import { Capacitor } from "@capacitor/core";
import { CapacitorSQLite, SQLiteConnection, type SQLiteDBConnection } from "@capacitor-community/sqlite";
import { initialDrugs, type Drug } from "./drugData";

/* ------------------------------------------------------------------ */
/*  الأنواع                                                            */
/* ------------------------------------------------------------------ */

export interface Patient {
  id: string;
  name: string;
  age: string;
  gender: string;
  phone: string;
  diagnosis: string;
  allergies: string;
  notes: string;
  lastVisit: string;
}

export type { Drug };

export interface SavedPrescription {
  id: string;
  date: string;
  patientName: string;
  data: string; // JSON كامل للوصفة
  createdAt: string;
}

/* ------------------------------------------------------------------ */
/*  تعريف الجداول                                                      */
/* ------------------------------------------------------------------ */

const DB_NAME = "clinic";

const COLUMNS = {
  patients: ["id", "name", "age", "gender", "phone", "diagnosis", "allergies", "notes", "lastVisit"],
  drugs: ["id", "nameAr", "nameEn", "activeIngredients", "form", "strength", "indications", "sideEffects", "warnings"],
  prescriptions: ["id", "date", "patientName", "data", "createdAt"],
} as const;

type TableName = keyof typeof COLUMNS;

const SCHEMA = `
CREATE TABLE IF NOT EXISTS patients (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL DEFAULT '',
  age TEXT NOT NULL DEFAULT '',
  gender TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  diagnosis TEXT NOT NULL DEFAULT '',
  allergies TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  lastVisit TEXT NOT NULL DEFAULT ''
);
CREATE TABLE IF NOT EXISTS drugs (
  id TEXT PRIMARY KEY NOT NULL,
  nameAr TEXT NOT NULL DEFAULT '',
  nameEn TEXT NOT NULL DEFAULT '',
  activeIngredients TEXT NOT NULL DEFAULT '',
  form TEXT NOT NULL DEFAULT '',
  strength TEXT NOT NULL DEFAULT '',
  indications TEXT NOT NULL DEFAULT '',
  sideEffects TEXT NOT NULL DEFAULT '',
  warnings TEXT NOT NULL DEFAULT ''
);
CREATE TABLE IF NOT EXISTS prescriptions (
  id TEXT PRIMARY KEY NOT NULL,
  date TEXT NOT NULL DEFAULT '',
  patientName TEXT NOT NULL DEFAULT '',
  data TEXT NOT NULL DEFAULT '',
  createdAt TEXT NOT NULL DEFAULT ''
);
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY NOT NULL,
  value TEXT NOT NULL DEFAULT ''
);
`;

/* ------------------------------------------------------------------ */
/*  الاتصال: SQLite على الجهاز، و localStorage عند التشغيل في المتصفح  */
/* ------------------------------------------------------------------ */

const isNative = Capacitor.isNativePlatform();

let conn: SQLiteDBConnection | null = null;
let initPromise: Promise<void> | null = null;

async function openNative(): Promise<void> {
  const sqlite = new SQLiteConnection(CapacitorSQLite);
  const consistency = (await sqlite.checkConnectionsConsistency()).result;
  const exists = (await sqlite.isConnection(DB_NAME, false)).result;

  if (consistency && exists) {
    conn = await sqlite.retrieveConnection(DB_NAME, false);
  } else {
    conn = await sqlite.createConnection(DB_NAME, false, "no-encryption", 1, false);
  }
  await conn.open();
  await conn.execute(SCHEMA);
}

/* ---------- عمليات خام ---------- */

async function rawAll<T>(table: TableName): Promise<T[]> {
  if (isNative) {
    const res = await conn!.query(`SELECT * FROM ${table}`);
    return (res.values ?? []) as T[];
  }
  try {
    return JSON.parse(localStorage.getItem(`db_${table}`) || "[]") as T[];
  } catch {
    return [];
  }
}

async function rawUpsert<T extends { id: string }>(table: TableName, row: T): Promise<void> {
  if (isNative) {
    const cols = COLUMNS[table];
    const placeholders = cols.map(() => "?").join(",");
    const values = cols.map((c) => String((row as unknown as Record<string, unknown>)[c] ?? ""));
    await conn!.run(
      `INSERT OR REPLACE INTO ${table} (${cols.join(",")}) VALUES (${placeholders})`,
      values
    );
    return;
  }
  const all = await rawAll<T>(table);
  const idx = all.findIndex((r) => r.id === row.id);
  if (idx >= 0) all[idx] = row;
  else all.push(row);
  localStorage.setItem(`db_${table}`, JSON.stringify(all));
}

async function rawRemove(table: TableName, id: string): Promise<void> {
  if (isNative) {
    await conn!.run(`DELETE FROM ${table} WHERE id = ?`, [id]);
    return;
  }
  const all = await rawAll<{ id: string }>(table);
  localStorage.setItem(`db_${table}`, JSON.stringify(all.filter((r) => r.id !== id)));
}

/* ---------- الإعدادات (مفتاح / قيمة) ---------- */

export async function getSetting(key: string): Promise<string | null> {
  if (isNative) {
    const res = await conn!.query("SELECT value FROM settings WHERE key = ?", [key]);
    const row = res.values?.[0];
    return row ? (row.value as string) : null;
  }
  return localStorage.getItem(`db_setting_${key}`);
}

export async function setSetting(key: string, value: string): Promise<void> {
  if (isNative) {
    await conn!.run("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)", [key, value]);
    return;
  }
  localStorage.setItem(`db_setting_${key}`, value);
}

/* ------------------------------------------------------------------ */
/*  التهيئة                                                            */
/* ------------------------------------------------------------------ */

export function initDb(): Promise<void> {
  if (!initPromise) {
    initPromise = (async () => {
      if (isNative) await openNative();

      // إضافة الأدوية الأولية مرة واحدة فقط (حتى لا تعود بعد حذفها)
      const seeded = await getSetting("drugsSeeded");
      if (!seeded) {
        const existing = await rawAll<Drug>("drugs");
        if (existing.length === 0) {
          for (const d of initialDrugs) await rawUpsert("drugs", d);
        }
        await setSetting("drugsSeeded", "1");
      }
    })();
  }
  return initPromise;
}

/* ------------------------------------------------------------------ */
/*  واجهات الاستخدام                                                   */
/* ------------------------------------------------------------------ */

export const patientsDb = {
  list: () => rawAll<Patient>("patients"),
  save: (p: Patient) => rawUpsert("patients", p),
  remove: (id: string) => rawRemove("patients", id),
};

export const drugsDb = {
  list: () => rawAll<Drug>("drugs"),
  save: (d: Drug) => rawUpsert("drugs", d),
  remove: (id: string) => rawRemove("drugs", id),
};

export const prescriptionsDb = {
  list: () => rawAll<SavedPrescription>("prescriptions"),
  async add(data: { date?: string; patientName?: string }): Promise<void> {
    await rawUpsert<SavedPrescription>("prescriptions", {
      id: Date.now().toString(),
      date: data.date ?? "",
      patientName: data.patientName ?? "",
      data: JSON.stringify(data),
      createdAt: new Date().toISOString(),
    });
  },
};

export async function getCounts(): Promise<{ drugs: number; patients: number; prescriptionsThisMonth: number }> {
  const [drugs, patients, prescriptions] = await Promise.all([
    drugsDb.list(),
    patientsDb.list(),
    prescriptionsDb.list(),
  ]);
  const month = new Date().toISOString().slice(0, 7); // YYYY-MM
  return {
    drugs: drugs.length,
    patients: patients.length,
    prescriptionsThisMonth: prescriptions.filter((p) => p.createdAt.startsWith(month)).length,
  };
}
