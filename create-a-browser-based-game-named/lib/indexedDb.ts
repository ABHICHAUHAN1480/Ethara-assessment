import type { SavePayload } from "@/types/game";

const DB_NAME = "error-human-found";
const DB_VERSION = 1;
const STORE_NAME = "saves";
const SAVE_KEY = "autosave";

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveToIndexedDb(payload: SavePayload) {
  if (typeof indexedDB === "undefined") {
    return;
  }

  const db = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    store.put(payload, SAVE_KEY);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
  db.close();
}

export async function loadFromIndexedDb(): Promise<SavePayload | null> {
  if (typeof indexedDB === "undefined") {
    return null;
  }

  const db = await openDatabase();
  const payload = await new Promise<SavePayload | null>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(SAVE_KEY);
    request.onsuccess = () => resolve((request.result as SavePayload | undefined) ?? null);
    request.onerror = () => reject(request.error);
  });
  db.close();
  return payload;
}
