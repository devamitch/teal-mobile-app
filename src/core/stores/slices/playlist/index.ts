import {MODULE_MODULE_DATA} from '@/data/module-data';
import {enableMapSet} from 'immer';
import type {StateCreator} from 'zustand';
import type {
  ExtendedActivityResponse,
  VideoActivity,
  VideoPlaylistSlice,
} from './types';

enableMapSet();

const initialState = {
  chapters: MODULE_MODULE_DATA,
  currentChapterId: null,
  currentVideoId: null,
  currentVideoIndex: 0,
  isPlaying: false,
  autoPlayNext: false, // Disabled for now
  shuffleMode: false,
  repeatMode: 'none' as 'none' | 'one' | 'all',
  playbackSpeed: 1.0,
  volume: 1.0,
  currentTime: 0,
  duration: 0,
  isBuffering: false,
  isLoading: false,
  error: null,
  isFullscreen: false,
  showControls: true,
  isCcEnabled: true,
  videoHistory: [],
  watchedVideos: [],
  newVideos: [],
  videoProgress: {},
  activityResponses: {},
  loadedSubtitles: {},
  videoSettings: {},
  currentActivityIndex: 0,
  isSubmitting: false,
};

/**
 * Zustand slice for managing video playlist state & actions.
 */
export const createVideoPlaylistSlice: StateCreator<
  VideoPlaylistSlice,
  [],
  [],
  VideoPlaylistSlice
> = (set, get) => ({
  playlist: {
    ...initialState,

    setCurrentActivityIndex: currentActivityIndex => {
      set(state => ({playlist: {...state.playlist, currentActivityIndex}}));
    },
    setIsSubmitting: isSubmitting => {
      set(state => ({playlist: {...state.playlist, isSubmitting}}));
    },
    // Chapter management
    getChapterById: chapterId => {
      try {
        return (
          get()?.playlist?.chapters?.find?.(c => c?.id === chapterId) ||
          get()?.playlist?.chapters?.[0]
        );
      } catch {
        return get()?.playlist?.chapters?.[0];
      }
    },

    getChapterProgress: chapterId => {
      try {
        const chapter = get().playlist.getChapterById?.(chapterId);
        if (!chapter?.videos?.length) return 0;

        const {watchedVideos, videoProgress} = get().playlist;
        const completedCount = chapter.videos.filter(v => {
          const isWatched = watchedVideos.includes(v.id);
          const progress = videoProgress?.[v.id] || 0;
          const videoStatus = v?.status;
          return isWatched || progress > 0.9 || videoStatus === 'ended';
        }).length;

        return (completedCount / chapter.videos.length) * 100;
      } catch {
        return 0;
      }
    },
    markVideoAsWatched: videoId => {
      if (!get().playlist.watchedVideos.includes(videoId)) {
        set(state => ({
          playlist: {
            ...state.playlist,
            watchedVideos: [...state.playlist.watchedVideos, videoId],
          },
        }));
      }
    },

    getChapterProgress2: chapterId => {
      try {
        const chapter = get()?.playlist?.getChapterById?.(chapterId);
        if (!chapter?.videos?.length) return 0;

        const {watchedVideos, videoProgress} = get().playlist;
        const completedCount = chapter.videos.filter(v => {
          const isWatched = watchedVideos?.has?.(v?.id);
          const progress = videoProgress?.[v?.id] || 0;
          const videoStatus = v?.status;
          return isWatched || progress > 0.9 || videoStatus === 'ended';
        }).length;

        return (completedCount / chapter.videos.length) * 100;
      } catch {
        return 0;
      }
    },

    playChapter: chapterId => {
      try {
        const chapter = get()?.playlist?.getChapterById?.(chapterId);
        if (chapter?.videos?.[0]?.id) {
          get()?.playlist?.playVideo?.(chapter.videos?.[0].id);
        }
      } catch {
        const firstVideo = get()?.playlist?.chapters?.[0]?.videos?.[0];
        if (firstVideo?.id) {
          get()?.playlist?.playVideo(firstVideo.id);
        }
      }
    },

    playChapterVideos: chapterId => {
      try {
        const chapter = get()?.playlist?.getChapterById?.(chapterId);
        if (chapter?.videos?.length) {
          get()?.playlist?.playVideo?.(chapter?.videos?.[0]?.id || '1');
        }
      } catch {}
    },

    // Video management
    getCurrentVideo: () => {
      try {
        const {currentChapterId, currentVideoIndex} = get()?.playlist || {};
        if (!currentChapterId) return undefined;
        const chapter = get()?.playlist?.getChapterById?.(currentChapterId);
        return chapter?.videos?.[currentVideoIndex || '1.1'];
      } catch {
        return undefined;
      }
    },

    getCurrentChapter: () => {
      try {
        const {currentChapterId} = get()?.playlist || {};
        if (!currentChapterId) return undefined;
        return get()?.playlist?.getChapterById?.(currentChapterId);
      } catch {
        return undefined;
      }
    },

    getVideoById: videoId => {
      try {
        const chapters = get()?.playlist?.chapters || [];

        // Flatten all videos across chapters into one array
        const allVideos = chapters.flatMap(chapter => chapter?.videos || []);

        // Find the video
        const foundVideo = allVideos.find(video => video?.id === videoId);

        // Verification / sanity check
        if (foundVideo?.id === videoId) {
          return foundVideo;
        } else {
          console.warn('Video not found or verification failed:', videoId);
          return undefined;
        }
      } catch (error) {
        console.error('Error in getVideoById:', error);
        return undefined;
      }
    },

    playVideo: videoId => {
      console.log({videoId});
      try {
        const chapters = get()?.playlist?.chapters || [];

        // Flatten all videos with their chapter id and index
        const allVideos = chapters.flatMap(chapter =>
          (chapter?.videos || []).map((video, index) => ({
            video,
            chapterId: chapter?.id,
            index,
          })),
        );

        // Find the video entry by id
        const found = allVideos.find(entry => entry.video?.id === videoId);

        if (found) {
          set(state => ({
            playlist: {
              ...state?.playlist,
              currentVideoId: videoId, // save first
              currentChapterId: found.chapterId,
              currentVideoIndex: found.index,
              isPlaying: true,
              isLoading: true,
              error: null,
              videoHistory: [
                ...(state?.playlist?.videoHistory || []),
                videoId,
              ].slice(-50),
            },
          }));
        } else {
          console.warn('Video not found when trying to play:', videoId);
          set(state => ({
            ...state,
            playlist: {...state?.playlist, currentVideoId: videoId},
          }));
        }
      } catch (error) {
        set(state => ({
          ...state,
          playlist: {...state?.playlist, currentVideoId: videoId},
        }));
        console.error('Error in playVideo:', error);
      }
    },

    playNextVideo: () => {
      try {
        const {
          currentChapterId,
          currentVideoIndex,
          repeatMode,
          shuffleMode,
          chapters,
          autoPlayNext,
        } = get()?.playlist || {};

        if (!currentChapterId || !autoPlayNext) return;

        const chapter = get()?.playlist?.getChapterById?.(currentChapterId);
        if (!chapter?.videos?.length) return;

        if (repeatMode === 'one') {
          const video = chapter.videos[currentVideoIndex || 0];
          if (video?.id) get()?.playlist?.playVideo?.(video.id);
          return;
        }

        if (shuffleMode) {
          const allVideos = chapters?.flatMap?.(c => c?.videos || []) || [];
          let random,
            attempts = 0;
          while (
            (!random || random?.id === get()?.playlist?.currentVideoId) &&
            attempts++ < 10
          ) {
            random = allVideos[Math.floor(Math.random() * allVideos.length)];
          }
          if (random?.id) get()?.playlist?.playVideo?.(random.id);
          return;
        }

        const nextIndex = (currentVideoIndex || 0) + 1;
        if (nextIndex < (chapter.videos?.length || 0)) {
          get()?.playlist?.playVideo?.(chapter?.videos?.[nextIndex]?.id || '');
        } else {
          const currentChapterIndex =
            chapters?.findIndex?.(c => c?.id === currentChapterId) || -1;
          const nextChapter = chapters?.[currentChapterIndex + 1];
          if (nextChapter?.videos?.[0]?.id) {
            get()?.playlist?.playVideo?.(nextChapter.videos[0].id);
          } else if (repeatMode === 'all' && chapters?.[0]?.videos?.[0]?.id) {
            get()?.playlist?.playVideo?.(chapters[0].videos[0].id);
          }
        }
      } catch (error) {
        console.error('Error playing next video:', error);
      }
    },

    playPreviousVideo: () => {
      try {
        const {currentChapterId, currentVideoIndex, chapters} =
          get()?.playlist || {};
        if (!currentChapterId) return;

        const chapter = get()?.playlist?.getChapterById?.(currentChapterId);
        if (!chapter?.videos?.length) return;

        if ((currentVideoIndex || 0) > 0) {
          get()?.playlist?.playVideo?.(
            chapter?.videos?.[(currentVideoIndex || 0) - 1]?.id || '',
          );
        } else {
          const currentIndex =
            chapters?.findIndex?.(c => c?.id === currentChapterId) || -1;
          const prevChapter = chapters?.[currentIndex - 1];
          if (prevChapter?.videos?.length) {
            get()?.playlist?.playVideo?.(
              prevChapter.videos?.[prevChapter.videos.length - 1]?.id || '',
            );
          }
        }
      } catch (error) {
        console.error('Error playing previous video:', error);
      }
    },

    // Progress tracking
    getVideoProgress: videoId => {
      try {
        return get()?.playlist?.videoProgress?.[videoId] || 0;
      } catch {
        return 0;
      }
    },

    isVideoWatched2: videoId => {
      try {
        const video = get()?.playlist?.getVideoById?.(videoId);
        return (
          get()?.playlist?.watchedVideos?.has?.(videoId) ||
          video?.status === 'ended' ||
          (get()?.playlist?.videoProgress?.[videoId] || 0) > 0.9
        );
      } catch {
        return false;
      }
    },
    isVideoWatched: videoId => {
      try {
        return get()?.playlist?.watchedVideos?.includes(videoId);
      } catch {
        // return get()?.playlist?.watchedVideos?.has(videoId);
        return false;
      }
    },

    // Subtitle and settings management
    saveLoadedSubtitles: (videoId, subtitleContent) => {
      try {
        set(s => ({
          playlist: {
            ...s?.playlist,
            loadedSubtitles: {
              ...s?.playlist?.loadedSubtitles,
              [videoId]: subtitleContent,
            },
          },
        }));
      } catch {}
    },

    getLoadedSubtitles: videoId => {
      try {
        return get()?.playlist?.loadedSubtitles?.[videoId] || null;
      } catch {
        return null;
      }
    },

    saveVideoSettings: (videoId, settings) => {
      try {
        set(s => ({
          playlist: {
            ...s?.playlist,
            videoSettings: {
              ...s?.playlist?.videoSettings,
              [videoId]: {
                ...s?.playlist?.videoSettings?.[videoId],
                ...settings,
              },
            },
          },
        }));
      } catch {}
    },

    getVideoSettings: videoId => {
      try {
        return get()?.playlist?.videoSettings?.[videoId] || {};
      } catch {
        return {};
      }
    },

    // Activity management
    saveActivityResponse: <T extends VideoActivity>(
      videoId: string,
      activityId: string,
      response: ExtendedActivityResponse<T>,
    ) => {
      const responseKey = `${videoId}-${activityId}`;
      set(state => ({
        playlist: {
          ...state.playlist,
          activityResponses: {
            ...state.playlist.activityResponses,
            [responseKey]: response,
          },
        },
      }));
    },

    getActivityResponse: <T extends VideoActivity>(
      videoId: string,
      activityId: string,
    ) => {
      const responseKey = `${videoId}-${activityId}`;
      return get()?.playlist?.activityResponses[
        responseKey
      ] as ExtendedActivityResponse<T>;
    },

    // Statistics and utilities
    getPlaylistStats2: () => {
      try {
        const {chapters, watchedVideos} = get()?.playlist || {};
        return {
          totalVideos:
            chapters?.reduce?.((sum, c) => sum + (c?.videos?.length || 0), 0) ||
            0,
          watchedVideoCount: watchedVideos?.size || 0,
          completedChapterCount:
            chapters?.filter?.(c => c?.completed).length || 0,
        };
      } catch {
        return {totalVideos: 0, watchedVideoCount: 0, completedChapterCount: 0};
      }
    },

    // Updated stats calculation
    getPlaylistStats: () => {
      try {
        const {chapters, watchedVideos} = get().playlist;
        return {
          totalVideos: chapters.reduce(
            (sum, c) => sum + (c?.videos?.length || 0),
            0,
          ),
          watchedVideoCount: watchedVideos.length,
          completedChapterCount: chapters.filter(c => c?.completed).length,
        };
      } catch {
        return {totalVideos: 0, watchedVideoCount: 0, completedChapterCount: 0};
      }
    },

    resetPlaylist: () => {
      try {
        set({
          playlist: {
            ...initialState,
          },
        });
      } catch (error) {
        console.error('Error resetting playlist:', error);
      }
    },

    // Basic setters
    setIsPlaying: playing => {
      try {
        set(s => ({playlist: {...s?.playlist, isPlaying: playing}}));
      } catch {}
    },

    setCurrentTime: time => {
      try {
        set(s => ({playlist: {...s?.playlist, currentTime: time}}));
      } catch {}
    },

    setDuration: duration => {
      try {
        set(s => ({playlist: {...s?.playlist, duration}}));
      } catch {}
    },

    setIsBuffering: buffering => {
      try {
        set(s => ({playlist: {...s?.playlist, isBuffering: buffering}}));
      } catch {}
    },

    setIsLoading: loading => {
      try {
        set(s => ({playlist: {...s?.playlist, isLoading: loading}}));
      } catch {}
    },

    setError: error => {
      try {
        set(s => ({playlist: {...s?.playlist, error}}));
      } catch {}
    },

    setAutoPlayNext: autoPlay => {
      try {
        set(s => ({playlist: {...s?.playlist, autoPlayNext: autoPlay}}));
      } catch {}
    },

    setShuffleMode: shuffle => {
      try {
        set(s => ({playlist: {...s?.playlist, shuffleMode: shuffle}}));
      } catch {}
    },

    setRepeatMode: mode => {
      try {
        set(s => ({playlist: {...s?.playlist, repeatMode: mode}}));
      } catch {}
    },

    setPlaybackSpeed: speed => {
      try {
        set(s => ({playlist: {...s?.playlist, playbackSpeed: speed}}));

        const {currentVideoId} = get().playlist;
        if (currentVideoId) {
          get().playlist.saveVideoSettings(currentVideoId, {
            playbackSpeed: speed,
          });
        }
      } catch {}
    },

    setVolume: volume => {
      try {
        const clampedVolume = Math.max(0, Math.min(1, volume));
        set(s => ({playlist: {...s?.playlist, volume: clampedVolume}}));

        const {currentVideoId} = get().playlist;
        if (currentVideoId) {
          get().playlist.saveVideoSettings(currentVideoId, {
            volume: clampedVolume,
          });
        }
      } catch {}
    },

    setCcEnabled: enabled => {
      try {
        set(s => ({playlist: {...s?.playlist, isCcEnabled: enabled}}));

        const {currentVideoId} = get().playlist;
        if (currentVideoId) {
          get().playlist.saveVideoSettings(currentVideoId, {
            ccEnabled: enabled,
          });
        }
      } catch {}
    },
    setTempResponse: tempResponse => {
      set(s => ({playlist: {...s?.playlist, tempResponse}}));
    },

    setIsFullscreen: fullscreen => {
      try {
        set(s => ({playlist: {...s?.playlist, isFullscreen: fullscreen}}));
      } catch {}
    },

    setShowControls: show => {
      try {
        set(s => ({playlist: {...s?.playlist, showControls: show}}));
      } catch {}
    },

    // Event handlers - simplified and direct
    onPlayerProgressData: data => {
      try {
        const {currentTime, playableDuration, seekableDuration} = data;

        // Update global state
        set(state => ({
          playlist: {
            ...state.playlist,
            currentTime,
            duration: Math.max(playableDuration || 0, seekableDuration || 0),
          },
        }));

        // Update video progress
        if (playableDuration > 0) {
          const progress = currentTime / playableDuration;
          set(state => ({
            playlist: {
              ...state.playlist,
              videoProgress: {
                ...state.playlist.videoProgress,
                [data.videoId]: progress,
              },
            },
          }));
        }

        // Update video data in chapters
        set(state => ({
          playlist: {
            ...state.playlist,
            chapters: state.playlist.chapters.map(chapter =>
              chapter.id === data.chapterId
                ? {
                    ...chapter,
                    videos: chapter.videos.map(video =>
                      video.id === data.videoId
                        ? {
                            ...video,
                            currentTime,
                            currentPlaybackTime: currentTime,
                            playableDuration: playableDuration || 0,
                            seekableDuration: seekableDuration || 0,
                            progress:
                              playableDuration > 0
                                ? currentTime / playableDuration
                                : 0,
                          }
                        : video,
                    ),
                  }
                : chapter,
            ),
          },
        }));
      } catch (error) {
        console.error('Failed to update progress data:', error);
      }
    },

    onPlaybackStateChanged: data => {
      try {
        const isPlaying =
          typeof data.isPlaying === 'boolean' ? data.isPlaying : false;
        const isSeeking =
          typeof data.isSeeking === 'boolean' ? data.isSeeking : false;

        // Update global playback state safely
        try {
          set(state => ({
            playlist: {
              ...state.playlist,
              isPlaying,
            },
          }));
        } catch (error) {
          console.error('Failed to update global isPlaying state:', error);
        }

        // Update video data in chapters safely
        try {
          set(state => ({
            playlist: {
              ...state.playlist,
              chapters: Array.isArray(state.playlist.chapters)
                ? state.playlist.chapters.map(chapter =>
                    chapter.id === data.chapterId
                      ? {
                          ...chapter,
                          videos: Array.isArray(chapter.videos)
                            ? chapter.videos.map(video =>
                                video.id === data.videoId
                                  ? {
                                      ...video,
                                      isPlaying,
                                      isSeeking,
                                      paused: !isPlaying,
                                    }
                                  : video,
                              )
                            : chapter.videos,
                        }
                      : chapter,
                  )
                : state.playlist.chapters,
            },
          }));
        } catch (error) {
          console.error(
            'Failed to update isPlaying/isSeeking in videos:',
            error,
          );
        }
      } catch (outerError) {
        console.error(
          'Unexpected error in onPlaybackStateChanged:',
          outerError,
        );
      }
    },

    onLoad: data => {
      try {
        // Defensive: ensure numbers, fallback to 0
        const duration = Number(data?.duration) || 0;
        const currentTime = Number(data?.currentTime) || 0;
        const chapterId = data?.chapterId;
        const videoId = data?.videoId;

        // Defensive: fallback for unknown status
        const safeStatus =
          typeof data?.status === 'string' ? data.status : 'loaded';

        // Update global state
        try {
          set(state => ({
            playlist: {
              ...state.playlist,
              duration,
              isLoading: false,
              isLoaded: true,
              error: null,
            },
          }));
        } catch (error) {
          console.error('Failed to update global load state:', error);
        }

        // Update chapters and video data safely
        try {
          set(state => ({
            playlist: {
              ...state.playlist,
              chapters: Array.isArray(state.playlist.chapters)
                ? state.playlist.chapters.map(chapter =>
                    chapter.id === chapterId
                      ? {
                          ...chapter,
                          videos: Array.isArray(chapter.videos)
                            ? chapter.videos.map(video =>
                                video.id === videoId
                                  ? {
                                      ...video,
                                      ...data,
                                      isLoaded: true,
                                      duration,
                                      currentTime: video?.videoFinished
                                        ? Number(video.currentTime) || 0
                                        : Math.max(currentTime, 0),
                                      status: video?.videoFinished
                                        ? video.status || safeStatus
                                        : safeStatus,
                                    }
                                  : video,
                              )
                            : chapter.videos,
                        }
                      : chapter,
                  )
                : state.playlist.chapters,
            },
          }));
        } catch (error) {
          console.error('Failed to update video load data in chapters:', error);
        }
      } catch (outerError) {
        console.error('Unexpected error in onLoad handler:', outerError);
      }
    },
    onEnd: data => {
      try {
        set(state => ({
          playlist: {
            ...state.playlist,
            chapters: state.playlist.chapters.map(chapter =>
              chapter.id === data.chapterId
                ? {
                    ...chapter,
                    videos: chapter.videos.map(video =>
                      video.id === data.videoId
                        ? {
                            ...video,
                            videoFinished: true,
                            completed: true,
                            status: 'ended',
                            progress: 1.0,
                          }
                        : video,
                    ),
                  }
                : chapter,
            ),
          },
        }));
      } catch {}

      try {
        set(state => ({
          playlist: {
            ...state.playlist,
            watchedVideos: state.playlist.watchedVideos.includes(data.videoId)
              ? state.playlist.watchedVideos
              : [...state.playlist.watchedVideos, data.videoId],
          },
        }));
      } catch {}

      try {
        set(state => ({
          playlist: {
            ...state.playlist,
            videoProgress: {
              ...state.playlist.videoProgress,
              [data.videoId]: 1.0,
            },
          },
        }));
      } catch {}

      try {
        if (get().playlist.autoPlayNext) {
          setTimeout(() => {
            get().playlist.playNextVideo?.();
          }, 1000 * 30);
        }
      } catch {}
    },
    onEnd2: data => {
      try {
        set(state => ({
          playlist: {
            ...state.playlist,
            chapters: state.playlist.chapters.map(chapter =>
              chapter.id === data.chapterId
                ? {
                    ...chapter,
                    videos: chapter.videos.map(video =>
                      video.id === data.videoId
                        ? {
                            ...video,
                            videoFinished: true,
                            completed: true,
                            status: 'ended',
                            progress: 1.0,
                          }
                        : video,
                    ),
                  }
                : chapter,
            ),
          },
        }));
      } catch {}
      try {
        set(state => ({
          playlist: {
            ...state.playlist,
            watchedVideos: new Set([
              ...Array.from(state.playlist.watchedVideos),
              data?.videoId,
            ]),
          },
        }));
      } catch {}
      try {
        set(state => ({
          playlist: {
            ...state.playlist,
            videoProgress: {
              ...state.playlist.videoProgress,
              [data.videoId]: 1.0,
            },
          },
        }));
      } catch {}

      try {
        // Auto-play next video if enabled (currently disabled)
        if (get().playlist.autoPlayNext) {
          setTimeout(() => {
            get()?.playlist?.playNextVideo();
          }, 1000 * 30);
        }
      } catch {}
    },

    onError: data => {
      try {
        console.error('Video error', data);
        const errorMessage = data.error?.toString() || 'Unknown video error';

        set(state => ({
          playlist: {
            ...state.playlist,
            error: errorMessage,
            isLoading: false,
            chapters: state.playlist.chapters.map(chapter =>
              chapter.id === data.chapterId
                ? {
                    ...chapter,
                    videos: chapter.videos.map(video =>
                      video.id === data.videoId
                        ? {
                            ...video,
                            error: data,
                            status: 'idle',
                          }
                        : video,
                    ),
                  }
                : chapter,
            ),
          },
        }));
      } catch (error) {
        console.error('Failed to handle error event:', error);
      }
    },

    // Simplified event handlers for other events
    onAudioBecomingNoisy: data => {
      try {
        console.log('Audio becoming noisy', data);
        get().playlist.setIsPlaying(false);
      } catch {}
    },

    onAudioFocusChanged: data => {
      try {
        console.log('Audio focus changed', data);
        if (!data.hasAudioFocus) {
          get().playlist.setIsPlaying(false);
        }
      } catch {}
    },

    onIdle: data => {
      try {
        console.log('Player idle', data);
        set(state => ({
          playlist: {...state.playlist, isLoading: false},
        }));
      } catch {}
    },

    onBandwidthUpdate: data => {
      try {
        console.log('Bandwidth update', data);
      } catch {}
    },

    onBuffer: data => {
      try {
        console.log('Buffering', data);
        get().playlist.setIsBuffering(data.isBuffering);
      } catch {}
    },

    onControlsVisibilityChange: data => {
      try {
        console.log('Controls visibility changed', data);
        get().playlist.setShowControls(data.isVisible);
      } catch {}
    },

    onExternalPlaybackChange: data => {
      try {
        console.log('External playback changed', data);
      } catch {}
    },

    onFullscreenPlayerWillPresent: data => {
      try {
        console.log('Fullscreen will present', data);
        get().playlist.setIsFullscreen(true);
      } catch {}
    },

    onFullscreenPlayerDidPresent: data => {
      try {
        console.log('Fullscreen did present', data);
      } catch {}
    },

    onFullscreenPlayerWillDismiss: data => {
      try {
        console.log('Fullscreen will dismiss', data);
      } catch {}
    },

    onFullscreenPlayerDidDismiss: data => {
      try {
        console.log('Fullscreen did dismiss', data);
        get().playlist.setIsFullscreen(false);
      } catch {}
    },

    onLoadStart: data => {
      try {
        console.log('Video load start', data);
        get().playlist.setIsLoading(true);
      } catch {}
    },

    onPictureInPictureStatusChanged: data => {
      try {
        console.log('PiP status changed', data);
      } catch {}
    },

    onPlaybackRateChange: data => {
      try {
        console.log('Playback rate changed', data);
        get().playlist.setPlaybackSpeed(data.playbackRate);
      } catch {}
    },

    onVolumeChange: data => {
      try {
        console.log('Volume changed', data);
        get().playlist.setVolume(data.volume);
      } catch {}
    },

    onProgress: data => {
      try {
        const {currentChapterId, currentVideoId} = get().playlist;
        if (currentChapterId && currentVideoId) {
          get().playlist.onPlayerProgressData?.({
            ...data,
            chapterId: currentChapterId,
            videoId: currentVideoId,
          });
        }
      } catch {}
    },

    onReadyForDisplay: data => {
      try {
        console.log('Ready for display', data);
      } catch {}
    },

    onReceiveAdEvent: data => {
      try {
        console.log('Ad event', data);
      } catch {}
    },

    onRestoreUserInterfaceForPictureInPictureStop: data => {
      try {
        console.log('PiP restore UI', data);
      } catch {}
    },

    onSeek: data => {
      try {
        console.log('Seek event', data);
        get().playlist.setCurrentTime(data.currentTime);
      } catch {}
    },

    onTimedMetadata: data => {
      try {
        console.log('Timed metadata', data);
      } catch {}
    },

    onAudioTracks: data => {
      try {
        console.log('Audio tracks', data);
      } catch {}
    },

    onTextTracks: data => {
      try {
        console.log('Text tracks', data);
      } catch {}
    },

    onTextTrackDataChanged: data => {
      try {
        console.log('Text track data changed', data);
      } catch {}
    },

    onVideoTracks: data => {
      try {
        console.log('Video tracks', data);
      } catch {}
    },

    onAspectRatio: data => {
      try {
        console.log('Aspect ratio changed', data);
      } catch {}
    },
  },
});

export default createVideoPlaylistSlice;
