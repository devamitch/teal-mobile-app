/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable unicorn/no-null */
import type { StateStorage } from 'zustand/middleware';

import { Platform } from 'react-native';
import { MMKV } from 'react-native-mmkv';

// Create a single source of truth MMKV instance
export const storage = new MMKV({
  encryptionKey: 'q234234',
  id: 'aura-wellness-storage',
});

// Zustand storage adapter
export const zustandStorage: StateStorage = {
  getItem: (name: string): Promise<null | string> => {
    const value = storage.getString(name);
    return Promise.resolve(value ?? null);
  },
  removeItem: (name: string): Promise<void> => {
    storage.delete(name);
    return Promise.resolve();
  },
  setItem: (name: string, value: string): Promise<void> => {
    storage.set(name, value);
    return Promise.resolve();
  },
};

// Create namespaced storage but still using the same MMKV instance
export const createNamespacedStorage = (namespace: string) => {
  return {
    getAllKeys: (): string[] => {
      const allKeys = storage.getAllKeys();
      return allKeys
        .filter((key) => key.startsWith(`${namespace}:`))
        .map((key) => key.replace(`${namespace}:`, ''));
    },
    getItem: (key: string): null | string => {
      const namespacedKey = `${namespace}:${key}`;
      return storage.getString(namespacedKey) ?? null;
    },
    removeItem: (key: string): void => {
      const namespacedKey = `${namespace}:${key}`;
      storage.delete(namespacedKey);
    },
    setItem: (key: string, value: string): void => {
      const namespacedKey = `${namespace}:${key}`;
      storage.set(namespacedKey, value);
    },
  };
};

// React Query storage adapter
export const createMMKVQueryStorageAdapter = (namespace = 'react-query') => {
  const namespacedStorage = createNamespacedStorage(namespace);

  return {
    getItem: (key: string): null | string => {
      return namespacedStorage.getItem(key);
    },
    removeItem: (key: string): void => {
      namespacedStorage.removeItem(key);
    },
    setItem: (key: string, value: string): void => {
      namespacedStorage.setItem(key, value);
    },
  };
};

// Navigation state persistence adapter
export const navigationStorage = {
  getItem: (key: string): Promise<null | string> => {
    const value = storage.getString(`navigation:${key}`);
    return Promise.resolve(value ?? null);
  },
  removeItem: (key: string): Promise<void> => {
    storage.delete(`navigation:${key}`);
    return Promise.resolve();
  },
  setItem: (key: string, value: string): Promise<void> => {
    storage.set(`navigation:${key}`, value);
    return Promise.resolve();
  },
};

// Secure storage for sensitive data
export const secureStorage = Platform.select({
  // On real implementation this would use a more secure storage mechanism
  // For this example, we're still using MMKV but with a different namespace
  default: {
    getItem: (key: string): null | string => {
      return storage.getString(`secure:${key}`) ?? null;
    },
    removeItem: (key: string): void => {
      storage.delete(`secure:${key}`);
    },
    setItem: (key: string, value: string): void => {
      storage.set(`secure:${key}`, value);
    },
  },
});

// SQLite adapter (placeholder)
export const sqliteStorage = {
  // In a real implementation, this would interact with react-native-sqlite-storage
  // For this example, we're still using MMKV with a SQLite prefix
  execute: (query: string, parameters: any[] = []): Promise<any> => {
    console.log('SQLite query', query, parameters);
    // Placeholder implementation
    return Promise.resolve({ rows: { _array: [], length: 0 } });
  },
  // Store query results in MMKV for offline access
  cacheQueryResult: (queryId: string, result: any): void => {
    storage.set(`sqlite:${queryId}`, JSON.stringify(result));
  },
  getCachedQueryResult: (queryId: string): any | null => {
    const cached = storage.getString(`sqlite:${queryId}`);
    return cached ? JSON.parse(cached) : null;
  },
};

// Helper functions
export const storageHelpers = {
  clear: (preserveKeys: string[] = []): void => {
    if (preserveKeys.length === 0) {
      storage.clearAll();
      return;
    }

    // Preserve specified keys
    const preservedValues = new Map<string, string | undefined>();

    for (const key of preserveKeys) {
      preservedValues.set(key, storage.getString(key));
    }

    storage.clearAll();

    for (const [key, value] of preservedValues.entries()) {
      if (value !== undefined) {
        storage.set(key, value);
      }
    }
  },
  getAllKeys: (): string[] => {
    return storage.getAllKeys();
  },
};
