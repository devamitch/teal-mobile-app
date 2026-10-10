import {StateCreator} from 'zustand';
import videoData, {Video} from '../../../data/videoData';
import {createNamespacedStorage} from '../../storage/mmkv';

// Use a single MMKV instance, but namespace keys for activities
const activityStorage = createNamespacedStorage('interactive-video-activities');
const videoStateStorage = createNamespacedStorage('interactive-video-state');

export interface InteractiveVideoState {
  currentVideoId: string;
  videoHistory: string[];
  videoPositions: Record<string, number>;
  cdnVideos: Record<string, any>;
  videosLoaded: boolean;
  cachedVideo?: Video;
  lastVideoId?: string;
  activityResponses: {[videoId: string]: {[activityId: string]: any}};
  activityResponsesLoaded: boolean;
  isInitialized: boolean;
}

export interface InteractiveVideoAction {
  getCurrentVideo: () => Video | undefined;
  navigateToVideo: (videoId: string) => void;
  goBack: () => void;
  resetVideoState: () => void;
  updateVideoPosition: (videoId: string, position: number) => void;
  getVideoPosition: (videoId: string) => number;
  loadCdnVideos: (cdnVideos: any[]) => void;
  getCdnVideoUrl: (videoId: string) => string | undefined;
  saveActivityResponse: (
    videoId: string,
    activityId: string,
    response: any,
  ) => Promise<void>;
  getActivityResponse: (videoId: string, activityId: string) => any;
  loadActivityResponses: () => Promise<void>;
  clearActivityResponses: (videoId?: string) => Promise<void>;
  getVideoActivityProgress: (videoId: string) => {
    completed: number;
    total: number;
  };
  getAllActivityResponses: () => {
    [videoId: string]: {[activityId: string]: any};
  };
  initializeFromStorage: () => Promise<void>;
  persistVideoState: () => void;
}

export interface InteractiveVideoSlice {
  interactive_video: InteractiveVideoState & InteractiveVideoAction;
}

const interactiveVideoInitialState: InteractiveVideoState = {
  currentVideoId: videoData.initialVideoId,
  videoHistory: [videoData.initialVideoId],
  videoPositions: {},
  cdnVideos: {},
  videosLoaded: false,
  cachedVideo: undefined,
  lastVideoId: undefined,
  activityResponses: {},
  activityResponsesLoaded: false,
  isInitialized: false,
};

const persistAllActivityResponses = (activityResponses: {
  [videoId: string]: {[activityId: string]: any};
}) => {
  Object.entries(activityResponses).forEach(([videoId, activities]) => {
    Object.entries(activities).forEach(([activityId, response]) => {
      const storageKey = `${videoId}_${activityId}`;
      activityStorage.setItem(storageKey, JSON.stringify(response));
    });
  });
};

const createInteractiveVideoSlice: StateCreator<
  InteractiveVideoSlice,
  [],
  [],
  InteractiveVideoSlice
> = (set, get) => ({
  interactive_video: {
    ...interactiveVideoInitialState,

    initializeFromStorage: async () => {
      try {
        // Restore video state
        const savedCurrentVideoId = videoStateStorage.getItem('currentVideoId');
        const savedVideoHistoryStr = videoStateStorage.getItem('videoHistory');
        const savedVideoPositionsStr =
          videoStateStorage.getItem('videoPositions');
        let currentVideoId = videoData.initialVideoId;
        let videoHistory = [videoData.initialVideoId];
        let videoPositions = {};

        if (savedCurrentVideoId && videoData.videos[savedCurrentVideoId]) {
          currentVideoId = savedCurrentVideoId;
        }
        if (savedVideoHistoryStr) {
          try {
            const parsedHistory = JSON.parse(savedVideoHistoryStr);
            if (Array.isArray(parsedHistory) && parsedHistory.length > 0) {
              videoHistory = parsedHistory;
            }
          } catch {}
        }
        if (savedVideoPositionsStr) {
          try {
            const parsedPositions = JSON.parse(savedVideoPositionsStr);
            if (typeof parsedPositions === 'object') {
              videoPositions = parsedPositions;
            }
          } catch {}
        }

        set(state => ({
          interactive_video: {
            ...state.interactive_video,
            currentVideoId,
            videoHistory,
            videoPositions,
            cachedVideo: undefined,
            lastVideoId: undefined,
            // activityResponsesLoaded: false, // will be set in loadActivityResponses
            // isInitialized: false,          // will be set after loadActivityResponses
          },
        }));

        // Load activity responses from MMKV (always await this)
        await get().interactive_video.loadActivityResponses();

        // Only set isInitialized after activity responses are loaded!
        set(state => ({
          interactive_video: {
            ...state.interactive_video,
            isInitialized: true,
          },
        }));
      } catch (error) {
        set(state => ({
          interactive_video: {
            ...state.interactive_video,
            isInitialized: true,
            activityResponsesLoaded: true,
          },
        }));
      }
    },

    persistVideoState: () => {
      try {
        const state = get().interactive_video;
        videoStateStorage.setItem('currentVideoId', state.currentVideoId);
        videoStateStorage.setItem(
          'videoHistory',
          JSON.stringify(state.videoHistory),
        );
        videoStateStorage.setItem(
          'videoPositions',
          JSON.stringify(state.videoPositions),
        );
        persistAllActivityResponses(state.activityResponses);
      } catch {}
    },

    getCurrentVideo: () => {
      const state = get().interactive_video;
      const currentId = state.currentVideoId;
      if (state.cachedVideo && state.lastVideoId === currentId) {
        return state.cachedVideo;
      }
      const video = videoData.videos[currentId];
      if (video) {
        const cdnUrl = state.getCdnVideoUrl(currentId);
        const videoWithSource = {
          ...video,
          source: cdnUrl || video.source,
        };
        set(state => ({
          interactive_video: {
            ...state.interactive_video,
            cachedVideo: videoWithSource,
            lastVideoId: currentId,
          },
        }));
        return videoWithSource;
      }
      return undefined;
    },

    navigateToVideo: (videoId: string) => {
      if (videoData.videos[videoId]) {
        set(state => ({
          interactive_video: {
            ...state.interactive_video,
            currentVideoId: videoId,
            videoHistory: [...state.interactive_video.videoHistory, videoId],
            cachedVideo: undefined,
            lastVideoId: undefined,
          },
        }));
        setTimeout(() => {
          get().interactive_video.persistVideoState();
        }, 100);
      } else {
        set(state => ({
          interactive_video: {
            ...state.interactive_video,
            currentVideoId: videoData.initialVideoId,
            videoHistory: [videoData.initialVideoId],
            cachedVideo: undefined,
            lastVideoId: undefined,
          },
        }));
        setTimeout(() => {
          get().interactive_video.persistVideoState();
        }, 100);
      }
    },

    goBack: () => {
      set(state => {
        const history = state.interactive_video.videoHistory;
        if (history.length > 1) {
          const newHistory = [...history];
          newHistory.pop();
          setTimeout(() => {
            get().interactive_video.persistVideoState();
          }, 100);
          return {
            interactive_video: {
              ...state.interactive_video,
              currentVideoId: newHistory[newHistory.length - 1],
              videoHistory: newHistory,
              cachedVideo: undefined,
              lastVideoId: undefined,
            },
          };
        }
        return state;
      });
    },

    resetVideoState: () => {
      set(state => ({
        interactive_video: {
          ...state.interactive_video,
          currentVideoId: videoData.initialVideoId,
          videoHistory: [videoData.initialVideoId],
          cachedVideo: undefined,
          lastVideoId: undefined,
        },
      }));
      setTimeout(() => {
        get().interactive_video.persistVideoState();
      }, 100);
    },

    updateVideoPosition: (videoId: string, position: number) => {
      const currentPosition =
        get().interactive_video.videoPositions[videoId] || 0;
      if (Math.abs(position - currentPosition) > 1) {
        set(state => ({
          interactive_video: {
            ...state.interactive_video,
            videoPositions: {
              ...state.interactive_video.videoPositions,
              [videoId]: position,
            },
          },
        }));
        setTimeout(() => {
          get().interactive_video.persistVideoState();
        }, 2000);
      }
    },

    getVideoPosition: (videoId: string) => {
      return get().interactive_video.videoPositions[videoId] || 0;
    },

    loadCdnVideos: (cdnVideos: any[]) => {
      const videosMap: Record<string, any> = {};
      cdnVideos.forEach(cdnVideo => {
        for (const [videoId, videoInfo] of Object.entries(videoData.videos)) {
          if (videoInfo.cdnVideoId === cdnVideo.title) {
            videosMap[videoId] = cdnVideo;
            break;
          }
        }
      });
      set(state => ({
        interactive_video: {
          ...state.interactive_video,
          cdnVideos: videosMap,
          videosLoaded: true,
          cachedVideo: undefined,
          lastVideoId: undefined,
        },
      }));
    },

    getCdnVideoUrl: (videoId: string) => {
      const cdnVideo = get().interactive_video.cdnVideos[videoId];
      const url = cdnVideo?.url || undefined;
      return url;
    },

    saveActivityResponse: async (
      videoId: string,
      activityId: string,
      response: any,
    ) => {
      try {
        // Always save the response as an object with timestamp etc.
        const responseWithTimestamp = {
          ...(typeof response === 'object' && response !== undefined
            ? response
            : {value: response}),
          timestamp: new Date().toISOString(),
          videoId,
          activityId,
        };
        // Update in-memory state first
        set(state => ({
          interactive_video: {
            ...state.interactive_video,
            activityResponses: {
              ...state.interactive_video.activityResponses,
              [videoId]: {
                ...state.interactive_video.activityResponses[videoId],
                [activityId]: responseWithTimestamp,
              },
            },
          },
        }));
        // Persist to MMKV
        const storageKey = `${videoId}_${activityId}`;
        activityStorage.setItem(
          storageKey,
          JSON.stringify(responseWithTimestamp),
        );
        // Always persist ALL as backup (for cross-device or corruption)
        persistAllActivityResponses(get().interactive_video.activityResponses);
      } catch (error) {
        throw error;
      }
    },

    getActivityResponse: (videoId: string, activityId: string) => {
      const state = get();
      const response =
        state.interactive_video.activityResponses[videoId]?.[activityId];
      return response;
    },

    loadActivityResponses: async () => {
      try {
        set(state => ({
          interactive_video: {
            ...state.interactive_video,
            activityResponsesLoaded: false,
          },
        }));
        const allKeys = activityStorage.getAllKeys();
        const activityResponses: {
          [videoId: string]: {[activityId: string]: any};
        } = {};
        allKeys.forEach(key => {
          const value = activityStorage.getItem(key);
          if (value) {
            const response = JSON.parse(value);
            const [videoId, ...activityIdParts] = key.split('_');
            const activityId = activityIdParts.join('_');
            if (!activityResponses[videoId]) activityResponses[videoId] = {};
            activityResponses[videoId][activityId] = response;
          }
        });
        set(state => ({
          interactive_video: {
            ...state.interactive_video,
            activityResponses,
            activityResponsesLoaded: true,
          },
        }));
      } catch (error) {
        set(state => ({
          interactive_video: {
            ...state.interactive_video,
            activityResponsesLoaded: true,
          },
        }));
      }
    },

    clearActivityResponses: async (videoId?: string) => {
      try {
        if (videoId) {
          const allKeys = activityStorage.getAllKeys();
          const videoKeys = allKeys.filter(key =>
            key.startsWith(`${videoId}_`),
          );
          videoKeys.forEach(key => activityStorage.removeItem(key));
          set(state => {
            const newResponses = {...state.interactive_video.activityResponses};
            delete newResponses[videoId];
            return {
              interactive_video: {
                ...state.interactive_video,
                activityResponses: newResponses,
              },
            };
          });
        } else {
          const allKeys = activityStorage.getAllKeys();
          allKeys.forEach(key => activityStorage.removeItem(key));
          set(state => ({
            interactive_video: {
              ...state.interactive_video,
              activityResponses: {},
            },
          }));
        }
      } catch {}
    },

    getVideoActivityProgress: (videoId: string) => {
      const video = videoData.videos[videoId];
      const state = get();
      if (!video?.postActivities) {
        return {completed: 0, total: 0};
      }
      const total = video.postActivities.length;
      const completed = video.postActivities.filter(activity => {
        const response =
          state.interactive_video.activityResponses[videoId]?.[activity.id];
        return response !== undefined && response !== undefined;
      }).length;
      return {completed, total};
    },

    getAllActivityResponses: () => {
      return get().interactive_video.activityResponses;
    },
  },
});

// ---- QUICK & DIRTY CHAPTERS HELPER ----
export interface Chapter {
  title: string;
  videoIds: string[]; // These should match the keys in videoData.videos
}

// Hardcode chapter structure (brute force, from CDN structure)
export const CHAPTERS: Chapter[] = [
  {
    title: '1. Know Thyself',
    videoIds: [
      'menstrual_cycle_overview',
      'hormones_and_mood',
      'understanding_symptom_patterns',
    ],
  },
  {
    title: '2. Creating a Safety Plan',
    videoIds: [
      'warning_signs',
      'distraction_strategies',
      'people_who_can_help',
      'make_space_safe',
      'safety_plan_example',
    ],
  },
  {
    title: '3. Coping with Anger and Irritability',
    videoIds: [
      'hormones_anger_irritability',
      'identify_high_risk_days',
      'signs_of_irritation',
      'point_of_intervention',
      'share_solutions_loved_ones',
      'anger_module_example',
    ],
  },
  {
    title: '4. Depressive Mood (Behavioral Activation)',
    videoIds: [
      'about_behavioral_activation',
      'identify_high_risk_depression',
      'pleasure_mastery_activities',
      'behavioral_activation_example',
    ],
  },
  {
    title: '5. Dealing with Crisis',
    videoIds: [
      'introducing_stop_skill',
      'stop_skill_anger_example',
      'factors_that_make_it_work',
      'stop_skill_self_harm_example',
      'enlist_partner_loved_one',
    ],
  },
  {
    title:
      '6. Turning the Volume Down on Negative Thoughts (Cognitive Restructuring)',
    videoIds: [
      'about_cognitive_restructuring',
      'meet_wenya_example',
      'what_does_wenya_do_next',
      'modifying_cognitive_restructuring',
    ],
  },
  {
    title: '7. Challenging Negative Core Beleifs',
    videoIds: [
      'about_core_beliefs',
      'core_beliefs_example',
      'cognitive_restructuring_core_beliefs',
    ],
  },
  {
    title: '8. Strengthening Your Relationships',
    videoIds: [
      'strengthening_relationships',
      'gottman_principles',
      'responding_to_bids',
      'scheduling_bids_connection',
      'avoid_harsh_startups',
      'having_conversation_you_need',
      'relationship_repair',
    ],
  },
  {
    title: '9. Making A Plan of Action',
    videoIds: [
      'behavioral_strategies_recap',
      'cognitive_strategies_recap',
      'planning_next_cycle',
    ],
  },
  {
    title: '10. De-bfrief and Troubleshooting',
    videoIds: ['debrief_troubleshooting'],
  },
];

// Helper to get chapter for a videoId
export function getChapterForVideo(videoId: string): Chapter | undefined {
  return CHAPTERS.find(ch => ch.videoIds.includes(videoId));
}

// Helper to get all chapters with video objects, not just IDs
export function getChaptersWithVideos() {
  return CHAPTERS.map(ch => ({
    title: ch.title,
    videos: ch.videoIds
      .map(id => ({...videoData.videos[id], id}))
      .filter(Boolean),
    videoIds: ch.videoIds,
  }));
}

export default createInteractiveVideoSlice;
