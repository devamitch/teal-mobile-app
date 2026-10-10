import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Storage utility functions
 */

const STORAGE_KEYS = {
  VIDEO_PROGRESS: 'video_progress',
  WATCHED_VIDEOS: 'watched_videos',
  ACTIVITY_RESPONSES: 'activity_responses',
  USER_PREFERENCES: 'user_preferences',
} as const;

/**
 * Save video progress
 */
export const saveVideoProgress = async (
  videoId: string,
  progress: number,
): Promise<void> => {
  try {
    const existingProgress = await getVideoProgress();
    const updatedProgress = {...existingProgress, [videoId]: progress};
    await AsyncStorage.setItem(
      STORAGE_KEYS.VIDEO_PROGRESS,
      JSON.stringify(updatedProgress),
    );
  } catch (error) {
    console.error('Error saving video progress:', error);
  }
};

/**
 * Get video progress
 */
export const getVideoProgress = async (): Promise<Record<string, number>> => {
  try {
    const progress = await AsyncStorage.getItem(STORAGE_KEYS.VIDEO_PROGRESS);
    return progress ? JSON.parse(progress) : {};
  } catch (error) {
    console.error('Error getting video progress:', error);
    return {};
  }
};

/**
 * Save watched videos
 */
export const saveWatchedVideos = async (videoIds: string[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.WATCHED_VIDEOS,
      JSON.stringify(videoIds),
    );
  } catch (error) {
    console.error('Error saving watched videos:', error);
  }
};

/**
 * Get watched videos
 */
export const getWatchedVideos = async (): Promise<string[]> => {
  try {
    const watched = await AsyncStorage.getItem(STORAGE_KEYS.WATCHED_VIDEOS);
    return watched ? JSON.parse(watched) : [];
  } catch (error) {
    console.error('Error getting watched videos:', error);
    return [];
  }
};

/**
 * Clear all storage
 */
export const clearAllStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
};
