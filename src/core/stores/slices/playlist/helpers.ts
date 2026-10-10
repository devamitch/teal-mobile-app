import {
  MODULE_MODULE_DATA,
  moduleData,
  type Module,
  type VideoData,
} from '@/data/module-data';
import {enableMapSet} from 'immer';
import {SelectedTrackType, TextTrackType} from 'react-native-video';
import type {Chapter} from './types';

enableMapSet();

export interface Topic extends VideoData {}

// Enhanced Chapter interface that extends the base Module
export interface EnhancedChapter extends Chapter {
  videoCount?: number;
  totalDuration?: string;
  completedCount: number;
  completionPercentage?: number;
  // hasActivities: boolean;
  // averageRating: number;
  // totalReviews: number;
  // description: string;
  // thumbnailUrl: string;
  // recentVideo: {
  //   id: string;
  //   title: string;
  //   duration: string;
  //   thumbnailUrl: string;
  //   isCompleted: boolean;
  //   // isActive: boolean;
  // };
}

export interface ChapterVideo {
  id: string;
  title: string;
  author: string;
  authorImageUri: string;
  reviewStars: number;
  reviewCount: number;
  publishDate: string;
  duration: string;
  description: string;
  videoUrl: string;
  srtUrl: string;
  folder: string;
  postActivities?: any[];
  checkingYourself?: any;
  moduleSummary?: any;
  moduleId: string;
  moduleTitle: string;
  completed: boolean;
  isActive: boolean;
}

/**
 * Utility function to parse duration string and convert to minutes
 */
const parseDurationToMinutes = (duration: string): number => {
  try {
    const parts = duration.split(':').map(Number);
    if (parts.length === 2) {
      const [minutes = 0, seconds = 0] = parts;
      return minutes + (seconds || 0) / 60;
    } else if (parts.length === 3) {
      const [hours = 0, minutes = 0, seconds = 0] = parts;
      return hours * 60 + minutes + (seconds || 0) / 60;
    }
    return 0;
  } catch {
    return 0;
  }
};

/**
 * Format minutes to human readable duration
 */
const formatDuration = (totalMinutes: number): string => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60);
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
};

/**
 * Calculate chapter statistics based on actual progress data
 */
export const calculateChapterStats = (module: Module) => {
  const totalMinutes = module.videos.reduce((acc, video) => {
    return acc + parseDurationToMinutes(String(video.duration || ''));
  }, 0);

  const totalDuration = formatDuration(totalMinutes);

  // Calculate actual completion based on watched videos and progress
  const completedCount = module.videos.filter(video => {
    const isWatched = false;
    const progress = 0;
    return isWatched || progress > 0.9; // Consider 90%+ as completed
  }).length;

  const completionPercentage =
    module.videos.length > 0
      ? Math.round((completedCount / module.videos.length) * 100)
      : 0;

  // Calculate ratings
  const totalRating = module.videos.reduce(
    (acc, video) => acc + (video.reviewStars || 0),
    0,
  );
  const averageRating =
    module.videos.length > 0 ? totalRating / module.videos.length : 0;

  const totalReviews = module.videos.reduce(
    (acc, video) => acc + (video.reviewCount || 0),
    0,
  );

  // Check for activities
  const hasActivities = module.videos.some(
    video => video.postActivities && video.postActivities.length > 0,
  );

  // Find the most recent/current video
  const inProgressVideos = module.videos;

  const nextUnwatchedVideo = module.videos;

  return {
    totalDuration,
    completedCount,
    completionPercentage,
    averageRating: Number(averageRating.toFixed(1)),
    totalReviews,
    hasActivities,
    recentVideo: [],
  };
};

export const calculateWathedChapterStats = (
  module: Module,
  watchedVideos: Array<string> = new Array(),
  videoProgress: Record<string, number> = {},
) => {
  const totalMinutes = module.videos.reduce((acc, video) => {
    return acc + parseDurationToMinutes(String(video.duration || ''));
  }, 0);

  const totalDuration = formatDuration(totalMinutes);

  // Calculate actual completion based on watched videos and progress
  const completedCount = module.videos.filter(video => {
    const isWatched = watchedVideos?.includes?.(video.id);
    // const isWatched = watchedVideos?.includes?.(video.id);
    const progress = videoProgress[video.id] || 0;
    return isWatched || progress > 0.9; // Consider 90%+ as completed
  }).length;

  const completionPercentage =
    module.videos.length > 0
      ? Math.round((completedCount / module.videos.length) * 100)
      : 0;

  // Calculate ratings
  const totalRating = module.videos.reduce(
    (acc, video) => acc + (video.reviewStars || 0),
    0,
  );
  const averageRating =
    module.videos.length > 0 ? totalRating / module.videos.length : 0;

  const totalReviews = module.videos.reduce(
    (acc, video) => acc + (video.reviewCount || 0),
    0,
  );

  // Check for activities
  const hasActivities = module.videos.some(
    video => video.postActivities && video.postActivities.length > 0,
  );

  // Find the most recent/current video
  const inProgressVideos = module.videos.filter(video => {
    const progress = videoProgress[video.id] || 0;
    return (
      progress > 0 && progress < 0.9 && !watchedVideos?.includes?.(video.id)
    );
  });

  const nextUnwatchedVideo = module.videos.find(video => {
    const progress = videoProgress[video.id] || 0;
    return progress === 0 && !watchedVideos?.includes?.(video.id);
  });

  // Priority: in-progress video > next unwatched > first video
  const recentVideo =
    inProgressVideos[0] || nextUnwatchedVideo || module.videos[0];

  const recentVideoProgress = videoProgress?.[recentVideo?.id || ''] || 0;
  const isRecentVideoCompleted =
    watchedVideos?.includes?.(recentVideo?.id || '') ||
    recentVideoProgress > 0.9;

  return {
    totalDuration,
    completedCount,
    completionPercentage,
    averageRating: Number(averageRating.toFixed(1)),
    totalReviews,
    hasActivities,
    recentVideo: recentVideo
      ? {
          id: recentVideo.id,
          title: recentVideo.title,
          duration: recentVideo.duration,
          thumbnailUrl: `https://picsum.photos/320/180?random=${recentVideo.id}`,
          isCompleted: isRecentVideoCompleted,
          isActive: recentVideoProgress > 0 && recentVideoProgress < 0.9,
        }
      : null,
  };
};

/**
 * Enhanced transform function that creates chapters with real progress data
 */

export const transformToChapters = () =>
  moduleData?.map?.(module => {
    const stats = calculateChapterStats(module);
    return {
      ...module,
      ...stats,
      completed: 0,
      progress: 0,
      videoCount: module?.videos?.length,
      description: `${
        module.videos.length
      } comprehensive lessons covering ${module.title.toLowerCase()}`,
      thumbnailUrl: `https://picsum.photos/400/240?random=${module.id}`,
      videos: module?.videos?.map(item => ({
        ...item, // All optional properties...

        // Explicitly preserve essential video properties
        videoUrl: item.videoUrl,
        srtUrl: item.srtUrl,
        id: item.id,
        title: item.title,

        currentTime: 0,
        videoFinished: false,
        isBuffering: true,
        isLoaded: false,
        paused: undefined,
        muted: true,
        repeat: false,
        volume: 1,
        playbackSpeed: 1,
        fullscreen: false,

        error: null,
        audioTracks: [],
        videoTracks: [],
        selectedTextTrack: {
          type: SelectedTrackType.TITLE,
          value: 'English',
        },
        selectedAudioTrack: undefined,
        selectedVideoTrack: undefined,
        subtitlesEnabled: true,
        subtitleStyle: undefined,
        drm: undefined,
        adConfig: undefined,
        bufferConfig: undefined,
        debugConfig: undefined,
        metadata: undefined,
        chapters: [],
        lastLoadEvent: undefined,
        lastProgressEvent: undefined,
        lastBufferEvent: undefined,
        lastSeekEvent: undefined,
        lastAdEvent: undefined,
        playInBackground: false,
        playWhenInactive: false,
        ignoreSilentSwitch: 'inherit',
        mixWithOthers: 'inherit',
        allowsExternalPlayback: false,
        resizeMode: 'contain',
        contentStartTime: 0,
        localSourceEncryptionKeyScheme: '',
        autoPlayNext: false,
        shuffleMode: false,
        controls: true,
        preventSleepDuringPlayback: false,
        showNotificationControls: true,
        showCustomControls: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        poster: item?.thumbnailUrl,
        currentPlaybackTime: 0,
        playableDuration: 0,
        seekableDuration: 0,
        rate: 1.0,
        textTracks: [
          {
            title: 'English',
            language: 'en',
            type: TextTrackType.SUBRIP, // Changed from VTT to SUBRIP for .srt files
            uri: item?.srtUrl,
            startPosition: 0,
          },
        ],

        source: {
          uri: item?.videoUrl,
          headers: {'User-Agent': 'VideoPlayerApp/1.0'},
          shouldCache: true,
          selectedTextTrack: {
            type: SelectedTrackType.TITLE,
            value: 'English',
          },
          textTracks: [
            {
              title: 'English',
              language: 'en',
              type: TextTrackType.SUBRIP, // Changed from VTT to SUBRIP for .srt files
              uri: item?.srtUrl,
              startPosition: 0,
            },
          ],
          textTracksAllowChunklessPreparation: false,
        },

        chapterId: module.id,
        videoId: item.id,
        hasActivity: (item?.postActivities?.length || 0) > 0,
        // playableDuration: 0,
        // seekableDuration: 0,
        // rate: 1,
        // currentPlaybackTime: 0,
      })),
      recentVideo: stats.recentVideo || {
        id: module?.videos?.[0]?.id || '1.1.1',
        title: module?.videos?.[0]?.title || '',
        duration: module?.videos?.[0]?.duration || '0:00',
        thumbnailUrl: `https://picsum.photos/320/180?random=${
          module?.videos?.[0]?.id || '1.1.1'
        }`,
        isCompleted: false,
        isActive: false,
      },
    };
  }) ?? [];

/**
 * Get all chapters with enhanced data
 */
export const getAllChapters = (
  watchedVideos: Array<string> = new Array(),
  videoProgress: Record<string, number> = {},
): EnhancedChapter[] => {
  return transformToChapters(watchedVideos, videoProgress);
};

/**
 * Get chapter by ID with real progress data
 */
export const getChapterById = (
  chapterId: string,
  watchedVideos: Array<string> = new Array(),
  videoProgress: Record<string, number> = {},
): EnhancedChapter | undefined => {
  const chapters = getAllChapters(watchedVideos, videoProgress);
  return chapters.find(chapter => chapter.id === chapterId);
};

/**
 * Get videos for a specific chapter as topics with real completion status
 */
export const getTopicsForChapter = (
  chapterId: string,
  watchedVideos: Array<string> = new Array(),
  videoProgress: Record<string, number> = {},
  currentVideoId?: string,
): Topic[] => {
  try {
    const module = MODULE_MODULE_DATA.find(m => m.id === chapterId);
    if (!module) return [];

    return module.videos.map((video, index) => {
      const progress = videoProgress[video.id] || 0;
      const isWatched = watchedVideos?.includes?.(video.id);
      const isCompleted = isWatched || progress > 0.9;

      return {
        id: video.id,
        title: video.title,
        duration: video.duration,
        completed: isCompleted,
        hasActivity: (video.postActivities?.length || 0) > 0,
        isActive: currentVideoId === video.id,
        progress: progress,
      };
    });
  } catch (error) {
    console.error('Error getting topics for chapter:', error);
    return [];
  }
};

/**
 * Get video data for chapter with enhanced information
 */
export const getVideoDataForChapter = (
  chapterId: string,
  videoIndex = 0,
  watchedVideos: Array<string> = new Array(),
  videoProgress: Record<string, number> = {},
): VideoData | null => {
  try {
    const module = MODULE_MODULE_DATA.find(m => m.id === chapterId);
    if (!module || module.videos.length === 0) return null;

    const video = module.videos[videoIndex] || module.videos[0];
    if (!video) return null;

    const progress = videoProgress[video.id] || 0;
    const isWatched = watchedVideos?.includes?.(video.id);

    return {
      id: video.id,
      title: video.title,
      author: video.author,
      authorImage: video.authorImageUri,
      rating: video.reviewStars,
      reviewCount: video?.reviewCount?.toString(),
      description: video.description,
      videoUrl: video.videoUrl,
      srtUrl: video.srtUrl,
      thumbnailUrl: `https://picsum.photos/800/450?random=${video.id}`,
      hasPostActivity: (video.postActivities?.length || 0) > 0,
      activityCompleted: isWatched || progress > 0.9,
      progress: progress,
      duration: video.duration,
      folder: video.folder,
    };
  } catch (error) {
    console.error('Error getting video data for chapter:', error);
    return null;
  }
};

/**
 * Get overall statistics with real data
 */
export const getOverallStatistics = (
  watchedVideos: Array<string> = new Array(),
  videoProgress: Record<string, number> = {},
) => {
  try {
    const chapters = getAllChapters(watchedVideos, videoProgress);

    const totalVideos = chapters.reduce(
      (acc, chapter) => acc + chapter.videoCount,
      0,
    );

    const totalDuration = chapters.reduce((acc, chapter) => {
      const [hours = 0, minutes = 1] = chapter?.totalDuration?.includes('h')
        ? chapter?.totalDuration
            .split('h')
            .map(s => Number.parseInt(s.replace('m', '')))
        : [
            0,
            Number.parseInt((chapter?.totalDuration || '1m')?.replace('m', '')),
          ];
      return acc + hours * 60 + minutes;
    }, 0);

    const totalCompleted = chapters.reduce(
      (acc, chapter) => acc + chapter.completedCount,
      0,
    );

    const overallCompletion =
      totalVideos > 0 ? Math.round((totalCompleted / totalVideos) * 100) : 0;

    const totalHours = Math.floor(totalDuration / 60);
    const remainingMinutes = totalDuration % 60;

    const completedChapters = chapters.filter(c => c.completed).length;

    return {
      totalChapters: chapters.length,
      totalVideos,
      totalDuration:
        totalHours > 0
          ? `${totalHours}h ${remainingMinutes}m`
          : `${remainingMinutes}m`,
      overallCompletion,
      totalCompleted,
      completedChapters,
      chaptersWithActivities: chapters.filter(c => c.hasActivities).length,
      averageChapterCompletion:
        chapters.length > 0
          ? chapters.reduce((acc, c) => acc + c?.completionPercentage, 0) /
            chapters.length
          : 0,
    };
  } catch (error) {
    console.error('Error getting overall statistics:', error);
    return {
      totalChapters: 0,
      totalVideos: 0,
      totalDuration: '0m',
      overallCompletion: 0,
      totalCompleted: 0,
      completedChapters: 0,
      chaptersWithActivities: 0,
      averageChapterCompletion: 0,
    };
  }
};

/**
 * Search chapters with enhanced filtering
 */
export const searchChapters = (
  query: string,
  watchedVideos: Array<string> = new Array(),
  videoProgress: Record<string, number> = {},
): EnhancedChapter[] => {
  try {
    const chapters = getAllChapters(watchedVideos, videoProgress);
    const lowerQuery = query.toLowerCase();

    return chapters.filter(
      chapter =>
        chapter.title.toLowerCase().includes(lowerQuery) ||
        chapter.description.toLowerCase().includes(lowerQuery) ||
        chapter.videos.some(video =>
          video.title.toLowerCase().includes(lowerQuery),
        ),
    );
  } catch (error) {
    console.error('Error searching chapters:', error);
    return [];
  }
};

/**
 * Get next video to watch in a chapter
 */
export const getNextVideoInChapter = (
  chapterId: string,
  watchedVideos: Array<string> = new Array(),
  videoProgress: Record<string, number> = {},
): VideoData | null => {
  try {
    const module = MODULE_MODULE_DATA.find(m => m.id === chapterId);
    if (!module) return null;

    // Find first incomplete video
    const nextVideo = module.videos.find(video => {
      const progress = videoProgress[video.id] || 0;
      const isWatched = watchedVideos?.includes?.(video.id);
      return !isWatched && progress < 0.9;
    });

    if (!nextVideo) return null;

    return getVideoDataForChapter(
      chapterId,
      module.videos.indexOf(nextVideo),
      watchedVideos,
      videoProgress,
    );
  } catch (error) {
    console.error('Error getting next video in chapter:', error);
    return null;
  }
};

/**
 * Get chapter progress summary
 */
export const getChapterProgressSummary = (
  chapterId: string,
  watchedVideos: Array<string> = new Array(),
  videoProgress: Record<string, number> = {},
) => {
  try {
    const chapter = getChapterById(chapterId, watchedVideos, videoProgress);
    if (!chapter) return null;

    const videosWithProgress = chapter.videos.map(video => ({
      id: video.id,
      title: video.title,
      progress: videoProgress[video.id] || 0,
      isWatched: watchedVideos?.includes?.(video.id),
      isCompleted:
        watchedVideos?.includes?.(video.id) ||
        (videoProgress[video.id] || 0) > 0.9,
    }));

    const totalWatchTime = videosWithProgress.reduce((acc, video) => {
      const duration = parseDurationToMinutes(
        chapter.videos.find(v => v.id === video.id)?.duration || '0:00',
      );
      return acc + duration * video.progress;
    }, 0);

    return {
      chapterTitle: chapter.title,
      totalVideos: chapter.videos.length,
      completedVideos: chapter.completedCount,
      completionPercentage: chapter.completionPercentage,
      totalWatchTime: formatDuration(totalWatchTime),
      videosWithProgress,
      nextVideo: getNextVideoInChapter(chapterId, watchedVideos, videoProgress),
    };
  } catch (error) {
    console.error('Error getting chapter progress summary:', error);
    return null;
  }
};

/**
 * Utility to get video by ID across all chapters
 */
export const findVideoById = (videoId: string): VideoData | null => {
  try {
    for (const module of MODULE_MODULE_DATA) {
      const video = module.videos.find(v => v.id === videoId);
      if (video) {
        return {
          id: video.id,
          title: video.title,
          author: video.author,
          authorImage: video.authorImageUri,
          rating: video.reviewStars,
          reviewCount: video?.reviewCount?.toString(),
          description: video.description,
          videoUrl: video.videoUrl,
          srtUrl: video.srtUrl,
          thumbnailUrl: `https://picsum.photos/800/450?random=${video.id}`,
          hasPostActivity: (video.postActivities?.length || 0) > 0,
          duration: video.duration,
          folder: video.folder,
          moduleId: module.id,
          moduleTitle: module.title,
        };
      }
    }
    return null;
  } catch (error) {
    console.error('Error finding video by ID:', error);
    return null;
  }
};
