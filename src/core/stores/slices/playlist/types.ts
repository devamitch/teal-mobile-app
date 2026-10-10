import type {Module, VideoData} from '@/data/module-data';
import {enableMapSet} from 'immer';

enableMapSet();

import {
  OnAudioFocusChangedData,
  OnAudioTracksData,
  OnBandwidthUpdateData,
  OnBufferData,
  OnControlsVisibilityChange,
  OnExternalPlaybackChangeData,
  OnLoadData,
  OnLoadStartData,
  OnPictureInPictureStatusChangedData,
  OnPlaybackRateChangeData,
  OnProgressData,
  OnReceiveAdEventData,
  OnSeekData,
  OnTextTrackDataChangedData,
  OnTextTracksData,
  OnTimedMetadataData,
  OnVideoAspectRatioData,
  OnVideoErrorData,
  OnVideoTracksData,
  OnVolumeChangeData,
} from 'react-native-video';

// ================= ACTIVITY TYPES =================
export type ActivityType =
  | 'calendar'
  | 'rating_scale'
  | 'text'
  | 'checklist'
  | 'multiple_choice'
  | 'story_card'
  | 'review_card'
  | 'checking_yourself'
  | 'mental_health_review'
  | 'crisis_support_review';

export type ResponseType = 'review' | 'rating' | 'text' | 'single' | 'multiple';

export interface BaseActivity {
  id: string;
  type: ActivityType;
  question: string;
  description?: string;
  responseType: ResponseType;
  tags?: string[];
}

export interface CalendarActivity extends BaseActivity {
  type: 'calendar';
  responseType: 'review';
}

export interface RatingScaleActivity extends BaseActivity {
  type: 'rating_scale';
  responseType: 'rating';
  scaleRange: {
    min: number;
    max: number;
    minLabel: string;
    maxLabel: string;
  };
  options?: Array<{
    id: string;
    text: string;
  }>;
}

export interface TextActivity extends BaseActivity {
  type: 'text';
  responseType: 'text';
  examples?: string[];
  hasAddMore?: boolean;
}

export interface ChecklistActivity extends BaseActivity {
  type: 'checklist';
  responseType: 'multiple';
  options: Array<{
    id: string;
    text: string;
    category?: string;
  }>;
  minSelections?: number;
  hasAddMore?: boolean;
}

export interface MultipleChoiceActivity extends BaseActivity {
  type: 'multiple_choice';
  responseType: 'single' | 'multiple';
  options: Array<{
    id: string;
    text: string;
    isCorrect?: boolean;
    category?: string;
  }>;
  correctAnswer?: string;
  correctFeedback?: string;
  incorrectFeedback?: string;
}

export interface StoryCardActivity extends BaseActivity {
  type: 'story_card';
  responseType: 'review';
}

export interface ReviewCardActivity extends BaseActivity {
  type: 'review_card';
  responseType: 'review';
}

export interface MentalHealthReviewActivity extends BaseActivity {
  type: 'mental_health_review';
  responseType: 'review';
}

export interface CrisisSupportReviewActivity extends BaseActivity {
  type: 'crisis_support_review';
  responseType: 'review';
}

export type VideoActivity =
  | CalendarActivity
  | RatingScaleActivity
  | TextActivity
  | ChecklistActivity
  | MultipleChoiceActivity
  | StoryCardActivity
  | ReviewCardActivity
  | MentalHealthReviewActivity
  | CrisisSupportReviewActivity;

export interface CheckingYourself {
  question: string;
  yesText: string;
  noText: string;
}

// ================= RESPONSE TYPES =================
export type ActivityResponse<T extends VideoActivity> =
  T extends CalendarActivity
    ? {selectedDate?: string}
    : T extends RatingScaleActivity
    ? {rating: number}
    : T extends TextActivity
    ? {text: string}
    : T extends ChecklistActivity
    ? {selectedIds: string[]}
    : T extends MultipleChoiceActivity
    ? T['responseType'] extends 'single'
      ? {selectedId: string}
      : {selectedIds: string[]}
    : T extends StoryCardActivity
    ? {viewed: boolean}
    : T extends ReviewCardActivity
    ? {reviewed: boolean}
    : T extends MentalHealthReviewActivity
    ? {reviewed: boolean}
    : T extends CrisisSupportReviewActivity
    ? {reviewed: boolean}
    : never;

export type ActivityResponseMap = {
  [activityId: string]: ActivityResponse<VideoActivity>;
};

export type ExtendedActivityResponse<T extends VideoActivity> =
  T extends CalendarActivity
    ? {selectedDate?: string}
    : T extends RatingScaleActivity
    ? {rating: number}
    : T extends TextActivity
    ? {text: string}
    : T extends ChecklistActivity
    ? {selectedIds: string[]}
    : T extends MultipleChoiceActivity
    ? T['responseType'] extends 'single'
      ? {selectedId: string}
      : {selectedIds: string[]}
    : T extends StoryCardActivity
    ? {viewed: boolean}
    : T extends ReviewCardActivity
    ? {reviewed: boolean}
    : T extends MentalHealthReviewActivity
    ? {reviewed: boolean}
    : T extends CrisisSupportReviewActivity
    ? {reviewed: boolean}
    : T extends CheckingYourself
    ? {checked?: boolean} // For "Checking Yourself" responses
    : never;

export interface Chapter extends Module {
  id: string;
  title: string;
  videos: VideoData[];
  completed: boolean;
  progress: number;
  averageRating?: number;
  videoCount?: number;
  hasActivities?: number;
  completedCount?: number;
  recentVideo?: VideoData;
  completionPercentage?: number;
  totalDuration?: string;
}

export interface PlaylistState {
  currentActivityIndex: number;
  isSubmitting: boolean;
  chapters: Chapter[];
  currentChapterId: string | null;
  currentVideoId: string | null;
  currentVideoIndex: number;
  isPlaying: boolean;
  autoPlayNext: boolean;
  shuffleMode: boolean;
  repeatMode: 'none' | 'one' | 'all';
  playbackSpeed: number;
  volume: number;
  currentTime: number;
  duration: number;
  isBuffering: boolean;
  isLoading: boolean;
  error: string | null;
  isFullscreen: boolean;
  showControls: boolean;
  isCcEnabled: boolean;
  videoHistory: string[];
  watchedVideos: Array<string>;
  newVideos: string[];
  videoProgress: Record<string, number>;
  activityResponses: Record<string, ActivityResponseMap>;
  loadedSubtitles: Record<string, string>;
  videoSettings: Record<string, any>;
  tempResponse?: {[key: string]: string};
}

export interface PlaylistActions {
  setCurrentActivityIndex: (index: number) => void;
  setIsSubmitting: (is: boolean) => void;
  refreshChapters: () => void;
  getChapterById: (chapterId: string) => Chapter | undefined;
  getChapterProgress: (chapterId: string) => number;
  playChapter: (chapterId: string) => void;
  playChapterVideos: (chapterId: string) => void;

  getCurrentVideo: () => VideoData | undefined;
  getCurrentChapter: () => Chapter | undefined;
  getVideoById: (videoId: string) => VideoData | undefined;
  playVideo: (videoId: string) => void;
  playNextVideo: () => void;
  playPreviousVideo: () => void;

  // Playback state
  setIsPlaying: (playing: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setIsBuffering: (buffering: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Playback settings
  setAutoPlayNext: (autoPlay: boolean) => void;
  setTempResponse: (tempResponse: PlaylistState['tempResponse']) => void;
  setShuffleMode: (shuffle: boolean) => void;
  setRepeatMode: (mode: 'none' | 'one' | 'all') => void;
  setPlaybackSpeed: (speed: number) => void;
  setVolume: (volume: number) => void;
  setCcEnabled: (enabled: boolean) => void;
  setIsFullscreen: (fullscreen: boolean) => void;
  setShowControls: (show: boolean) => void;

  // Progress tracking
  updateVideoProgress: (videoId: string, progress: number) => void;
  markVideoAsWatched: (videoId: string) => void;
  getVideoProgress?: (videoId: string) => number;
  isVideoWatched: (videoId: string) => boolean;
  //
  saveCheckingYourselfData: (
    videoId: string,
    question: string,
    data: CheckingYourself,
  ) => void;

  // Save response for a specific activity
  saveActivityResponse?: <T extends VideoActivity>(
    videoId: string,
    activityId: string,
    response: ExtendedActivityResponse<T>,
  ) => void;

  // Retrieve response for a specific activity
  getActivityResponse?: <T extends VideoActivity>(
    videoId: string,
    activityId: string,
  ) => ExtendedActivityResponse<T> | undefined;
  // Subtitle and settings management
  saveLoadedSubtitles: (videoId: string, subtitleContent: string) => void;
  getLoadedSubtitles: (videoId: string) => string | null;
  saveVideoSettings: (videoId: string, settings: any) => void;
  getVideoSettings: (videoId: string) => any;

  // Statistics and utilities
  getPlaylistStats: () => {
    totalVideos: number;
    watchedVideoCount: number;
    completedChapterCount: number;
  };
  resetPlaylist: () => void;

  // Player event handlers
  onPlayerProgressData?: (data: {
    currentTime: number;
    playableDuration: number;
    seekableDuration: number;
    chapterId: string;
    videoId: string;
  }) => void;

  onPlaybackStateChanged?: (data: {
    isPlaying?: boolean;
    isSeeking?: boolean;
    chapterId: string;
    videoId: string;
  }) => void;

  onLoad?: (
    e: OnLoadData & {
      chapterId: string;
      videoId: string;
    },
  ) => void;

  // ... (keep all other existing event handlers exactly as they were)
  onAudioBecomingNoisy?: (e: {chapterId: string; videoId: string}) => void;
  onAudioFocusChanged?: (
    e: OnAudioFocusChangedData & {
      chapterId: string;
      videoId: string;
    },
  ) => void;
  onIdle?: (e: {chapterId: string; videoId: string}) => void;
  onBandwidthUpdate?: (
    e: OnBandwidthUpdateData & {
      chapterId: string;
      videoId: string;
    },
  ) => void;
  onBuffer?: (
    e: OnBufferData & {
      chapterId: string;
      videoId: string;
    },
  ) => void;
  onControlsVisibilityChange?: (
    e: OnControlsVisibilityChange & {
      chapterId: string;
      videoId: string;
    },
  ) => void;
  onEnd?: (e: {chapterId: string; videoId: string}) => void;
  onError?: (
    e: OnVideoErrorData & {
      chapterId: string;
      videoId: string;
    },
  ) => void;
  onExternalPlaybackChange?: (
    e: OnExternalPlaybackChangeData & {
      chapterId: string;
      videoId: string;
    },
  ) => void;
  onFullscreenPlayerWillPresent?: (e: {
    chapterId: string;
    videoId: string;
  }) => void;
  onFullscreenPlayerDidPresent?: (e: {
    chapterId: string;
    videoId: string;
  }) => void;
  onFullscreenPlayerWillDismiss?: (e: {
    chapterId: string;
    videoId: string;
  }) => void;
  onFullscreenPlayerDidDismiss?: (e: {
    chapterId: string;
    videoId: string;
  }) => void;
  onLoadStart?: (
    e: OnLoadStartData & {
      chapterId: string;
      videoId: string;
    },
  ) => void;
  onPictureInPictureStatusChanged?: (
    e: OnPictureInPictureStatusChangedData & {
      chapterId: string;
      videoId: string;
    },
  ) => void;
  onPlaybackRateChange?: (
    e: OnPlaybackRateChangeData & {
      chapterId: string;
      videoId: string;
    },
  ) => void;
  onVolumeChange?: (
    e: OnVolumeChangeData & {
      chapterId: string;
      videoId: string;
    },
  ) => void;
  onProgress?: (
    e: OnProgressData & {
      chapterId: string;
      videoId: string;
    },
  ) => void;
  onReadyForDisplay?: (e: {chapterId: string; videoId: string}) => void;
  onReceiveAdEvent?: (
    e: OnReceiveAdEventData & {
      chapterId: string;
      videoId: string;
    },
  ) => void;
  onRestoreUserInterfaceForPictureInPictureStop?: (e: {
    chapterId: string;
    videoId: string;
  }) => void;
  onSeek?: (
    e: OnSeekData & {
      chapterId: string;
      videoId: string;
    },
  ) => void;
  onTimedMetadata?: (
    e: OnTimedMetadataData & {
      chapterId: string;
      videoId: string;
    },
  ) => void;
  onAudioTracks?: (
    e: OnAudioTracksData & {
      chapterId: string;
      videoId: string;
    },
  ) => void;
  onTextTracks?: (
    e: OnTextTracksData & {
      chapterId: string;
      videoId: string;
    },
  ) => void;
  onTextTrackDataChanged?: (
    e: OnTextTrackDataChangedData & {
      chapterId: string;
      videoId: string;
    },
  ) => void;
  onVideoTracks?: (
    e: OnVideoTracksData & {
      chapterId: string;
      videoId: string;
    },
  ) => void;
  onAspectRatio?: (
    e: OnVideoAspectRatioData & {
      chapterId: string;
      videoId: string;
    },
  ) => void;
}

export interface VideoPlaylistSlice {
  playlist: PlaylistState & PlaylistActions;
}
