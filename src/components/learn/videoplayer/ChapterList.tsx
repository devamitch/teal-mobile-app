import React, {useMemo, useRef} from 'react';
import {
  Dimensions,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {VideoRef} from 'react-native-video';

import useAppStore from '@/core/stores'; // Your store hook
import {useShallow} from 'zustand/react/shallow';

import ThumbnailPlayer from './ThumbnailPlayer';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

interface ChapterListProps {
  visible: boolean;
  onClose: () => void;
  onVideoSelect: (videoId: string) => void;
}

const ChapterList: React.FC<ChapterListProps> = ({
  visible,
  onClose,
  onVideoSelect,
}) => {
  const videoRefs = useRef<{[key: string]: VideoRef | null}>({});

  // Access your store
  const {
    chapters,
    currentVideoId,
    watchedVideos,
    getChapterProgress,
    getVideoProgress,
    isFullscreen,
  } = useAppStore(
    useShallow(state => ({
      chapters: state?.playlist?.chapters ?? [],
      currentVideoId: state?.playlist?.currentVideoId,
      watchedVideos: state?.playlist?.watchedVideos ?? new Array(),
      // watchedVideos: state?.playlist?.watchedVideos ?? new Set(),
      getChapterProgress: state?.playlist?.getChapterProgress,
      getVideoProgress: state?.playlist?.getVideoProgress,
      isFullscreen: state?.playlist?.isFullscreen,
    })),
  );

  // Simulate preloading videos and SRTs
  const allVideos = useMemo(() => {
    return chapters.flatMap(c => c.videos);
  }, [chapters]);

  // Compute chapters with progress info
  const chaptersWithProgress = useMemo(() => {
    return chapters.map(chapter => ({
      ...chapter,
      progress: getChapterProgress?.(chapter.id) ?? 0,
      videos: chapter.videos.map(video => ({
        ...video,
        progress: getVideoProgress?.(video.id) ?? 0,
        watched: watchedVideos?.includes?.(video.id) ?? false,
        // watched: watchedVideos?.has?.(video.id) ?? false,
        isCurrent: video.id === currentVideoId,
      })),
    }));
  }, [
    chapters,
    getChapterProgress,
    getVideoProgress,
    watchedVideos,
    currentVideoId,
  ]);

  // Stats calculation
  const stats = useMemo(() => {
    const totalVideos = chapters.reduce((sum, c) => sum + c.videos.length, 0);
    const watchedCount = watchedVideos?.length ?? 0;
    // const watchedCount = watchedVideos?.size ?? 0;
    const completedChapters = chaptersWithProgress.filter(
      c => c.progress === 100,
    ).length;
    return {
      totalVideos,
      watchedCount,
      completedChapters,
      overallProgress: totalVideos > 0 ? (watchedCount / totalVideos) * 100 : 0,
    };
  }, [chapters, watchedVideos, chaptersWithProgress]);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={false} // full screen modal
      statusBarTranslucent
      onRequestClose={onClose}
      presentationStyle="fullScreen" // ensure full screen
    >
      <Animated.View
        style={styles.overlay}
        entering={FadeIn.duration(300)}
        exiting={FadeOut.duration(300)}>
        <View style={styles.backdrop} />
        <TouchableOpacity
          style={styles.backdropTouchable}
          activeOpacity={1}
          onPress={onClose}
        />

        <Animated.View
          style={styles.modalContainer}
          entering={SlideInDown.duration(400)}
          exiting={SlideOutDown.duration(400)}>
          <SafeAreaView style={styles.modalContent}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <Text style={styles.headerTitle}>Course Modules</Text>
                <Text style={styles.headerSubtitle}>
                  {stats.watchedCount} of {stats.totalVideos} videos completed
                </Text>
              </View>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <MaterialIcons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            {/* Progress Overview */}
            <View style={styles.progressOverview}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {width: `${stats.overallProgress}%`},
                  ]}
                />
              </View>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <MaterialIcons
                    name="check-circle"
                    size={16}
                    color="#4CAF50"
                  />
                  <Text style={styles.statText}>
                    {stats.completedChapters} Chapters
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <MaterialIcons name="trending-up" size={16} color="#2D7D7A" />
                  <Text style={styles.statText}>
                    {Math.round(stats.overallProgress)}% Complete
                  </Text>
                </View>
              </View>
            </View>

            {/* Chapters List */}
            <ScrollView
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}>
              {chaptersWithProgress
                .filter(chapter => ['1', '2', '3'].includes(chapter.id)) // Only show chapters 1, 2, and 3
                .map((chapter, chapterIndex) => (
                  <Animated.View
                    key={chapter.id}
                    style={styles.chapterContainer}
                    entering={FadeIn.delay(100 + chapterIndex * 50)}>
                    {/* Chapter Header */}
                    <View style={styles.chapterHeader}>
                      <View style={styles.chapterInfo}>
                        <Text style={styles.chapterTitle}>
                          {chapterIndex + 1}. {chapter.title}
                        </Text>
                        <Text style={styles.chapterProgress}>
                          {chapter.videos.filter(v => v.watched).length} of{' '}
                          {chapter.videos.length} completed
                        </Text>
                      </View>
                      <View style={styles.chapterProgressContainer}>
                        <View style={styles.chapterProgressBar}>
                          <View
                            style={[
                              styles.chapterProgressFill,
                              {width: `${chapter.progress}%`},
                            ]}
                          />
                        </View>
                        {chapter.progress === 100 && (
                          <MaterialIcons
                            name="check-circle"
                            size={20}
                            color="#4CAF50"
                          />
                        )}
                      </View>
                    </View>

                    {/* Videos List */}
                    <View style={styles.videosContainer}>
                      {chapter.videos.map((video, videoIndex) => (
                        <TouchableOpacity
                          key={video.id}
                          style={[
                            styles.videoItem,
                            video.isCurrent && styles.currentVideoItem,
                          ]}
                          onPress={() => {
                            onVideoSelect(video.id);
                            if (!isFullscreen) onClose();
                          }}>
                          {/* Mini Video Player with preload props if needed */}
                          <View style={styles.videoThumbnail}>
                            <ThumbnailPlayer
                              videoUrl={video.videoUrl}
                              thumbnailUrl={video.thumbnailUrl}
                              srtUrl={video.srtUrl}
                              paused
                            />
                            <View style={styles.playOverlay}>
                              {video.isCurrent ? (
                                <View style={styles.currentIndicator} />
                              ) : (
                                <MaterialIcons
                                  name="play-arrow"
                                  size={16}
                                  color="white"
                                />
                              )}
                            </View>
                            {video.progress > 0 && (
                              <View style={styles.videoProgressContainer}>
                                <View
                                  style={[
                                    styles.videoProgressBar,
                                    {width: `${video.progress * 100}%`},
                                  ]}
                                />
                              </View>
                            )}
                          </View>
                          {/* Video Info */}
                          <View style={styles.videoInfo}>
                            <Text
                              style={[
                                styles.videoTitle,
                                video.isCurrent && styles.currentVideoTitle,
                              ]}
                              numberOfLines={2}>
                              {videoIndex + 1}. {video.title}
                            </Text>
                            <View style={styles.videoMeta}>
                              <View style={styles.videoMetaItem}>
                                <MaterialIcons
                                  name="schedule"
                                  size={12}
                                  color="#666"
                                />
                                <Text style={styles.videoMetaText}>
                                  {video.duration}
                                </Text>
                              </View>
                              {video.srtUrl && (
                                <View style={styles.videoMetaItem}>
                                  <MaterialIcons
                                    name="closed-caption"
                                    size={12}
                                    color="#666"
                                  />
                                </View>
                              )}
                            </View>
                          </View>
                          {/* Status Indicator */}
                          <View style={styles.videoStatus}>
                            {video.watched ? (
                              <MaterialIcons
                                name="check-circle"
                                size={20}
                                color="#4CAF50"
                              />
                            ) : video.progress > 0 ? (
                              <View style={styles.partialIndicator} />
                            ) : (
                              <View style={styles.unwatchedIndicator} />
                            )}
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </Animated.View>
                ))}
            </ScrollView>
          </SafeAreaView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  backdropTouchable: {
    flex: 1,
  },
  // Full-screen modal styles
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%', // full width
    height: '100%', // full height
    backgroundColor: '#fff',
    borderRadius: 0,
    overflow: 'hidden',
    elevation: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalContent: {
    flex: 1,
  },
  // Your existing styles, or customize as needed
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  closeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
  },
  progressOverview: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2D7D7A',
    borderRadius: 3,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  chapterContainer: {
    marginBottom: 16,
    paddingTop: 8,
  },
  chapterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  chapterInfo: {
    flex: 1,
  },
  chapterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  chapterProgress: {
    fontSize: 12,
    color: '#666',
  },
  chapterProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chapterProgressBar: {
    width: 60,
    height: 4,
    backgroundColor: '#F0F0F0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  chapterProgressFill: {
    height: '100%',
    backgroundColor: '#2D7D7A',
    borderRadius: 2,
  },
  videosContainer: {
    paddingHorizontal: 16,
  },
  videoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 4,
  },
  currentVideoItem: {
    backgroundColor: 'rgba(45, 125, 122, 0.1)',
  },
  videoThumbnail: {
    width: 80,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    marginRight: 12,
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2D7D7A',
  },
  videoProgressContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  videoProgressBar: {
    height: '100%',
    backgroundColor: '#2D7D7A',
  },
  videoInfo: {
    flex: 1,
    paddingRight: 8,
  },
  videoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  currentVideoTitle: {
    color: '#2D7D7A',
  },
  videoMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 2,
  },
  videoMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  videoMetaText: {
    fontSize: 11,
    color: '#666',
  },
  videoStatus: {
    width: 24,
    alignItems: 'center',
  },
  partialIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2D7D7A',
  },
  unwatchedIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
});

export default ChapterList;
