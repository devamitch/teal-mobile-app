import type { StateCreator } from 'zustand';

import { z } from 'zod';

// Define theme types with Zod
export const themeSchema = z.enum(['light', 'dark', 'system']);
export type ThemeMode = z.infer<typeof themeSchema>;

// Define appearance state schema with Zod
export const appearanceStateSchema = z.object({
  appHasThemeDefined: z.boolean().optional(),
  fontSize: z.number(),
  reducedMotion: z.boolean(),
  themeMode: themeSchema,
});

export type AppearanceState = z.infer<typeof appearanceStateSchema>;

// Define appearance actions
export type AppearanceActions = {
  resetAppearance: () => void;
  setAppHasThemeDefined?: (appHasThemeDefined?: boolean) => void;
  setFontSize: (fontSize: number) => void;
  setReducedMotion: (reducedMotion: boolean) => void;
  setThemeMode: (themeMode: ThemeMode) => void;
};

export type AppearanceSlice = {
  appearance: AppearanceActions & AppearanceState;
};

// Default values
const DEFAULT_APPEARANCE: AppearanceState = {
  fontSize: 16,
  reducedMotion: false,
  themeMode: 'system',
};

export const createAppearanceSlice: StateCreator<
  AppearanceSlice,
  [],
  [],
  AppearanceSlice
> = (set) => ({
  appearance: {
    // Initial state
    ...DEFAULT_APPEARANCE,

    // Actions
    resetAppearance: () => {
      set((state) => ({
        appearance: {
          ...state.appearance,
          ...DEFAULT_APPEARANCE,
        },
      }));
    },

    setAppHasThemeDefined: (appHasThemeDefined) => {
      set((state) => ({
        appearance: {
          ...state.appearance,
          appHasThemeDefined,
        },
      }));
    },

    setFontSize: (fontSize) => {
      set((state) => ({
        appearance: {
          ...state.appearance,
          fontSize,
        },
      }));
    },
    setReducedMotion: (reducedMotion) => {
      set((state) => ({
        appearance: {
          ...state.appearance,
          reducedMotion,
        },
      }));
    },

    setThemeMode: (themeMode) => {
      set((state) => ({
        appearance: {
          ...state.appearance,
          themeMode,
        },
      }));
    },
  },
});
