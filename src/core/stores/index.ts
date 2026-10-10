import {enableMapSet} from 'immer';
import {create} from 'zustand';
import {
  createJSONStorage,
  persist,
  subscribeWithSelector,
} from 'zustand/middleware';
import {immer} from 'zustand/middleware/immer';
import {zustandStorage} from '../storage/mmkv';

// Import your slices (make sure they follow the new pattern)
import {mergeDeepLeft} from 'ramda';
import createAppSlice, {type AppSlice} from './slices/app.slice';
import createAuthSlice, {AuthSlice} from './slices/auth.slice';
import createCompletionSlice, {
  type CompletionSlice,
} from './slices/completion.slice';
import createCycleSlice, {type CycleSlice} from './slices/cycle.slice';
import createEngagementSlice, {
  type EngagementSlice,
} from './slices/engaement.slice';
import createLearnSlice, {type LearnSlice} from './slices/learn.slice';
import createMediaSlice, {type MediaSlice} from './slices/media.slice';
import createVideoPlaylistSlice from './slices/playlist';
import {VideoPlaylistSlice} from './slices/playlist/types';
import createSymptomSlice, {
  type SymptomSlice,
} from './slices/recent-symptoms.slice';
import createUserSlice, {type UserSlice} from './slices/user.slice';

export type StoreState = AppSlice &
  UserSlice &
  EngagementSlice &
  SymptomSlice &
  CycleSlice &
  LearnSlice &
  MediaSlice &
  VideoPlaylistSlice &
  AuthSlice &
  CompletionSlice;

// Define the middleware stack type
type Middleware = [
  ['zustand/immer', never],
  ['zustand/persist', unknown],
  ['zustand/subscribeWithSelector', never],
];

enableMapSet();

export const useAppStore = create<StoreState>()(
  subscribeWithSelector(
    persist(
      immer<StoreState>((set, get, api) => ({
        ...createAppSlice(set, get, api),
        ...createUserSlice(set, get, api),
        ...createAuthSlice(set, get, api),
        ...createEngagementSlice(set, get, api),
        ...createSymptomSlice(set, get, api),
        ...createCycleSlice(set, get, api),
        ...createLearnSlice(set, get, api),
        ...createMediaSlice(set, get, api),
        ...createVideoPlaylistSlice(set, get, api),
        ...createCompletionSlice(set, get, api),
      })),
      {
        name: 'aura-wellness-app-storage',
        version: 1,
        storage: createJSONStorage(() => zustandStorage),
        partialize: state => ({
          app: state.app,
          user: state.user,
          engagement: state.engagement,
          recent_symptom: state.recent_symptom,
          cycle: state.cycle,
          learn: state.learn,
          media: state.media,
          playlist: state.playlist,
          completion: state.completion,
        }),
        merge: (persistedState, currentState) =>
          mergeDeepLeft(persistedState as object, currentState),
      },
    ),
  ),
);

export const storeUtils = {
  getState: () => useAppStore.getState(),
  subscribe: (listener: (state: StoreState) => void) =>
    useAppStore.subscribe(listener),
  destroy: () => useAppStore.persist.clearStorage(),
};

export default useAppStore;
export const useStore = useAppStore;
