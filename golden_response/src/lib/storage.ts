import type { SaveData, SettingsState } from "@/types/game";

const DB_NAME = "error-human-found";
const STORE_NAME = "saves";
const SAVE_KEY = "primary";
const SETTINGS_KEY = "ehf-settings";

export const defaultSettings: SettingsState = {
  graphics: "balanced",
  reducedMotion: false,
  masterVolume: 0.72,
  musicVolume: 0.48,
  sfxVolume: 0.62,
  scanlines: true
};

function openGameDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB is unavailable"));
      return;
    }

    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("IndexedDB open failed"));
  });
}

function transaction<T>(mode: IDBTransactionMode, handler: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return openGameDb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, mode);
        const request = handler(tx.objectStore(STORE_NAME));
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error ?? new Error("IndexedDB request failed"));
        tx.oncomplete = () => db.close();
        tx.onerror = () => {
          db.close();
          reject(tx.error ?? new Error("IndexedDB transaction failed"));
        };
      })
  );
}

export async function saveProgress(data: SaveData): Promise<void> {
  const validated = sanitizeSaveData(data);
  await transaction("readwrite", (store) => store.put(validated, SAVE_KEY));
}

export async function loadProgress(): Promise<SaveData | null> {
  try {
    const data = await transaction<SaveData | undefined>("readonly", (store) => store.get(SAVE_KEY));
    return data ? sanitizeSaveData(data) : null;
  } catch {
    return null;
  }
}

export function saveSettings(settings: SettingsState): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(sanitizeSettings(settings)));
}

export function loadSettings(): SettingsState {
  if (typeof localStorage === "undefined") return defaultSettings;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? sanitizeSettings(JSON.parse(raw) as SettingsState) : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

export function sanitizeSettings(settings: Partial<SettingsState>): SettingsState {
  const graphics = settings.graphics === "low" || settings.graphics === "ultra" || settings.graphics === "balanced" ? settings.graphics : "balanced";
  return {
    graphics,
    reducedMotion: Boolean(settings.reducedMotion),
    masterVolume: clampVolume(settings.masterVolume),
    musicVolume: clampVolume(settings.musicVolume),
    sfxVolume: clampVolume(settings.sfxVolume),
    scanlines: settings.scanlines !== false
  };
}

export function sanitizeSaveData(save: Partial<SaveData>): SaveData {
  return {
    version: 1,
    level: clampInteger(save.level, 1, 100),
    unlockedLevel: clampInteger(save.unlockedLevel, 1, 100),
    restoredLevels: Array.isArray(save.restoredLevels) ? save.restoredLevels.filter((item) => Number.isInteger(item) && item >= 1 && item <= 100) : [],
    unlockedCommands: Array.isArray(save.unlockedCommands) ? save.unlockedCommands.filter(Boolean) : ["scan"],
    achievements: Array.isArray(save.achievements) ? save.achievements : [],
    aiEvolution: clampInteger(save.aiEvolution, 0, 100),
    corruption: clampInteger(save.corruption, 0, 100),
    settings: sanitizeSettings(save.settings ?? defaultSettings),
    savedAt: typeof save.savedAt === "number" ? save.savedAt : Date.now()
  };
}

function clampVolume(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0.5;
}

function clampInteger(value: unknown, min: number, max: number): number {
  return typeof value === "number" && Number.isInteger(value) ? Math.min(max, Math.max(min, value)) : min;
}
