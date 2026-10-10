import type { StateCreator } from 'zustand';

import { z } from 'zod';

// Define network state schema with Zod
export const networkStateSchema = z.object({
  connectionType: z.string().optional(),
  isInternetReachable: z.boolean().optional(),
  isOnline: z.boolean(),
  lastSyncTime: z.number().optional(),
});

export type NetworkState = z.infer<typeof networkStateSchema>;

// Define network actions
export type NetworkActions = {
  setIsOnline: (isOnline: boolean) => void;
  setLastSyncTime: (time: number) => void;
  setNetworkStatus: (status: Partial<NetworkState>) => void;
};

export type NetworkSlice = {
  network: NetworkActions & NetworkState;
};

// Create network slice
export const createNetworkSlice: StateCreator<
  NetworkSlice,
  [],
  [],
  NetworkSlice
> = (set) => ({
  network: {
    // Initial state
    isInternetReachable: true,
    isOnline: true,

    // Actions
    setIsOnline: (isOnline) => {
      set((state) => ({
        network: {
          ...state.network,
          isOnline,
        },
      }));
    },

    setLastSyncTime: (lastSyncTime) => {
      set((state) => ({
        network: {
          ...state.network,
          lastSyncTime,
        },
      }));
    },

    setNetworkStatus: (status) => {
      set((state) => ({
        network: {
          ...state.network,
          ...status,
        },
      }));
    },
  },
});
