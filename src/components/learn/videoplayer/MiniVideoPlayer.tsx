import useAppStore from '@/core/stores';
import type {VideoData} from '@/data/module-data';
import {useNavigation} from '@react-navigation/native';
import type React from 'react';
import {useCallback, useEffect, useRef, useState} from 'react';
import {StyleSheet, View, type ViewStyle} from 'react-native';
import Video, {
  SelectedTrackType,
  TextTrackType,
  type OnAudioTracksData,
  type OnBandwidthUpdateData,
  type OnBufferData,
  type OnControlsVisibilityChange,
  type OnExternalPlaybackChangeData,
  type OnLoadData,
  type OnLoadStartData,
  type OnPictureInPictureStatusChangedData,
  type OnPlaybackRateChangeData,
  type OnProgressData,
  type OnReceiveAdEventData,
  type OnSeekData,
  type OnTextTrackDataChangedData,
  type OnTextTracksData,
  type OnTimedMetadataData,
  type OnVideoAspectRatioData,
  type OnVideoErrorData,
  type OnVideoTracksData,
  type OnVolumeChangeData,
  type VideoRef,
} from 'react-native-video';
import {useShallow} from 'zustand/react/shallow';
import VideoCompletionModal from '../activity/video-completion-modal';

interface MiniVideoPlayerProps extends Partial<VideoData> {
  videoUrl?: string;
  srtUrl?: string;
  paused?: boolean;
  muted?: boolean;
  controls?: boolean;
  style?: ViewStyle;
  allowNativeController?: boolean;
  chapterId: string;
  videoId: string;
  onVideoEnd?: () => void;
  onVideoError?: (error: any) => void;
  startPosition?: number;
}

const MiniVideoPlayer: React.FC<MiniVideoPlayerProps> = ({
  videoUrl,
  thumbnailUrl,
  srtUrl,
  paused = true,
  muted = false,
  controls = false,
  style,
  allowNativeController = false,
  videoId,
  chapterId,
  onVideoEnd,
  onVideoError,
  startPosition = 0,
  currentPlaybackTime,
  currentTime = 0,
}) => {
  if (!videoUrl) {
    return null;
  }
  const playerRef = useRef<VideoRef>(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [forcePaused, setForcePaused] = useState(false);
  const [isCurrentVideo, setIsCurrentVideo] = useState(false);

  const navigation = useNavigation();

  // Get current video from store
  const {currentVideoId, isCcEnabled} = useAppStore(
    useShallow(state => ({
      currentVideoId: state?.playlist?.currentVideoId,
      isCcEnabled: state?.playlist?.isCcEnabled,
    })),
  );

  // Effect to control video state based on current video status
  useEffect(() => {
    const isCurrent = currentVideoId === videoId;
    setIsCurrentVideo(isCurrent);
    setForcePaused(!isCurrent);

    console.log({isCurrent, currentVideoId, videoId});

    if (!isCurrent && playerRef.current) {
      // Reset the video if it's not the current one
      playerRef.current.seek(0);
      playerRef.current.pause();
    }
  }, [currentVideoId, videoId]);

  // Handle activity start
  const handleStartActivity = useCallback(() => {
    setShowCompletionModal(false);
    navigation.navigate('PostActivity', {
      videoId,
      activityIndex: 0,
      chapterId: parseInt(chapterId, 10),
    });
  }, [navigation, videoId, chapterId]);

  // Handle skip activities
  const handleSkipActivities = useCallback(() => {
    setShowCompletionModal(false);
  }, []);

  // Handle completion modal close - this will be called when modal auto-closes
  const handleCompletionModalClose = useCallback(() => {
    setShowCompletionModal(false);
    // Since the modal auto-closes immediately, we need to check if there are activities
    // and handle navigation accordingly. For now, we'll navigate back to LearnModuleShowcase
    // as the simplified flow requested by the user
    navigation.navigate('LearnModuleShowcase' as never);
  }, [navigation]);

  // Get all necessary functions from the playlist store
  const {
    onLoad,
    onProgress,
    onEnd,
    onError,
    onBuffer,
    onSeek,
    onLoadStart,
    onAudioTracks,
    onTextTracks,
    onVideoTracks,
    onAspectRatio,
    onPlaybackStateChanged,
    onAudioBecomingNoisy,
    onAudioFocusChanged,
    onReadyForDisplay,
    onIdle,
    onBandwidthUpdate,
    onControlsVisibilityChange,
    onExternalPlaybackChange,
    onFullscreenPlayerWillPresent,
    onFullscreenPlayerDidPresent,
    onFullscreenPlayerWillDismiss,
    onFullscreenPlayerDidDismiss,
    onPictureInPictureStatusChanged,
    onPlaybackRateChange,
    onVolumeChange,
    onReceiveAdEvent,
    onRestoreUserInterfaceForPictureInPictureStop,
    onTimedMetadata,
    onTextTrackDataChanged,
  } = useAppStore(useShallow(state => state?.playlist));

  // Block all actions if not the current video
  const shouldBlockActions = !isCurrentVideo;

  // Event handlers with proper error handling
  const handleLoad = useCallback(
    (data: OnLoadData) => {
      if (shouldBlockActions) return;

      try {
        playerRef?.current?.seek(currentTime || 0);
        playerRef?.current?.dismissFullscreenPlayer();
        onLoad?.({...data, videoId, chapterId});
      } catch (error) {
        console.error('Error handling load event:', error);
      }
    },
    [videoId, chapterId, onLoad, currentTime, shouldBlockActions],
  );

  const handleProgress = useCallback(
    (data: OnProgressData) => {
      if (shouldBlockActions) return;

      try {
        onProgress?.({...data, videoId, chapterId});
      } catch (error) {
        console.error('Error handling progress event:', error);
      }
    },
    [videoId, chapterId, onProgress, shouldBlockActions],
  );

  const handleEnd = useCallback(() => {
    if (shouldBlockActions) return;

    try {
      onEnd?.({videoId, chapterId});
      onVideoEnd?.();
      setShowCompletionModal(true);
    } catch (error) {
      console.error('Error handling end event:', error);
      setShowCompletionModal(true);
    }
  }, [videoId, chapterId, onEnd, onVideoEnd, shouldBlockActions]);

  const handleError = useCallback(
    (data: OnVideoErrorData) => {
      if (shouldBlockActions) return;

      try {
        onError?.({...data, videoId, chapterId});
        onVideoError?.(data.error);
      } catch (error) {
        console.error('Error handling error event:', error);
      }
    },
    [videoId, chapterId, onError, onVideoError, shouldBlockActions],
  );

  const handleBuffer = useCallback(
    (data: OnBufferData) => {
      if (shouldBlockActions) return;

      try {
        if (currentTime > 0 && playerRef.current?.seek && data?.isBuffering) {
          playerRef?.current?.seek(currentTime || 0);
        }
        onBuffer?.({...data, videoId, chapterId});
      } catch (error) {
        console.error('Error handling buffer event:', error);
      }
    },
    [videoId, chapterId, onBuffer, shouldBlockActions, currentTime],
  );

  const handleSeek = useCallback(
    (data: OnSeekData) => {
      if (shouldBlockActions) return;

      try {
        onSeek?.({...data, videoId, chapterId});
      } catch (error) {
        console.error('Error handling seek event:', error);
      }
    },
    [videoId, chapterId, onSeek, shouldBlockActions],
  );

  const handleLoadStart = useCallback(
    (data: OnLoadStartData) => {
      if (shouldBlockActions) return;

      try {
        if (currentTime > 0 && playerRef.current?.seek) {
          playerRef?.current?.seek(currentTime || 0);
        }
        onLoadStart?.({...data, videoId, chapterId});
      } catch (error) {
        console.error('Error handling load start event:', error);
      }
    },
    [videoId, chapterId, onLoadStart, startPosition, shouldBlockActions],
  );

  const handlePlaybackStateChanged = useCallback(
    (data: {isPlaying?: boolean; isSeeking?: boolean}) => {
      if (shouldBlockActions) return;

      try {
        if (currentTime > 0 && playerRef.current?.seek && !data?.isPlaying) {
          playerRef?.current?.seek(currentTime);
        }
        onPlaybackStateChanged?.({...data, videoId, chapterId});
      } catch (error) {
        console.error('Error handling playback state change:', error);
      }
    },
    [
      videoId,
      chapterId,
      onPlaybackStateChanged,
      shouldBlockActions,
      currentTime,
    ],
  );

  const handleAudioBecomingNoisy = useCallback(() => {
    if (shouldBlockActions) return;

    try {
      onAudioBecomingNoisy?.({videoId, chapterId});
    } catch (error) {
      console.error('Error handling audio becoming noisy:', error);
    }
  }, [videoId, chapterId, onAudioBecomingNoisy, shouldBlockActions]);

  const handleAudioFocusChanged = useCallback(
    (data: any) => {
      if (shouldBlockActions) return;

      try {
        onAudioFocusChanged?.({...data, videoId, chapterId});
      } catch (error) {
        console.error('Error handling audio focus change:', error);
      }
    },
    [videoId, chapterId, onAudioFocusChanged, shouldBlockActions],
  );

  const handleReadyForDisplay = useCallback(() => {
    if (shouldBlockActions) return;

    try {
      onReadyForDisplay?.({videoId, chapterId});
    } catch (error) {
      console.error('Error handling ready for display:', error);
    }
  }, [videoId, chapterId, onReadyForDisplay, shouldBlockActions]);

  const handleAudioTracks = useCallback(
    (data: OnAudioTracksData) => {
      if (shouldBlockActions) return;

      try {
        onAudioTracks?.({...data, videoId, chapterId});
      } catch (error) {
        console.error('Error handling audio tracks:', error);
      }
    },
    [videoId, chapterId, onAudioTracks, shouldBlockActions],
  );

  const handleTextTracks = useCallback(
    (data: OnTextTracksData) => {
      if (shouldBlockActions) return;

      try {
        console.log('onTextTracks', data);
        onTextTracks?.({...data, videoId, chapterId});
      } catch (error) {
        console.error('Error handling text tracks:', error);
      }
    },
    [videoId, chapterId, onTextTracks, shouldBlockActions],
  );

  const handleVideoTracks = useCallback(
    (data: OnVideoTracksData) => {
      if (shouldBlockActions) return;

      try {
        onVideoTracks?.({...data, videoId, chapterId});
      } catch (error) {
        console.error('Error handling video tracks:', error);
      }
    },
    [videoId, chapterId, onVideoTracks, shouldBlockActions],
  );

  const handleAspectRatio = useCallback(
    (data: OnVideoAspectRatioData) => {
      if (shouldBlockActions) return;

      try {
        onAspectRatio?.({...data, videoId, chapterId});
      } catch (error) {
        console.error('Error handling aspect ratio:', error);
      }
    },
    [videoId, chapterId, onAspectRatio, shouldBlockActions],
  );

  const handleIdle = useCallback(() => {
    if (shouldBlockActions) return;

    try {
      onIdle?.({videoId, chapterId});
    } catch (error) {
      console.error('Error handling idle event:', error);
    }
  }, [videoId, chapterId, onIdle, shouldBlockActions]);

  const handleBandwidthUpdate = useCallback(
    (data: OnBandwidthUpdateData) => {
      if (shouldBlockActions) return;

      try {
        onBandwidthUpdate?.({...data, videoId, chapterId});
      } catch (error) {
        console.error('Error handling bandwidth update:', error);
      }
    },
    [videoId, chapterId, onBandwidthUpdate, shouldBlockActions],
  );

  const handleControlsVisibilityChange = useCallback(
    (data: OnControlsVisibilityChange) => {
      if (shouldBlockActions) return;

      try {
        onControlsVisibilityChange?.({...data, videoId, chapterId});
      } catch (error) {
        console.error('Error handling controls visibility change:', error);
      }
    },
    [videoId, chapterId, onControlsVisibilityChange, shouldBlockActions],
  );

  const handleExternalPlaybackChange = useCallback(
    (data: OnExternalPlaybackChangeData) => {
      if (shouldBlockActions) return;

      try {
        onExternalPlaybackChange?.({...data, videoId, chapterId});
      } catch (error) {
        console.error('Error handling external playback change:', error);
      }
    },
    [videoId, chapterId, onExternalPlaybackChange, shouldBlockActions],
  );

  const handleFullscreenPlayerWillPresent = useCallback(() => {
    if (shouldBlockActions) return;

    try {
      onFullscreenPlayerWillPresent?.({videoId, chapterId});
    } catch (error) {
      console.error('Error handling fullscreen will present:', error);
    }
  }, [videoId, chapterId, onFullscreenPlayerWillPresent, shouldBlockActions]);

  const handleFullscreenPlayerDidPresent = useCallback(() => {
    if (shouldBlockActions) return;

    try {
      onFullscreenPlayerDidPresent?.({videoId, chapterId});
    } catch (error) {
      console.error('Error handling fullscreen did present:', error);
    }
  }, [videoId, chapterId, onFullscreenPlayerDidPresent, shouldBlockActions]);

  const handleFullscreenPlayerWillDismiss = useCallback(() => {
    if (shouldBlockActions) return;

    try {
      onFullscreenPlayerWillDismiss?.({videoId, chapterId});
    } catch (error) {
      console.error('Error handling fullscreen will dismiss:', error);
    }
  }, [videoId, chapterId, onFullscreenPlayerWillDismiss, shouldBlockActions]);

  const handleFullscreenPlayerDidDismiss = useCallback(() => {
    if (shouldBlockActions) return;

    try {
      onFullscreenPlayerDidDismiss?.({videoId, chapterId});
    } catch (error) {
      console.error('Error handling fullscreen did dismiss:', error);
    }
  }, [videoId, chapterId, onFullscreenPlayerDidDismiss, shouldBlockActions]);

  const handlePictureInPictureStatusChanged = useCallback(
    (data: OnPictureInPictureStatusChangedData) => {
      if (shouldBlockActions) return;

      try {
        onPictureInPictureStatusChanged?.({...data, videoId, chapterId});
      } catch (error) {
        console.error('Error handling PiP status change:', error);
      }
    },
    [videoId, chapterId, onPictureInPictureStatusChanged, shouldBlockActions],
  );

  const handlePlaybackRateChange = useCallback(
    (data: OnPlaybackRateChangeData) => {
      if (shouldBlockActions) return;

      try {
        onPlaybackRateChange?.({...data, videoId, chapterId});
      } catch (error) {
        console.error('Error handling playback rate change:', error);
      }
    },
    [videoId, chapterId, onPlaybackRateChange, shouldBlockActions],
  );

  const handleVolumeChange = useCallback(
    (data: OnVolumeChangeData) => {
      if (shouldBlockActions) return;

      try {
        onVolumeChange?.({...data, videoId, chapterId});
      } catch (error) {
        console.error('Error handling volume change:', error);
      }
    },
    [videoId, chapterId, onVolumeChange, shouldBlockActions],
  );

  const handleReceiveAdEvent = useCallback(
    (data: OnReceiveAdEventData) => {
      if (shouldBlockActions) return;

      try {
        onReceiveAdEvent?.({...data, videoId, chapterId});
      } catch (error) {
        console.error('Error handling ad event:', error);
      }
    },
    [videoId, chapterId, onReceiveAdEvent, shouldBlockActions],
  );

  const handleRestoreUserInterfaceForPictureInPictureStop = useCallback(() => {
    if (shouldBlockActions) return;

    try {
      onRestoreUserInterfaceForPictureInPictureStop?.({videoId, chapterId});
    } catch (error) {
      console.error('Error handling PiP restore UI:', error);
    }
  }, [
    videoId,
    chapterId,
    onRestoreUserInterfaceForPictureInPictureStop,
    shouldBlockActions,
  ]);

  const handleTimedMetadata = useCallback(
    (data: OnTimedMetadataData) => {
      if (shouldBlockActions) return;

      try {
        onTimedMetadata?.({...data, videoId, chapterId});
      } catch (error) {
        console.error('Error handling timed metadata:', error);
      }
    },
    [videoId, chapterId, onTimedMetadata, shouldBlockActions],
  );

  const handleTextTrackDataChanged = useCallback(
    (data: OnTextTrackDataChangedData) => {
      if (shouldBlockActions) return;

      try {
        console.log('onTextTrackDataChanged', data);
        onTextTrackDataChanged?.({...data, videoId, chapterId});
      } catch (error) {
        console.error('Error handling text track data change:', error);
      }
    },
    [videoId, chapterId, onTextTrackDataChanged, shouldBlockActions],
  );

  // Prepare video source
  const videoSource = {
    uri: videoUrl,
    headers: {'User-Agent': 'VideoPlayerApp/1.0'},
    shouldCache: isCurrentVideo, // Only cache current video
    textTracks: srtUrl
      ? [
          {
            title: 'English',
            language: 'en' as const,
            type: TextTrackType.SUBRIP,
            uri: srtUrl,
          },
        ]
      : [],
  };

  return (
    <View style={[styles.container, style]}>
      <Video
        ref={playerRef}
        //        {...videoProps}
        source={videoSource}
        style={styles.video}
        resizeMode="cover"
        paused={paused || !isCurrentVideo}
        muted={muted}
        controls={controls}
        ignoreSilentSwitch="obey"
        mixWithOthers="duck"
        disableFocus={!isCurrentVideo}
        hideShutterView
        progressUpdateInterval={1000}
        currentPlaybackTime={currentPlaybackTime || 0}
        selectedTextTrack={
          isCcEnabled
            ? {
                type: SelectedTrackType.TITLE,
                value: 'English',
              }
            : ({type: 'disabled'} as any)
        }
        allowsExternalPlayback={false}
        preventsDisplaySleepDuringVideoPlayback={isCurrentVideo}
        preferredForwardBufferDuration={isCurrentVideo ? 10000 : 0}
        onLoad={handleLoad}
        onProgress={handleProgress}
        onEnd={handleEnd}
        onError={handleError}
        //        onBuffer={handleBuffer}
        //        onSeek={handleSeek}
        onLoadStart={handleLoadStart}
        onPlaybackStateChanged={handlePlaybackStateChanged}
        //        onAudioBecomingNoisy={handleAudioBecomingNoisy}
        // onAudioFocusChanged={handleAudioFocusChanged}
        //        onReadyForDisplay={handleReadyForDisplay}
        onAudioTracks={handleAudioTracks}
        onTextTracks={handleTextTracks}
        onVideoTracks={handleVideoTracks}
        //        onVideoAspectRatio={handleAspectRatio}
        //        onIdle={handleIdle}
        //        onBandwidthUpdate={handleBandwidthUpdate}
        //        onControlsVisibilityChange={handleControlsVisibilityChange}
        //        onExternalPlaybackChange={handleExternalPlaybackChange}
        //        onFullscreenPlayerWillPresent={handleFullscreenPlayerWillPresent}
        //        onFullscreenPlayerDidPresent={handleFullscreenPlayerDidPresent}
        //        onFullscreenPlayerWillDismiss={handleFullscreenPlayerWillDismiss}
        //        onFullscreenPlayerDidDismiss={handleFullscreenPlayerDidDismiss}
        //        onPictureInPictureStatusChanged={handlePictureInPictureStatusChanged}
        //        onPlaybackRateChange={handlePlaybackRateChange}
        //        onVolumeChange={handleVolumeChange}
        //        onReceiveAdEvent={handleReceiveAdEvent}
        //        onRestoreUserInterfaceForPictureInPictureStop={
        //          handleRestoreUserInterfaceForPictureInPictureStop
        //        }
        onTimedMetadata={handleTimedMetadata}
        onTextTrackDataChanged={handleTextTrackDataChanged}
      />

      <VideoCompletionModal
        visible={showCompletionModal && isCurrentVideo}
        video={{
          videoUrl,
          thumbnailUrl,
          srtUrl,
          paused: paused || !isCurrentVideo,
          muted,
          controls: isCurrentVideo && controls,
          style,
          allowNativeController,
          videoId,
          chapterId,
          onVideoEnd,
          onVideoError,
          startPosition,
        }}
        onClose={handleCompletionModalClose}
        onStartActivity={handleStartActivity}
        onSkip={handleSkipActivities}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: 'black', // Fallback when video is loading
  },
  video: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
});

MiniVideoPlayer.displayName = 'MiniVideoPlayer';

export default MiniVideoPlayer;
