import useAppStore from '@/core/stores';
import type {VideoData} from '@/data/module-data';
import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Image,
  StyleSheet,
  View,
  type ViewStyle,
  ImageRequireSource,
} from 'react-native';
import Video, {
  SelectedTrackType,
  TextTrackType,
  type OnLoadData,
  type OnProgressData,
  type OnVideoErrorData,
  type VideoRef,
} from 'react-native-video';
import {useShallow} from 'zustand/react/shallow';
import VideoCompletionModal from '../activity/video-completion-modal';
import {getImageSource} from '@/utils/image-utils';

interface ThumbnailPlayerProps extends Partial<VideoData> {
  videoUrl?: string;
  srtUrl?: string;
  style?: ViewStyle;
  allowNativeController?: boolean;
  chapterId: string;
  videoId: string;
  onVideoEnd?: () => void;
  onVideoError?: (error: any) => void;
  startPosition?: number;
}

const ThumbnailPlayer: React.FC<ThumbnailPlayerProps> = ({
  videoUrl,
  thumbnailUrl,
  srtUrl,
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
  const navigation = useNavigation();
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false); // for image fade out

  // Always paused & muted to act as thumbnail
  const paused = true;
  const muted = true;
  const controls = false;

  const {getCurrentVideo, onLoad, onProgress, onEnd, onError, isCcEnabled} =
    useAppStore(
      useShallow(state => ({
        ...state.playlist,
        isCcEnabled: state.playlist.isCcEnabled,
      })),
    );

  useEffect(() => {
    if (playerRef.current) playerRef.current.pause();
  }, []);

  const currentVideoId = getCurrentVideo()?.id;

  // Handlers (preloading, logging, seeking if startPosition > 0)
  const handleLoad = useCallback(
    (data: OnLoadData) => {
      console.log('[ThumbnailPlayer] onLoad fired:', data);
      setIsVideoReady(true); // fade out background image
      if (currentTime > 0) {
        playerRef.current?.seek?.(currentTime);
      }
      onLoad?.({...data, videoId, chapterId});
    },
    [videoId, chapterId, onLoad, currentTime],
  );

  const handleProgress = useCallback(
    (data: OnProgressData) => {
      console.log('[ThumbnailPlayer] onProgress fired:', data);
      onProgress?.({...data, videoId, chapterId});
    },
    [videoId, chapterId, onProgress],
  );

  const handleEnd = useCallback(() => {
    console.log('[ThumbnailPlayer] onEnd fired');
    onEnd?.({videoId, chapterId});
    onVideoEnd?.();
    setShowCompletionModal(true);
  }, [videoId, chapterId, onEnd, onVideoEnd]);

  const handleError = useCallback(
    (data: OnVideoErrorData) => {
      console.error('[ThumbnailPlayer] onError fired:', data?.error);
      onError?.({...data, videoId, chapterId});
      onVideoError?.(data.error);
    },
    [videoId, chapterId, onError, onVideoError],
  );

  // Video source config
  const videoSource = {
    uri: videoUrl,
    headers: {'User-Agent': 'VideoPlayerApp/1.0'},
    shouldCache: true,
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
      {/* Image background visible until video is ready */}
      {!isVideoReady && thumbnailUrl && (
        <Image
          source={getImageSource(thumbnailUrl)}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
      )}

      <Video
        ref={playerRef}
        source={videoSource}
        style={styles.video}
        resizeMode="cover"
        paused={paused}
        muted={muted}
        controls={controls}
        mixWithOthers="duck"
        disableFocus
        hideShutterView
        preventsDisplaySleepDuringVideoPlayback={false}
        preferredForwardBufferDuration={10000} // preload
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
        //        {...videoProps}
        onLoad={handleLoad}
        //        onProgress={handleProgress}
        //        onEnd={handleEnd}
        //        onError={handleError}
      />

      <VideoCompletionModal
        visible={showCompletionModal}
        video={{
          videoUrl,
          thumbnailUrl,
          srtUrl,
          style,
          allowNativeController,
          videoId,
          chapterId,
          onVideoEnd,
          onVideoError,
          startPosition,
        }}
        onClose={() => {
          setShowCompletionModal(false);
          // Since the modal auto-closes, navigate back to LearnModuleShowcase
          navigation.navigate('LearnModuleShowcase' as never);
        }}
        onStartActivity={() => {
          setShowCompletionModal(false);
          navigation.navigate('PostActivity', {
            videoId: videoId,
            activityIndex: 0,
            chapterId: parseInt(chapterId, 10),
          });
        }}
        onSkip={() => setShowCompletionModal(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  video: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
});

ThumbnailPlayer.displayName = 'ThumbnailPlayer';
export default ThumbnailPlayer;
