import { loadFromIndexedDb, saveToIndexedDb } from "@/lib/indexedDb";
import type { SavePayload } from "@/types/game";

const LOCAL_KEY = "error-human-found-save";

export async function initializePersistence() {
  if (typeof window === "undefined") {
    return null;
  }

  const localSave = loadFromLocalStorage();
  const indexedSave = await loadFromIndexedDb().catch(() => null);

  if (!localSave) {
    return indexedSave;
  }

  if (!indexedSave) {
    return localSave;
  }

  return localSave.lastSavedAt >= indexedSave.lastSavedAt ? localSave : indexedSave;
}

export async function persistGame(payload: SavePayload) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(LOCAL_KEY, JSON.stringify(payload));
  await saveToIndexedDb(payload).catch(() => undefined);
}

export function loadFromLocalStorage(): SavePayload | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(LOCAL_KEY);
    return raw ? (JSON.parse(raw) as SavePayload) : null;
  } catch {
    return null;
  }
}

export function clearLocalSave() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(LOCAL_KEY);
  }
}
