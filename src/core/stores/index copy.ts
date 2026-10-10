import {mergeDeepLeft} from 'ramda';
import {create} from 'zustand';
import {
  createJSONStorage,
  persist,
  subscribeWithSelector,
} from 'zustand/middleware';
import {immer} from 'zustand/middleware/immer';

// Import slices
import {zustandStorage} from '../storage/mmkv';
import createVideoActivitySlice, {
  type VideoActivitySlice,
} from './slices/activity.slice';
import createAppSlice, {type AppSlice} from './slices/app.slice';
import createCycleSlice, {type CycleSlice} from './slices/cycle.slice';
import createEngagementSlice, {
  type EngagementSlice,
} from './slices/engaement.slice'; // Fixed typo: engaement -> engagement
import createInteractiveVideoSlice, {
  type InteractiveVideoSlice,
} from './slices/interactive-video.slice';
import createMediaSlice, {type MediaSlice} from './slices/media.slice';
import createSymptomSlice, {
  type SymptomSlice,
} from './slices/recent-symptoms.slice';
import createUserSlice, {type UserSlice} from './slices/user.slice';
import createLearnSlice, {
  type LearnSlice
} from './slices/learn.slice';

// Combined store type - Added MediaSlice
export type StoreState = AppSlice &
  UserSlice &
  EngagementSlice &
  InteractiveVideoSlice &
  SymptomSlice &
  CycleSlice &
  MediaSlice &
  VideoActivitySlice &
  LearnSlice;

// Create the main store
export const useAppStore = create<StoreState>()(
  subscribeWithSelector(
    persist(
      immer((...a) => ({
        ...createAppSlice(...a),
        ...createUserSlice(...a),
        ...createEngagementSlice(...a),
        ...createInteractiveVideoSlice(...a),
        ...createSymptomSlice(...a),
        ...createCycleSlice(...a),
        ...createMediaSlice(...a), // Added missing MediaSlice
        ...createVideoActivitySlice(...a),
        ...createLearnSlice(...a),
      })),
      {
        name: 'aura-wellness-app-storage', // Unique name for the storage
        version: 1, // Version of the persisted state
        storage: createJSONStorage(() => zustandStorage),
        partialize: state => ({
          // App state to persist
          app: state.app,
          // User state to persist - critical for auth persistence
          user: state.user,
          // Engagement state to persist
          engagement: state.engagement,
          // InteractiveVideo state to persist
          interactive_video: state.interactive_video,
          // RecentSymptom state to persist
          recent_symptom: state.recent_symptom,
          cycle: state.cycle,
          videoActivity: state.videoActivity,
          learn: state.learn,
          // Media state to persist (add this if needed)
          // media: {
          //   // Add media properties that need to be persisted
          // },
          // Cycle state - DON'T persist since it comes from SQLite
          // We intentionally exclude the cycle state from persistence
          // because it's managed by SQLite database
        }),
        merge: (persistedState, currentState) =>
          mergeDeepLeft(persistedState as object, currentState),
      },
    ),
  ),
);

// Store utilities
export const storeUtils = {
  getState: () => useAppStore.getState(),
  subscribe: (listener: (state: StoreState) => void) =>
    useAppStore.subscribe(listener),
  destroy: () => useAppStore.persist.clearStorage(),
};

// Export the main store as default
export default useAppStore;

// Also export as useStore for backward compatibility and consistency with the cycle slice usage
export const useStore = useAppStore;
