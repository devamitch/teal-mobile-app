'use client';

import {
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import type React from 'react';
import {useEffect, useState} from 'react';
import {BackHandler, StatusBar, StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import ChapterList from '@/components/learn/videoplayer/ChapterList';
import VideoPlayer from '@/components/learn/videoplayer/VideoPlayer';
import VideoSettings from '@/components/learn/videoplayer/VideoSettings';
import CompleteButton from '@/components/ui/buttons/complete-button';
import useAppStore from '@/core/stores';
import {useShallow} from 'zustand/react/shallow';

type VideoPlayerScreenParams = {
  chapterId?: string;
  videoId?: string;
  startPos?: number;
  videoUrl?: string;
  srtUrl?: string;
  title?: string;
  module?: any;
  currentIndex?: number;
};

type VideoPlayerScreenRouteProp = RouteProp<
  {VideoPlayer: VideoPlayerScreenParams},
  'VideoPlayer'
>;

const VideoPlayerScreen: React.FC = () => {
  const route = useRoute<VideoPlayerScreenRouteProp>();
  const navigation = useNavigation();

  const {
    chapterId,
    videoId,
    startPos,
    videoUrl,
    srtUrl,
    title,
    module,
    currentIndex,
  } = route.params || {};

  console.log('VideoPlayerScreen params:', {
    chapterId,
    videoId,
    startPos,
    videoUrl,
    srtUrl,
    title,
    module,
    currentIndex,
  });

  // Local state
  const [showChapterList, setShowChapterList] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Store state
  const {
    isFullscreen,
    playVideo,
    getCurrentVideo,
    setIsFullscreen,
    getVideoById,
  } = useAppStore(useShallow(state => state?.playlist));

  // Get completion actions from store
  const {markItemComplete, isItemComplete} = useAppStore(
    state => state.completion,
  );

  const moduleId = 'current_module'; // You might want to pass this as a prop
  const isCompleted = isItemComplete(moduleId, videoId || '');

  const handleVideoComplete = () => {
    if (videoId) {
      markItemComplete(moduleId, videoId);

      // Simply go back to LearnModuleShowcase - no auto-navigation
      navigation.goBack();
    }
  };

  const handleManualComplete = () => {
    handleVideoComplete();
  };

  // Handle back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (isFullscreen) {
          setIsFullscreen(false);
          return true;
        }
        if (showChapterList || showSettings) {
          setShowChapterList(false);
          setShowSettings(false);
          return true;
        }
        return false;
      },
    );

    return () => backHandler.remove();
  }, [isFullscreen, showChapterList, showSettings, setIsFullscreen]);

  const handleClose = () => {
    navigation.goBack();
  };

  const handleVideoSelect = (selectedVideoId: string) => {
    playVideo(selectedVideoId);
    setShowChapterList(false);
  };

  // Get video from store or create CDN video object
  let currentVideo = getVideoById(videoId || '') ?? getCurrentVideo?.();

  // If no video found in store but we have CDN parameters, create a video object
  if (!currentVideo && videoUrl && title) {
    currentVideo = {
      id: videoId || `cdn-${Date.now()}`,
      title: title,
      videoUrl: videoUrl,
      srtUrl: srtUrl || '',
      thumbnailUrl: '',
      endThumbnailUrl: '',
      duration: 0,
      description: '',
      author: '',
    };
  }

  if (!currentVideo) {
    return (
      <View style={styles.errorContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, isFullscreen && styles.fullscreenContainer]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
        hidden={isFullscreen}
      />

      <VideoPlayer
        onClose={handleClose}
        video={currentVideo}
        startPosition={startPos ? Number(startPos) : 0}
        onVideoComplete={handleVideoComplete}
        onShowSettings={() => setShowSettings(true)}
      />

      {/* Complete Button Overlay */}
      {!isFullscreen && (
        <View style={styles.completeButtonOverlay}>
          <CompleteButton
            onPress={handleManualComplete}
            isCompleted={isCompleted}
            size="large"
          />
        </View>
      )}

      <ChapterList
        visible={showChapterList}
        onClose={() => setShowChapterList(false)}
        onVideoSelect={handleVideoSelect}
      />

      <VideoSettings
        visible={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  fullscreenContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completeButtonOverlay: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    zIndex: 10,
  },
});

export default VideoPlayerScreen;
