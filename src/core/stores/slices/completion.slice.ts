import {StateCreator} from 'zustand';

export interface CompletionState {
  completedItems: {[moduleId: string]: {[itemId: string]: boolean}};
  completionOrder: {[moduleId: string]: string[]};
  lastUpdated: number;
}

export interface CompletionActions {
  markItemComplete: (moduleId: string, itemId: string) => void;
  isItemComplete: (moduleId: string, itemId: string) => boolean;
  getNextItem: (
    moduleId: string,
    currentItemId: string,
    items: any[],
  ) => any | null;
  getCompletionProgress: (
    moduleId: string,
    totalItems: number,
  ) => {completed: number; total: number; percentage: number};
  clearCompletions: (moduleId?: string) => void;
  loadCompletionsFromStorage: () => Promise<void>;
  validateAndCleanCompletions: (
    moduleId: string,
    validItemIds: string[],
  ) => void;
}

export interface CompletionSlice {
  completion: CompletionState & CompletionActions;
}

const initialCompletionState: CompletionState = {
  completedItems: {},
  completionOrder: {},
  lastUpdated: 0,
};

const createCompletionSlice: StateCreator<
  CompletionSlice,
  [],
  [],
  CompletionSlice
> = (set, get) => ({
  completion: {
    ...initialCompletionState,

    markItemComplete: (moduleId: string, itemId: string) => {
      console.log('Marking item complete:', {moduleId, itemId});

      set(state => {
        const newCompletedItems = {
          ...state.completion.completedItems,
          [moduleId]: {
            ...state.completion.completedItems[moduleId],
            [itemId]: true,
          },
        };

        const newCompletionOrder = {
          ...state.completion.completionOrder,
          [moduleId]: [
            ...(state.completion.completionOrder[moduleId] || []).filter(
              id => id !== itemId,
            ),
            itemId,
          ],
        };

        return {
          completion: {
            ...state.completion,
            completedItems: newCompletedItems,
            completionOrder: newCompletionOrder,
            lastUpdated: Date.now(),
          },
        };
      });
    },

    isItemComplete: (moduleId: string, itemId: string) => {
      const state = get();
      const isComplete =
        state.completion.completedItems[moduleId]?.[itemId] || false;
      return isComplete;
    },

    getNextItem: (_moduleId: string, currentItemId: string, items: any[]) => {
      const currentIndex = items.findIndex(
        item =>
          (item.id ||
            item._number ||
            `${item._type}_${items.indexOf(item)}`) === currentItemId,
      );

      if (currentIndex === -1 || currentIndex >= items.length - 1) {
        return null; // No next item
      }

      return items[currentIndex + 1];
    },

    getCompletionProgress: (moduleId: string, totalItems: number) => {
      const state = get();
      const moduleCompletions = state.completion.completedItems[moduleId] || {};
      const completed = Object.keys(moduleCompletions).filter(
        itemId => moduleCompletions[itemId],
      ).length;

      return {
        completed,
        total: totalItems,
        percentage:
          totalItems > 0 ? Math.round((completed / totalItems) * 100) : 0,
      };
    },

    clearCompletions: (moduleId?: string) => {
      set(state => {
        if (moduleId) {
          const newCompletedItems = {...state.completion.completedItems};
          const newCompletionOrder = {...state.completion.completionOrder};
          delete newCompletedItems[moduleId];
          delete newCompletionOrder[moduleId];

          return {
            completion: {
              ...state.completion,
              completedItems: newCompletedItems,
              completionOrder: newCompletionOrder,
              lastUpdated: Date.now(),
            },
          };
        } else {
          return {
            completion: {
              ...state.completion,
              completedItems: {},
              completionOrder: {},
              lastUpdated: Date.now(),
            },
          };
        }
      });
    },

    loadCompletionsFromStorage: async () => {
      // This is now handled by Zustand persistence automatically
      // No need for manual loading since the store will be hydrated on startup
      console.log('Completions loaded from persistence layer');
    },

    validateAndCleanCompletions: (moduleId: string, validItemIds: string[]) => {
      set(state => {
        const moduleCompletions =
          state.completion.completedItems[moduleId] || {};
        const cleanedCompletions: {[itemId: string]: boolean} = {};

        // Keep only completions for valid item IDs
        validItemIds.forEach(itemId => {
          if (moduleCompletions[itemId]) {
            cleanedCompletions[itemId] = moduleCompletions[itemId];
          }
        });

        // Log removed invalid completions
        const removedCompletions = Object.keys(moduleCompletions).filter(
          itemId => !validItemIds.includes(itemId),
        );

        if (removedCompletions.length > 0) {
          console.warn(
            `[CompletionSlice] Removing invalid completions for module ${moduleId}:`,
            removedCompletions,
          );
        }

        return {
          completion: {
            ...state.completion,
            completedItems: {
              ...state.completion.completedItems,
              [moduleId]: cleanedCompletions,
            },
            lastUpdated: Date.now(),
          },
        };
      });
    },
  },
});

export default createCompletionSlice;
