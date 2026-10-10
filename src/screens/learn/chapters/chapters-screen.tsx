'use client';

import type React from 'react';
import {useCallback, useMemo, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Animated, {
  FadeIn,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {MEDIA_CHAPTER_THEME as THEME, VideoData} from '@/data/module-data';
import {getOverallStatistics} from '@/utils/chapters-utils';

// Import components
import VideoCompletionModal from '@/components/learn/activity/video-completion-modal';
import ChapterCard from '@/components/learn/chapters/chapter-card';
import {EmptyChapters} from '@/components/learn/chapters/chapter-modules';
import CurrentVideoPlayer from '@/components/learn/chapters/current-video-player';
import StatisticsBar from '@/components/learn/chapters/statistics-bar';
import CurrentVideoPlaylist from '@/components/learn/chapters/video-playlist';
import useAppStore from '@/core/stores';
import {useNavigation} from '@react-navigation/native';
import {useShallow} from 'zustand/react/shallow';

const AnimatedScrollView = Animated.createAnimatedComponent(
  Animated.ScrollView,
);

interface ChaptersListProps {
  onChapterPress?: (chapterId: string) => void;
  onVideoPress?: (
    videoId: string,
    chapterId: string,
    startPos?: number,
  ) => void;
  onBackPress?: () => void;
}

const ChapterList: React.FC<ChaptersListProps> = ({
  onChapterPress,
  onVideoPress,
  onBackPress,
}) => {
  const safeAreaInsets = useSafeAreaInsets();
  const scrollOffset = useSharedValue(0);

  const {getCurrentVideo, chapters} = useAppStore(
    useShallow(state => state.playlist),
  );

  const statistics = useMemo(() => getOverallStatistics(), []);
  const currentVideo = getCurrentVideo?.();

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollOffset.value = event.contentOffset.y;
    },
  });

  const handleChapterPress = useCallback(
    (chapterId: string) => {
      onChapterPress?.(chapterId);
    },
    [onChapterPress],
  );

  const handleVideoPress = useCallback(
    (videoId: string, chapterId: string, startPos?: number) => {
      onVideoPress?.(videoId, chapterId, startPos);
    },
    [onVideoPress],
  );

  const handlePlayPress = useCallback(() => {
    if (currentVideo) {
      handleVideoPress(currentVideo.id, currentVideo?.chapterId);
    }
  }, [currentVideo, handleVideoPress]);

  if (chapters.length === 0) {
    return <EmptyChapters />;
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <AnimatedScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {paddingBottom: safeAreaInsets.bottom + 32},
        ]}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}>
        {/* Statistics Bar */}
        <StatisticsBar
          totalChapters={statistics.totalChapters}
          totalVideos={statistics.totalVideos}
          totalDuration={statistics.totalDuration}
          overallCompletion={statistics.overallCompletion}
        />

        <CurrentVideoPlayer onPlayPress={handlePlayPress} />

        <CurrentVideoPlaylist onVideoPress={handleVideoPress} />

        <Animated.View
          entering={FadeIn.delay(500)}
          style={styles.chaptersContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>All Modules</Text>
            <Text style={styles.sectionSubtitle}>
              Choose a module to explore
            </Text>
          </View>

          {chapters
            .filter(chapter => ['1', '2', '3'].includes(chapter.id)) // Only show chapters 1, 2, and 3
            .map((chapter, index) => (
              <ChapterCard
                key={chapter.id}
                chapter={chapter}
                index={index}
                onPress={() => handleChapterPress(chapter.id)}
                onVideoPress={handleVideoPress}
              />
            ))}
        </Animated.View>
      </AnimatedScrollView>
    </GestureHandlerRootView>
  );
};

const ChaptersScreen = () => {
  const navigation = useNavigation();
  const [modal, setModal] = useState(false);
  const [chapterId, setChapterId] = useState<string>();
  const [completedVideo, setCompleteVideo] = useState<VideoData>();
  const [startPos, setStartPos] = useState(0);

  const {
    getVideoById,
    getChapterById,
    getChapterProgress,
    getVideoProgress,
    isVideoWatched,
    playVideo,
    playChapterVideos,
  } = useAppStore(state => state.playlist);

  const handleChapterPress = useCallback(
    (chapterId: string) => {
      const chapter = getChapterById?.(chapterId);
      const videos = chapter?.videos;
      const playingVideo = videos?.find(item => item?.status !== 'playing');
      if (playingVideo) {
        playChapterVideos?.(chapterId);
        playVideo?.(playingVideo?.id);
        navigation.navigate('ChapterDetails', {chapterId});
        return;
      }

      const firstVideo = videos?.[0];

      playChapterVideos?.(chapterId);
      playVideo?.(firstVideo?.id || '1.1');
      navigation.navigate('ChapterDetails', {chapterId});
    },
    [navigation],
  );

  const handleVideoPress = useCallback(
    (videoId: string, chapterId: string, startPos?: number, skip?: boolean) => {
      const video = getVideoById?.(videoId);
      const isWatched =
        isVideoWatched?.(videoId) ||
        video?.status === 'ended' ||
        video?.completed;

      if (isWatched && !skip) {
        setCompleteVideo(video);
        setChapterId(chapterId);
        setStartPos(startPos || 0);
        return setModal(true);
      }

      playChapterVideos?.(chapterId);
      playVideo?.(videoId);
      setCompleteVideo(undefined);
      setChapterId('');
      setStartPos(0);
      navigation.navigate('VideoPlayer', {videoId, chapterId, startPos});
    },
    [navigation, playChapterVideos, playVideo],
  );

  const onStartActivity = useCallback(() => {
    setModal(false);
    setCompleteVideo(undefined);
    navigation.navigate('PostActivity', {
      videoId: completedVideo?.id || '',
      activityIndex: 0,
      chapterId,
    });
  }, [navigation, chapterId, completedVideo?.id]);

  const handleBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <>
      <ChapterList
        onBackPress={handleBackPress}
        onChapterPress={handleChapterPress}
        onVideoPress={handleVideoPress}
      />
      <VideoCompletionModal
        visible={modal && !!completedVideo}
        video={completedVideo}
        onClose={() => setModal(false)}
        onStartActivity={onStartActivity}
        onSkip={() => {
          handleVideoPress(
            completedVideo?.id || '',
            chapterId || '',
            startPos,
            true,
          );
        }}
      />
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.primary,
  },
  scrollView: {
    flex: 1,
    backgroundColor: THEME.colors.surface,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: THEME.spacing.lg,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: THEME.spacing.xl,
  },
  messageContainer: {
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 20,
    fontWeight: '700',
    color: THEME.colors.text,
    marginBottom: THEME.spacing.xs,
    textAlign: 'center',
  },
  loadingSubtext: {
    fontSize: 14,
    color: THEME.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyText: {
    fontSize: 22,
    fontWeight: '700',
    color: THEME.colors.text,
    marginBottom: THEME.spacing.xs,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 16,
    color: THEME.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  chaptersContainer: {
    paddingTop: THEME.spacing.lg,
  },
  sectionHeader: {
    paddingHorizontal: THEME.spacing.lg,
    marginBottom: THEME.spacing.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: THEME.colors.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: THEME.colors.textSecondary,
  },
});

export default ChaptersScreen;
