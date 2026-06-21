import { StateStorage } from "zustand/middleware";

export function createTestStorage(): StateStorage {
  const storage = new Map<string, string>();
  return {
    getItem: (key) => {
      return storage.get(key) ?? "";
    },
    removeItem: (key) => {
      storage.delete(key);
    },
    setItem: (key, value) => {
      storage.set(key, JSON.stringify(value));
    },
  };
}
