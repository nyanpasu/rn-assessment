import { MMKV } from 'react-native-mmkv';
import { useMMKVBoolean } from 'react-native-mmkv';
import type { StateStorage } from "zustand/middleware";

export const storage = new MMKV();

/**
 * Zustand uses `localStorage` by default, which doesn't exist in React Native.
 * Thus we create an adapter with MMKV instead.
 * https://zustand.docs.pmnd.rs/integrations/persisting-store-data
 * https://github.com/mrousavy/react-native-mmkv/blob/main/docs/WRAPPER_ZUSTAND_PERSIST_MIDDLEWARE.md
 */
export const zustandMMKVStorage: StateStorage = {
  setItem: (name, value) => {
    return storage.set(name, value);
  },
  getItem: (name) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: (name) => {
    return storage.delete(name);
  },
};

/**
 * Export storage with wrappers to guarantee type safety & key consistency.
 */
export const mmkvStorage = {
  hasOnboarded: {
    key: "hasOnboarded",
    defaultValue: false,
    get: () =>
      storage.getBoolean(mmkvStorage.hasOnboarded.key) ??
      mmkvStorage.hasOnboarded.defaultValue,
    set: (value: boolean) => storage.set(mmkvStorage.hasOnboarded.key, value),
  },
} as const;

/**
 * Export the storage in hook format so it can be used reactively.
 */
export const useMMKVStorage = () => {
  const hasOnboarded = useMMKVBoolean(mmkvStorage.hasOnboarded.key, storage);

  return {
    hasOnboarded: {
      get: () => hasOnboarded[0] ?? mmkvStorage.hasOnboarded.defaultValue,
      set: hasOnboarded[1],
    },
  };
};
