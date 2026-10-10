/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import type { StateCreator } from 'zustand';

import { z } from 'zod';

// Define query state schema with Zod
export const queryStateSchema = z.object({
  // Store items as a record of string keys to string values
  items: z.record(z.string(), z.string()).default({}),
  // Track last sync time
  lastSyncTime: z.number().optional(),
});

export type QueryState = z.infer<typeof queryStateSchema>;

export type QueryActions = {
  clear: () => void;
  getAllKeys: () => string[];
  getItem: (key: string) => null | string;
  removeItem: (key: string) => void;
  setItem: (key: string, value: string) => void;
  setLastSyncTime: (time: number) => void;
};

export type QuerySlice = {
  query: QueryActions & QueryState;
};

// Create query slice
export const createQuerySlice: StateCreator<QuerySlice, [], [], QuerySlice> = (
  set,
  get,
) => ({
  query: {
    // Initial state
    items: {},
    lastSyncTime: undefined,

    // Actions
    clear: () => {
      set((state) => ({
        query: {
          ...state.query,
          items: {},
        },
      }));
    },

    getAllKeys: () => {
      return Object.keys(get().query.items);
    },

    getItem: (key) => {
      const value = get().query.items[key];
      return value ?? undefined;
    },

    removeItem: (key) => {
      set((state) => {
        // Create a new items object without the specified key
        const { [key]: removed, ...remainingItems } = state.query.items;

        return {
          query: {
            ...state.query,
            items: remainingItems,
          },
        };
      });
    },

    setItem: (key, value) => {
      set((state) => ({
        query: {
          ...state.query,
          items: {
            ...state.query.items,
            [key]: value,
          },
        },
      }));
    },

    setLastSyncTime: (lastSyncTime) => {
      set((state) => ({
        query: {
          ...state.query,
          lastSyncTime,
        },
      }));
    },
  },
});
