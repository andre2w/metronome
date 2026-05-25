import { StateStorage } from "zustand/middleware";

export const queryParamsStorage: StateStorage = {
  getItem: (key): string => {
    const urlSearchParams = new URLSearchParams(window.location.hash.substring(1));
    const value = urlSearchParams.get(key);
    return value ?? "";
  },
  setItem: (key, newValue): void => {
    const urlSearchParams = new URLSearchParams(window.location.hash.substring(1));
    urlSearchParams.set(key, JSON.stringify(newValue));
    location.hash = urlSearchParams.toString();
  },
  removeItem: (key): void => {
    const urlSearchParams = new URLSearchParams(window.location.hash.substring(1));
    urlSearchParams.delete(key);
    location.hash = urlSearchParams.toString();
  },
};
