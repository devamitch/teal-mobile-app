/* eslint-disable no-magic-numbers */
/* eslint-disable unicorn/consistent-destructuring */
import type { StateCreator } from 'zustand';

import { InitialState } from '@react-navigation/native';
import { z } from 'zod';

// Define navigation state schema with Zod
export const navigationStateSchema = z.object({
  currentRoute: z.string().optional(),
  deepLinkUrl: z.string().optional(),
  history: z.array(z.string()).default([]),
  previousRoute: z.string().optional(),
  routeParams: z.record(z.unknown()).optional(),
});

export type NavigationState = {
  initialState?: InitialState;
} & z.infer<typeof navigationStateSchema>;

// Define navigation actions
export type NavigationActions = {
  clearHistory: () => void;
  goBack: () => string | undefined;
  setCurrentRoute: (
    route: string,
    parameters?: Record<string, unknown>,
  ) => void;
  setDeepLinkUrl: (url: string) => void;
  setInitialState: (initialState?: InitialState) => void;
};

export type NavigationSlice = {
  navigation: NavigationActions & NavigationState;
};

// Create navigation slice
export const createNavigationSlice: StateCreator<
  NavigationSlice,
  [],
  [],
  NavigationSlice
> = (set, get) => ({
  navigation: {
    // Initial state
    currentRoute: undefined,
    deepLinkUrl: undefined,
    history: [],
    previousRoute: undefined,
    routeParams: undefined,

    setInitialState(initialState) {
      set((state) => ({
        navigation: {
          ...state.navigation,
          initialState,
        },
      }));
    },

    // Actions
    clearHistory: () => {
      set((state) => ({
        navigation: {
          ...state.navigation,
          history: [],
        },
      }));
    },

    goBack: () => {
      const { history } = get().navigation;

      if (history.length === 0) {
        return undefined;
      }

      const previousRoute = history.at(-1);

      set((state) => ({
        navigation: {
          ...state.navigation,
          currentRoute: previousRoute,
          history: history.slice(0, -1),
          previousRoute: state.navigation.currentRoute,
        },
      }));

      return previousRoute;
    },

    setCurrentRoute: (route, parameters) => {
      set((state) => {
        const { currentRoute, history } = state.navigation;

        // Only update if the route actually changed
        if (
          route === currentRoute &&
          JSON.stringify(parameters) ===
            JSON.stringify(state.navigation.routeParams)
        ) {
          return state;
        }

        // Add current route to history if it exists
        const newHistory = currentRoute
          ? [...history, currentRoute].slice(-10) // keep last 10 routes
          : history;

        return {
          navigation: {
            ...state.navigation,
            currentRoute: route,
            history: newHistory,
            previousRoute: currentRoute,
            routeParams: parameters,
          },
        };
      });
    },

    setDeepLinkUrl: (deepLinkUrl) => {
      set((state) => ({
        navigation: {
          ...state.navigation,
          deepLinkUrl,
        },
      }));
    },
  },
});
