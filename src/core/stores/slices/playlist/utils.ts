import {VideoData} from '@/data/module-data';
import type {Chapter} from './types';

/**
 * Utility function to safely update video data in chapters
 */
export const updateVideoInChapters = (
  chapters: Chapter[],
  chapterId: string,
  videoId: string,
  updateData: Partial<VideoData>,
): Chapter[] => {
  try {
    return chapters.map(chapter =>
      chapter?.id === chapterId
        ? {
            ...chapter,
            videos: chapter?.videos?.map(video =>
              video?.id === videoId ? {...video, ...updateData} : video,
            ),
          }
        : chapter,
    );
  } catch (error) {
    console.error('Failed to update video in chapters:', error);
    return chapters;
  }
};

/**
 * Utility function to safely update chapter data
 */
export const updateChapterInChapters = (
  chapters: Chapter[],
  chapterId: string,
  updateData: Partial<Chapter>,
): Chapter[] => {
  try {
    return chapters.map(chapter =>
      chapter?.id === chapterId ? {...chapter, ...updateData} : chapter,
    );
  } catch (error) {
    console.error('Failed to update chapter:', error);
    return chapters;
  }
};

/**
 * Utility function to create event handler with consistent error handling
 */
export const createEventHandler = <T>(
  handler: (data: T) => void,
  eventName: string,
) => {
  return (data: T) => {
    try {
      handler(data);
    } catch (error) {
      console.error(`Failed to handle ${eventName} event:`, error);
    }
  };
};

/**
 * Utility function to safely find video across all chapters
 */
export const findVideoInChapters = (
  chapters: Chapter[],
  videoId: string,
): {video: VideoData | undefined; chapter: Chapter | undefined} => {
  try {
    for (const chapter of chapters ?? []) {
      const video = chapter?.videos?.find?.(v => v?.id === videoId);
      if (video) {
        return {video, chapter};
      }
    }
    return {video: undefined, chapter: undefined};
  } catch (error) {
    console.error('Failed to find video in chapters:', error);
    return {video: undefined, chapter: undefined};
  }
};

/**
 * Utility function to calculate chapter progress
 */
export const calculateChapterProgress = (
  chapter: Chapter | undefined,
  watchedVideos: Array<string>,
  videoProgress: Record<string, number>,
): number => {
  try {
    if (!chapter?.videos?.length) return 0;

    const completedCount =
      chapter?.videos?.filter(v => {
        const isWatched = watchedVideos.has(v.id);
        const progress = videoProgress[v.id] || 0;
        return isWatched || progress > 0.9;
      })?.length || 1;

    return (completedCount / chapter?.videos?.length || 1) * 100;
  } catch (error) {
    return 0;
  }
};

/**
 * Utility function to get next video in sequence
 */
export const getNextVideoInSequence = (
  chapters: Chapter[],
  currentChapterId: string,
  currentVideoIndex: number,
  repeatMode: 'none' | 'one' | 'all',
  shuffleMode: boolean,
): {videoId: string | null; chapterId: string | null} => {
  try {
    const currentChapter = chapters.find(c => c.id === currentChapterId);
    if (!currentChapter) return {videoId: null, chapterId: null};

    if (repeatMode === 'one') {
      const video = currentChapter.videos[currentVideoIndex];
      return {videoId: video?.id || null, chapterId: currentChapterId};
    }

    if (shuffleMode) {
      const allVideos = chapters.flatMap(c => c.videos || []);
      const randomVideo =
        allVideos[Math.floor(Math.random() * allVideos.length)];
      const randomChapter = chapters.find(c =>
        c.videos?.some(v => v.id === randomVideo?.id),
      );
      return {
        videoId: randomVideo?.id || null,
        chapterId: randomChapter?.id || null,
      };
    }

    const nextIndex = currentVideoIndex + 1;
    if (nextIndex < (currentChapter.videos?.length || 0)) {
      return {
        videoId: currentChapter.videos?.[nextIndex]?.id || null,
        chapterId: currentChapterId,
      };
    }

    // Move to next chapter
    const currentChapterIndex = chapters.findIndex(
      c => c.id === currentChapterId,
    );
    const nextChapter = chapters[currentChapterIndex + 1];

    if (nextChapter?.videos?.[0]) {
      return {
        videoId: nextChapter.videos[0].id,
        chapterId: nextChapter.id,
      };
    }

    // If repeat all, go back to first video
    if (repeatMode === 'all' && chapters[0]?.videos?.[0]) {
      return {
        videoId: chapters[0].videos[0].id,
        chapterId: chapters[0].id,
      };
    }

    return {videoId: null, chapterId: null};
  } catch (error) {
    console.error('Failed to get next video:', error);
    return {videoId: null, chapterId: null};
  }
};

/**
 * Utility function to get previous video in sequence
 */
export const getPreviousVideoInSequence = (
  chapters: Chapter[],
  currentChapterId: string,
  currentVideoIndex: number,
): {videoId: string | null; chapterId: string | null} => {
  try {
    const currentChapter = chapters.find(c => c.id === currentChapterId);
    if (!currentChapter) return {videoId: null, chapterId: null};

    if (currentVideoIndex > 0) {
      return {
        videoId: currentChapter.videos?.[currentVideoIndex - 1]?.id || null,
        chapterId: currentChapterId,
      };
    }

    // Move to previous chapter
    const currentChapterIndex = chapters.findIndex(
      c => c.id === currentChapterId,
    );
    const prevChapter = chapters[currentChapterIndex - 1];

    if (prevChapter?.videos?.length) {
      const lastVideo = prevChapter.videos[prevChapter.videos.length - 1];
      return {
        videoId: lastVideo?.id || null,
        chapterId: prevChapter.id,
      };
    }

    return {videoId: null, chapterId: null};
  } catch (error) {
    console.error('Failed to get previous video:', error);
    return {videoId: null, chapterId: null};
  }
};
