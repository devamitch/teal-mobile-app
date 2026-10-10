import {StateCreator} from 'zustand';
import videoData, {Video} from '../../../data/videoData';

export interface InteractiveVideoState {
  currentVideoId: string;
  videoHistory: string[];
  videoPositions: Record<string, number>;
  cdnVideos: Record<string, any>;
  videosLoaded: boolean;
  cachedVideo: Video | undefined;
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
  getCdnVideoUrl: (videoId: string) => string | null;
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
};

const createInteractiveVideoSlice: StateCreator<
  InteractiveVideoSlice,
  [],
  [],
  InteractiveVideoSlice
> = (set, get) => ({
  interactive_video: {
    ...interactiveVideoInitialState,

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
      } else {
        console.warn(`Video ID "${videoId}" not found in videoData.`);
        set(state => ({
          interactive_video: {
            ...state.interactive_video,
            currentVideoId: videoData.initialVideoId,
            videoHistory: [videoData.initialVideoId],
            cachedVideo: undefined,
            lastVideoId: undefined,
          },
        }));
      }
    },

    goBack: () => {
      set(state => {
        const history = state.interactive_video.videoHistory;
        if (history.length > 1) {
          const newHistory = [...history];
          newHistory.pop();
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
      }
    },

    getVideoPosition: (videoId: string) => {
      return get().interactive_video.videoPositions[videoId] || 0;
    },

    loadCdnVideos: (cdnVideos: any[]) => {
      const videosMap: Record<string, any> = {};

      console.log('=== MATCHING CDN VIDEOS ===');
      console.log('Available local videos:', Object.keys(videoData.videos));

      // Use exact title matching with cdnVideoId
      cdnVideos.forEach(cdnVideo => {
        console.log(`\nTrying to match CDN video: "${cdnVideo.title}"`);

        for (const [videoId, videoInfo] of Object.entries(videoData.videos)) {
          if (videoInfo.cdnVideoId === cdnVideo.title) {
            videosMap[videoId] = cdnVideo;
            console.log(`✓ Matched "${cdnVideo.title}" to "${videoId}"`);
            break;
          }
        }

        if (!Object.values(videosMap).includes(cdnVideo)) {
          console.log(`✗ No match found for: "${cdnVideo.title}"`);
        }
      });

      console.log('\n=== FINAL MAPPING ===');
      console.log('Successfully mapped videos:', Object.keys(videosMap));
      console.log('=== END MATCHING ===');

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
      const url = cdnVideo?.url || null;
      console.log(`Getting URL for ${videoId}:`, url);
      return url;
    },
  },
});

export default createInteractiveVideoSlice;
