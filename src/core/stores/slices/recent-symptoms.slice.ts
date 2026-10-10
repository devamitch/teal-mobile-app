import {StateCreator} from 'zustand';
import {storage} from '../../storage/mmkv';

const MAX_RECENT = 15;
const EMOJI_RESET_DURATION = 3 * 60 * 1000; // 3 minutes in milliseconds

export interface SymptomUsage {
  count: number;
  lastUsed: number; // timestamp
}

export interface RecentSymptom {
  name: string;
  type: 'physical' | 'psychological';
}
function normalizeSymptomName(name: string): string {
  return name.trim().toLowerCase();
}
export interface SymptomCount {
  [symptom: string]: {
    count: number;
    timestamp: Date;
  };
}

export interface DailySymptomData {
  date: string; // YYYY-MM-DD format
  symptomsCount: {
    'Physical Symptom': Record<string | number, number>;
    'Psychological Symptom': Record<string | number, number>;
    Mood: Record<string | number, number>;
    'Critical Symptom': Record<string | number, number>;
  };
}

export interface EmojiMoodData {
  currentMood: string;
  setAt: number; // timestamp when mood was set
  resetAt: number; // timestamp when mood should reset
}

export interface SymptomState {
  recentSymptoms: RecentSymptom[]; // Unified list of recent symptoms
  // Usage tracking for smart replacement
  symptomUsage: Record<string, SymptomUsage>;
  // Daily persisted data
  dailySymptomsCount: {
    'Physical Symptom': Record<string | number, number>;
    'Psychological Symptom': Record<string | number, number>;
    Mood: Record<string | number, number>;
    'Critical Symptom': Record<string | number, number>;
  };
  // Current emoji/mood state
  currentMood: string;
  emojiResetTimeout: NodeJS.Timeout | null;
  // Custom symptoms persistence
  customPhysicalSymptoms: string[];
  customPsychologicalSymptoms: string[];
}

export interface SymptomAction {
  addRecentSymptom: (
    symptom: string,
    type: 'physical' | 'psychological',
  ) => void;
  getRecentSymptoms: () => RecentSymptom[];
  getRecentPhysical: () => string[];
  getRecentPsychological: () => string[];
  loadRecentSymptomsFromStorage: () => void;
  // Daily symptoms management
  updateDailySymptomCount: (
    symptomType:
      | 'Physical Symptom'
      | 'Psychological Symptom'
      | 'Mood'
      | 'Critical Symptom',
    symptom: string | number,
    count: number,
  ) => void;
  loadDailySymptomsFromStorage: () => void;
  resetDailySymptoms: () => void;
  // Emoji/mood management
  setCurrentMood: (moodId: string) => void;
  resetCurrentMood: () => void;
  loadEmojiStateFromStorage: () => void;
  clearEmojiTimeout: () => void;
  resetAllSymptoms: () => void;
  // Custom symptoms management
  addCustomSymptom: (
    symptom: string,
    type: 'physical' | 'psychological',
  ) => void;
  getCustomPhysicalSymptoms: () => string[];
  getCustomPsychologicalSymptoms: () => string[];
  loadCustomSymptomsFromStorage: () => void;
  // Legacy compatibility
  addRecentPhysical: (symptom: string) => void;
  addRecentPsychological: (symptom: string) => void;
}

export interface SymptomSlice {
  recent_symptom: SymptomState & SymptomAction;
}

const symptomInitialSlice: SymptomState = {
  recentSymptoms: [],
  symptomUsage: {},
  dailySymptomsCount: {
    'Physical Symptom': {},
    'Psychological Symptom': {},
    Mood: {},
    'Critical Symptom': {},
  },
  currentMood: '',
  emojiResetTimeout: null,
  customPhysicalSymptoms: [],
  customPsychologicalSymptoms: [],
};

// Helper functions
const getTodayDateString = (): string => {
  const now = new Date();
  return now.toISOString().split('T')[0] as string; // YYYY-MM-DD format
};

const getDailySymptomStorageKey = (date: string): string => {
  return `daily_symptoms_${date}`;
};

const getEmojiMoodStorageKey = (): string => {
  return 'emoji_mood_state';
};

const getRecentSymptomsStorageKey = (): string => {
  return 'recent_symptoms_unified';
};

const getCustomSymptomsStorageKey = (): string => {
  return 'custom_symptoms_persistent';
};

// Smart symptom management - if we're at capacity, replace the least used one
const smartAddSymptom = (
  currentList: RecentSymptom[],
  currentUsage: Record<string, SymptomUsage>,
  newSymptom: string,
  symptomType: 'physical' | 'psychological',
): {
  updatedList: RecentSymptom[];
  updatedUsage: Record<string, SymptomUsage>;
} => {
  const now = Date.now();

  // Update or create usage for the new symptom
  const updatedUsage = {
    ...currentUsage,
    [newSymptom]: {
      count: (currentUsage[newSymptom]?.count || 0) + 1,
      lastUsed: now,
    },
  };

  // If symptom already exists, move it to front
  const existingIndex = currentList.findIndex(s => s.name === newSymptom);
  if (existingIndex >= 0) {
    const updatedList = [
      {name: newSymptom, type: symptomType},
      ...currentList.filter(s => s.name !== newSymptom),
    ];
    return {
      updatedList,
      updatedUsage,
    };
  }

  // If we haven't reached the limit, just add it
  if (currentList.length < MAX_RECENT) {
    return {
      updatedList: [{name: newSymptom, type: symptomType}, ...currentList],
      updatedUsage,
    };
  }

  // We're at capacity - find the least used symptom to replace
  const symptomsWithUsage = currentList.map(symptom => ({
    symptom: symptom.name,
    type: symptom.type,
    usage: currentUsage[symptom.name] || {count: 1, lastUsed: 0},
  }));

  // Sort by usage count (ascending) and lastUsed (ascending for tie-breaking)
  symptomsWithUsage.sort((a, b) => {
    if (a.usage.count !== b.usage.count) {
      return a.usage.count - b.usage.count;
    }
    return a.usage.lastUsed - b.usage.lastUsed;
  });

  // Remove the least used symptom
  const leastUsedSymptom = symptomsWithUsage[0];
  if (!leastUsedSymptom) {
    // Fallback: just add to front and slice if this shouldn't happen
    return {
      updatedList: [
        {name: newSymptom, type: symptomType},
        ...currentList,
      ].slice(0, MAX_RECENT),
      updatedUsage,
    };
  }

  const symptomToRemove = leastUsedSymptom.symptom;
  const {[symptomToRemove]: removed, ...remainingUsage} = updatedUsage;

  return {
    updatedList: [
      {name: newSymptom, type: symptomType},
      ...currentList.filter(s => s.name !== symptomToRemove),
    ],
    updatedUsage: remainingUsage,
  };
};

const createRecentSymptomSlice: StateCreator<
  SymptomSlice,
  [],
  [],
  SymptomSlice
> = (set, get) => ({
  recent_symptom: {
    ...symptomInitialSlice,

    resetAllSymptoms: () => {
      set(state => ({
        recent_symptom: {
          ...state.recent_symptom,
          ...symptomInitialSlice,
        },
      }));

      // Clear from storage
      try {
        storage.delete(getRecentSymptomsStorageKey());
      } catch (error) {
        console.error('Error clearing recent symptoms from storage:', error);
      }
    },

    loadRecentSymptomsFromStorage: () => {
      try {
        const symptomsData = storage.getString(getRecentSymptomsStorageKey());
        let symptoms: RecentSymptom[] = [];
        let usage: Record<string, SymptomUsage> = {};

        if (symptomsData) {
          const parsed = JSON.parse(symptomsData);
          symptoms = parsed.symptoms || [];
          usage = parsed.usage || {};
        }

        set(state => ({
          recent_symptom: {
            ...state.recent_symptom,
            recentSymptoms: symptoms,
            symptomUsage: usage,
          },
        }));
      } catch (error) {
        console.error('Error loading recent symptoms from storage:', error);
      }
    },

    addRecentSymptom: (symptom: string, type: 'physical' | 'psychological') => {
      const normalizedSymptom = normalizeSymptomName(symptom);
      const current = get().recent_symptom;
      const {updatedList, updatedUsage} = smartAddSymptom(
        current.recentSymptoms,
        current.symptomUsage,
        normalizedSymptom, // always use normalized name
        type,
      );
      // The rest is unchanged, just ensure everywhere you look up by normalized name!
      set(state => ({
        recent_symptom: {
          ...state.recent_symptom,
          recentSymptoms: updatedList,
          symptomUsage: updatedUsage,
        },
      }));

      // Persist to storage
      try {
        storage.set(
          getRecentSymptomsStorageKey(),
          JSON.stringify({
            symptoms: updatedList,
            usage: updatedUsage,
          }),
        );
      } catch (error) {
        console.error('Error saving recent symptoms to storage:', error);
      }
    },

    getRecentSymptoms: () => {
      const current = get().recent_symptom;
      // Sort symptoms by usage frequency (most used first), then by last used time
      // Create a copy of the array before sorting to avoid mutating the original
      return [...current.recentSymptoms].sort((a, b) => {
        const aUsage = current.symptomUsage[a.name] || {count: 0, lastUsed: 0};
        const bUsage = current.symptomUsage[b.name] || {count: 0, lastUsed: 0};

        // Primary sort: by usage count (descending - most used first)
        if (aUsage.count !== bUsage.count) {
          return bUsage.count - aUsage.count;
        }

        // Secondary sort: by last used time (descending - most recent first)
        return bUsage.lastUsed - aUsage.lastUsed;
      });
    },

    getRecentPhysical: () => {
      const current = get().recent_symptom;
      return [...current.recentSymptoms]
        .filter(s => s.type === 'physical')
        .sort((a, b) => {
          const aUsage = current.symptomUsage[a.name] || {
            count: 0,
            lastUsed: 0,
          };
          const bUsage = current.symptomUsage[b.name] || {
            count: 0,
            lastUsed: 0,
          };

          // Primary sort: by usage count (descending - most used first)
          if (aUsage.count !== bUsage.count) {
            return bUsage.count - aUsage.count;
          }

          // Secondary sort: by last used time (descending - most recent first)
          return bUsage.lastUsed - aUsage.lastUsed;
        })
        .map(s => s.name);
    },

    getRecentPsychological: () => {
      const current = get().recent_symptom;
      return [...current.recentSymptoms]
        .filter(s => s.type === 'psychological')
        .sort((a, b) => {
          const aUsage = current.symptomUsage[a.name] || {
            count: 0,
            lastUsed: 0,
          };
          const bUsage = current.symptomUsage[b.name] || {
            count: 0,
            lastUsed: 0,
          };

          // Primary sort: by usage count (descending - most used first)
          if (aUsage.count !== bUsage.count) {
            return bUsage.count - aUsage.count;
          }

          // Secondary sort: by last used time (descending - most recent first)
          return bUsage.lastUsed - aUsage.lastUsed;
        })
        .map(s => s.name);
    },

    // Legacy compatibility methods
    addRecentPhysical: (symptom: string) => {
      get().recent_symptom.addRecentSymptom(symptom, 'physical');
    },

    addRecentPsychological: (symptom: string) => {
      get().recent_symptom.addRecentSymptom(symptom, 'psychological');
    },

    updateDailySymptomCount: (symptomType, symptom, count) => {
      const today = getTodayDateString();

      set(state => {
        const newDailySymptomsCount = {
          ...state.recent_symptom.dailySymptomsCount,
          [symptomType]: {
            ...state.recent_symptom.dailySymptomsCount[symptomType],
            [symptom]: count,
          },
        };

        // Save to MMKV storage
        const dailyData: DailySymptomData = {
          date: today,
          symptomsCount: newDailySymptomsCount,
        };

        try {
          storage.set(
            getDailySymptomStorageKey(today),
            JSON.stringify(dailyData),
          );
        } catch (error) {
          console.error('Error saving daily symptoms to storage:', error);
        }

        return {
          recent_symptom: {
            ...state.recent_symptom,
            dailySymptomsCount: newDailySymptomsCount,
          },
        };
      });
    },

    loadDailySymptomsFromStorage: () => {
      const today = getTodayDateString();

      try {
        const storedData = storage.getString(getDailySymptomStorageKey(today));

        if (storedData) {
          const dailyData: DailySymptomData = JSON.parse(storedData);

          set(state => ({
            recent_symptom: {
              ...state.recent_symptom,
              dailySymptomsCount: dailyData.symptomsCount,
            },
          }));
        } else {
          // No data for today, reset to empty for a fresh start
          const resetData = {
            'Physical Symptom': {},
            'Psychological Symptom': {},
            Mood: {},
            'Critical Symptom': {},
          };

          set(state => ({
            recent_symptom: {
              ...state.recent_symptom,
              dailySymptomsCount: resetData,
            },
          }));

          // Save empty data for today to prevent repeated resets if opened multiple times
          const emptyDailyData: DailySymptomData = {
            date: today,
            symptomsCount: resetData,
          };

          try {
            storage.set(
              getDailySymptomStorageKey(today),
              JSON.stringify(emptyDailyData),
            );
          } catch (storageError) {
            console.error(
              'Error saving empty daily symptoms to storage:',
              storageError,
            );
          }
        }
      } catch (error) {
        console.error('Error loading daily symptoms from storage:', error);
      }
    },

    resetDailySymptoms: () => {
      const today = getTodayDateString();

      const resetData = {
        'Physical Symptom': {},
        'Psychological Symptom': {},
        Mood: {},
        'Critical Symptom': {},
      };

      set(state => ({
        recent_symptom: {
          ...state.recent_symptom,
          dailySymptomsCount: resetData,
        },
      }));

      // Clear from storage
      try {
        storage.delete(getDailySymptomStorageKey(today));
      } catch (error) {
        console.error('Error clearing daily symptoms from storage:', error);
      }
    },

    setCurrentMood: (moodId: string) => {
      const state = get();

      // Clear existing timeout
      if (state.recent_symptom.emojiResetTimeout) {
        clearTimeout(state.recent_symptom.emojiResetTimeout);
      }

      const now = Date.now();
      const resetAt = now + EMOJI_RESET_DURATION;

      // Create new timeout
      const newTimeout = setTimeout(() => {
        get().recent_symptom.resetCurrentMood();
      }, EMOJI_RESET_DURATION);

      // Save to storage for persistence across app restarts
      const emojiData: EmojiMoodData = {
        currentMood: moodId,
        setAt: now,
        resetAt: resetAt,
      };

      try {
        storage.set(getEmojiMoodStorageKey(), JSON.stringify(emojiData));
      } catch (error) {
        console.error('Error saving emoji state to storage:', error);
      }

      set(state => ({
        recent_symptom: {
          ...state.recent_symptom,
          currentMood: moodId,
          emojiResetTimeout: newTimeout,
        },
      }));
    },

    resetCurrentMood: () => {
      const state = get();

      // Clear timeout
      if (state.recent_symptom.emojiResetTimeout) {
        clearTimeout(state.recent_symptom.emojiResetTimeout);
      }

      // Clear from storage
      try {
        storage.delete(getEmojiMoodStorageKey());
      } catch (error) {
        console.error('Error clearing emoji state from storage:', error);
      }

      set(state => ({
        recent_symptom: {
          ...state.recent_symptom,
          currentMood: '',
          emojiResetTimeout: null,
        },
      }));
    },

    loadEmojiStateFromStorage: () => {
      try {
        const storedData = storage.getString(getEmojiMoodStorageKey());

        if (storedData) {
          const emojiData: EmojiMoodData = JSON.parse(storedData);
          const now = Date.now();

          // Check if the mood should still be active
          if (now < emojiData.resetAt) {
            const remainingTime = emojiData.resetAt - now;

            // Create timeout for remaining time
            const newTimeout = setTimeout(() => {
              get().recent_symptom.resetCurrentMood();
            }, remainingTime);

            set(state => ({
              recent_symptom: {
                ...state.recent_symptom,
                currentMood: emojiData.currentMood,
                emojiResetTimeout: newTimeout,
              },
            }));
          } else {
            // Mood has expired, reset it
            get().recent_symptom.resetCurrentMood();
          }
        }
      } catch (error) {
        console.error('Error loading emoji state from storage:', error);
      }
    },

    clearEmojiTimeout: () => {
      const state = get();
      if (state.recent_symptom.emojiResetTimeout) {
        clearTimeout(state.recent_symptom.emojiResetTimeout);
        set(state => ({
          recent_symptom: {
            ...state.recent_symptom,
            emojiResetTimeout: null,
          },
        }));
      }
    },

    // Custom symptoms management
    addCustomSymptom: (symptom: string, type: 'physical' | 'psychological') => {
      const current = get().recent_symptom;

      const isPhysical = type === 'physical';
      const currentList = isPhysical
        ? current.customPhysicalSymptoms
        : current.customPsychologicalSymptoms;

      // Check if symptom already exists
      if (currentList.includes(symptom)) {
        return; // Already exists, don't add duplicate
      }

      const updatedList = [...currentList, symptom];

      set(state => ({
        recent_symptom: {
          ...state.recent_symptom,
          [isPhysical
            ? 'customPhysicalSymptoms'
            : 'customPsychologicalSymptoms']: updatedList,
        },
      }));

      // Persist to storage
      try {
        const allCustomSymptoms = {
          physical: isPhysical ? updatedList : current.customPhysicalSymptoms,
          psychological: isPhysical
            ? current.customPsychologicalSymptoms
            : updatedList,
        };
        storage.set(
          getCustomSymptomsStorageKey(),
          JSON.stringify(allCustomSymptoms),
        );
      } catch (error) {
        console.error('Error saving custom symptoms to storage:', error);
      }
    },

    getCustomPhysicalSymptoms: () => {
      return get().recent_symptom.customPhysicalSymptoms;
    },

    getCustomPsychologicalSymptoms: () => {
      return get().recent_symptom.customPsychologicalSymptoms;
    },

    loadCustomSymptomsFromStorage: () => {
      try {
        const customSymptomsData = storage.getString(
          getCustomSymptomsStorageKey(),
        );

        if (customSymptomsData) {
          const parsed = JSON.parse(customSymptomsData);
          const physicalSymptoms = parsed.physical || [];
          const psychologicalSymptoms = parsed.psychological || [];

          set(state => ({
            recent_symptom: {
              ...state.recent_symptom,
              customPhysicalSymptoms: physicalSymptoms,
              customPsychologicalSymptoms: psychologicalSymptoms,
            },
          }));
        }
      } catch (error) {
        console.error('Error loading custom symptoms from storage:', error);
      }
    },
  },
});

export default createRecentSymptomSlice;
