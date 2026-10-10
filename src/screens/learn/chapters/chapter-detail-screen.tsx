import MiniVideoPlayer from '@/components/learn/videoplayer/MiniVideoPlayer';
import ThumbnailPlayer from '@/components/learn/videoplayer/ThumbnailPlayer';
import useAppStore from '@/core/stores';
import {VideoData} from '@/data/module-data';
import {formatDuration, formatReviewCount} from '@/utils/format';
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import type React from 'react';
import {useCallback, useMemo, useState} from 'react';
import {
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {FadeIn, SlideInDown} from 'react-native-reanimated';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useShallow} from 'zustand/react/shallow';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

type ChapterDetailParams = {
  chapterId: string;
  startPosition: number;
};

type ChapterDetailRouteProp = RouteProp<
  {ChapterDetail: ChapterDetailParams},
  'ChapterDetail'
>;

const ChapterDetailScreen: React.FC = () => {
  const route = useRoute<ChapterDetailRouteProp>();
  const navigation = useNavigation();
  const {chapterId} = route.params;
  const insets = useSafeAreaInsets();

  // Store state with proper error handling
  const {
    getCurrentVideo,
    getChapterById,
    getChapterProgress,
    getVideoProgress,
    isVideoWatched,
    playVideo,
    playChapterVideos,
    onEnd,
    getVideoById,
  } = useAppStore(useShallow(state => state?.playlist || {}));

  const chapterProgress = getChapterProgress?.(chapterId) || 0;
  const chapter = getChapterById?.(chapterId);

  // Restrict access to only modules 1, 2, and 3
  if (chapterId && !['1', '2', '3'].includes(chapterId)) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>This module is not yet available</Text>
        <Text style={styles.errorSubtext}>
          More modules will be updated once their activities are done
        </Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const firstVideo = useMemo(() => {
    try {
      const currentVideo = getCurrentVideo?.();
      const videoExists = chapter?.videos?.find(
        item => item?.videoUrl === currentVideo?.videoUrl,
      );
      return videoExists || chapter?.videos?.[0];
    } catch (error) {
      console.error('Error getting first video:', error);
      return chapter?.videos?.[0];
    }
  }, [getCurrentVideo, chapter]);

  // Handle video completion
  const handleVideoEnd = useCallback(() => {
    // Simply go back to LearnModuleShowcase - no auto-navigation
    navigation.navigate('LearnModuleShowcase' as never);
  }, [navigation]);

  const handleVideoPress = useCallback(
    (videoId: string, chapterId: string, startPos?: number) => {
      // Always allow navigation to video player - users can revisit completed content
      playChapterVideos?.(chapterId);
      playVideo?.(videoId);
      navigation.navigate('VideoPlayer', {
        videoId,
        chapterId,
        startPos: startPos || 0,
      });
    },
    [navigation, playChapterVideos, playVideo, getVideoById, isVideoWatched],
  );

  // const onhandleVideoPress = useCallback(
  //   (videoId: string, startPos?: number) => {
  //     try {
  //       playChapterVideos?.(chapterId);
  //       playVideo?.(videoId);
  //       navigation.navigate(
  //         'VideoPlayer' as never,
  //         {
  //           videoId,
  //           chapterId,
  //           startPos,
  //         } as never,
  //       );
  //     } catch (error) {
  //       console.error('Error handling video press:', error);
  //     }
  //   },
  //   [navigation, chapterId, playVideo, playChapterVideos, handleVideoEnd],
  // );

  const handlePlayChapter = useCallback(() => {
    try {
      playChapterVideos?.(chapterId);
      navigation.navigate(
        'VideoPlayer' as never,
        {
          chapterId,
        } as never,
      );
    } catch (error) {
      console.error('Error playing chapter:', error);
    }
  }, [navigation, chapterId, playChapterVideos, handleVideoEnd]);

  if (!chapter) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Chapter not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <StatusBar hidden />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
        contentContainerStyle={{flexGrow: 1, paddingBottom: 100}}>
        {/* Hero Video Section */}
        <Animated.View
          style={[styles.heroSection, {height: 250 + insets.top}]}
          entering={FadeIn.duration(600)}>
          {firstVideo && (
            <MiniVideoPlayer
              {...firstVideo}
              muted={false}
              controls={true}
              paused={false}
              allowNativeController={false}
              chapterId={chapterId}
              videoId={firstVideo?.id || ''}
              videoUrl={firstVideo?.videoUrl}
              onVideoEnd={handleVideoEnd}
            />
          )}
        </Animated.View>

        {/* Chapter Info */}
        <Animated.View style={styles.infoSection} entering={FadeIn.delay(200)}>
          <View style={styles.infoGradient}>
            <LinearGradient
              colors={['#ffffff', '#f8f9fa']}
              style={StyleSheet.absoluteFillObject}
            />
            <Text style={styles.chapterTitle}>{chapter.title}</Text>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <View style={styles.statIcon}>
                  <MaterialIcons
                    name="video-library"
                    size={16}
                    color="#2D7D7A"
                  />
                </View>
                <Text style={styles.statText}>
                  {chapter.videos?.length || 0} videos
                </Text>
              </View>

              <View style={styles.statItem}>
                <View style={styles.statIcon}>
                  <MaterialIcons name="schedule" size={16} color="#2D7D7A" />
                </View>
                <Text style={styles.statText}>
                  {formatDuration(
                    chapter.videos?.reduce((total, video) => {
                      try {
                        const [min, sec] = (video.duration || '0:0')
                          .split(':')
                          .map(Number);
                        return total + (min || 0) * 60 + (sec || 0);
                      } catch {
                        return total;
                      }
                    }, 0) || 0,
                  )}
                </Text>
              </View>

              <View style={styles.statItem}>
                <View style={styles.statIcon}>
                  <MaterialIcons name="trending-up" size={16} color="#4CAF50" />
                </View>
                <Text style={styles.statText}>
                  {Math.round(chapterProgress)}% complete
                </Text>
              </View>
            </View>

            {/* Enhanced Progress Bar */}
            <View style={styles.progressContainer}>
              <View style={styles.progressTrack}>
                <LinearGradient
                  colors={['#2D7D7A', '#4CAF50']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={[styles.progressFill, {width: `${chapterProgress}%`}]}
                />
              </View>
              <Text style={styles.progressText}>
                {Math.round(chapterProgress)}% Complete
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Videos List */}
        <Animated.View
          style={styles.videosSection}
          entering={SlideInDown.delay(400)}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Course Videos</Text>
            <Text style={styles.sectionSubtitle}>
              {chapter.videos?.filter(v => isVideoWatched?.(v.id)).length || 0}{' '}
              of {chapter.videos?.length || 0} completed
            </Text>
          </View>

          {chapter.videos?.map((video, index) => {
            try {
              const isWatched = isVideoWatched?.(video.id) || false;
              const progress = getVideoProgress?.(video.id) || 0;
              const hasActivities =
                video.postActivities && video.postActivities.length > 0;

              return (
                <Animated.View
                  key={video.id}
                  entering={SlideInDown.delay(100 * index)}
                  style={styles.videoItemContainer}>
                  <TouchableOpacity
                    style={[
                      styles.videoItem,
                      video?.status == 'ended' && styles.completedVideoItem,
                    ]}
                    onPress={() =>
                      handleVideoPress(video.id, chapterId, video?.currentTime)
                    }
                    activeOpacity={0.8}>
                    {/* Video Thumbnail */}
                    <View style={styles.videoThumbnail}>
                      <ThumbnailPlayer
                        {...video}
                        style={styles.thumbnailImage}
                        videoId={video?.id}
                        chapterId={chapterId}
                        paused={true}
                      />

                      {/* Status Overlay */}
                      <View style={styles.statusOverlay}>
                        {isWatched ? (
                          <View style={styles.completedBadge}>
                            <MaterialIcons
                              name="check-circle"
                              size={20}
                              color="#f1f6f2ff"
                            />
                          </View>
                        ) : progress > 0 ? (
                          <View style={styles.partialIndicator}>
                            <View
                              style={[
                                styles.partialFill,
                                {width: `${progress * 100}%`},
                              ]}
                            />
                          </View>
                        ) : (
                          <View style={styles.playButton}>
                            <MaterialIcons
                              name="play-arrow"
                              size={20}
                              color="white"
                            />
                          </View>
                        )}
                      </View>

                      {/* Progress Bar */}
                      {progress > 0 && (
                        <View style={styles.videoProgressContainer}>
                          <LinearGradient
                            colors={['#2D7D7A', '#4CAF50']}
                            start={{x: 0, y: 0}}
                            end={{x: 1, y: 0}}
                            style={[
                              styles.videoProgressBar,
                              {width: `${progress * 100}%`},
                            ]}
                          />
                        </View>
                      )}
                    </View>

                    {/* Video Info */}
                    <View style={styles.videoInfo}>
                      <Text style={styles.videoTitle} numberOfLines={2}>
                        {index + 1}. {video.title}
                      </Text>

                      <View style={styles.videoMeta}>
                        <Text style={styles.videoAuthor}>
                          by {video.author || 'Unknown'}
                        </Text>
                        <Text style={styles.videoDuration}>
                          {(Number(video.duration || 60) / 60)?.toFixed(2)} Min.
                        </Text>
                      </View>

                      <View style={styles.videoFooter}>
                        <View style={styles.videoRating}>
                          <MaterialIcons
                            name="star"
                            size={14}
                            color="#FFC107"
                          />
                          <Text style={styles.ratingText}>
                            {video.reviewStars || 0} (
                            {formatReviewCount(video.reviewCount || 0)})
                          </Text>
                        </View>

                        {video?.status == 'ended' ? (
                          <View style={styles.activityBadge}>
                            <MaterialIcons
                              name="assignment"
                              size={12}
                              color="#FF9800"
                            />
                            <Text style={styles.activityText}>
                              {video?.postActivities?.length}{' '}
                              {video?.postActivities?.length === 1
                                ? 'Activity'
                                : 'Activities'}
                            </Text>
                          </View>
                        ) : null}
                      </View>
                    </View>

                    {/* Action Button */}
                    <TouchableOpacity
                      style={[
                        styles.playVideoButton,
                        isWatched && styles.completedButton,
                      ]}
                      onPress={() => handleVideoPress(video.id, chapterId)}>
                      <MaterialIcons
                        name={isWatched ? 'replay' : 'play-arrow'}
                        size={20}
                        color={isWatched ? '#4CAF50' : '#2D7D7A'}
                      />
                    </TouchableOpacity>
                  </TouchableOpacity>
                </Animated.View>
              );
            } catch (error) {
              console.error('Error rendering video item:', error);
              return null;
            }
          })}
        </Animated.View>
      </ScrollView>

      {/* Floating Action Button */}
      <Animated.View
        style={[
          styles.fabContainer,
          {backgroundColor: 'rgba(255,245,255,0.8)'},
        ]}
        entering={SlideInDown.delay(600)}>
        <TouchableOpacity
          style={[styles.fab, styles.fabGradient]}
          onPress={handlePlayChapter}
          activeOpacity={0.8}>
          <LinearGradient
            useAngle
            angle={270}
            colors={['#2D7D7A', '#13b1a9ff']}
            style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0}}
          />
          <MaterialIcons name="play-arrow" size={24} color="white" />
          <Text style={styles.fabText}>Start Chapter</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
  },
  errorSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#2D7D7A',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    height: 200,
    position: 'relative',
    backgroundColor: 'white',
  },
  heroGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  infoSection: {
    marginBottom: 8,
    overflow: 'hidden',
  },
  infoGradient: {
    padding: 8,
  },
  chapterTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
    lineHeight: 34,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    flex: 1,
    // overflow: 'hidden',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(45, 125, 122, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    flex: 1,
    marginHorizontal: 4,
    overflow: 'hidden',
  },
  statIcon: {
    marginRight: 2,
  },
  statText: {
    fontSize: 12,
    color: '#2D7D7A',
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  progressContainer: {
    marginTop: 8,
  },
  progressTrack: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#2D7D7A',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
  },
  videosSection: {
    padding: 20,
    backgroundColor: 'white',
  },
  sectionHeader: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  videoItemContainer: {
    marginBottom: 16,
  },
  videoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  completedVideoItem: {
    borderColor: '#4CAF50',
    backgroundColor: 'rgba(76, 175, 80, 0.05)',
  },
  videoThumbnail: {
    width: 120,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    marginRight: 16,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F0F0F0',
  },
  statusOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  completedBadge: {
    backgroundColor: 'rgba(76, 175, 80, 0.9)',
    borderRadius: 12,
    padding: 2,
  },
  partialIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    overflow: 'hidden',
  },
  partialFill: {
    height: '100%',
    backgroundColor: '#FFC107',
  },
  playButton: {
    backgroundColor: 'rgba(45, 125, 122, 0.9)',
    borderRadius: 12,
    padding: 2,
  },
  videoProgressContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  videoProgressBar: {
    height: '100%',
  },
  videoInfo: {
    flex: 1,
    paddingRight: 12,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 6,
    lineHeight: 22,
  },
  videoMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  videoAuthor: {
    fontSize: 12,
    color: '#666',
  },
  videoDuration: {
    fontSize: 9,
    color: '#2D7D7A',
    fontWeight: '600',
  },
  videoFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  videoRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 11,
    color: '#666',
  },
  activityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    borderRadius: 12,
  },
  activityText: {
    fontSize: 9,
    color: '#FF9800',
    fontWeight: '700',
  },
  playVideoButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(45, 125, 122, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2D7D7A',
  },
  completedButton: {
    borderColor: '#4CAF50',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  fabContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  fab: {
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  fabGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  fabText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  completionModal: {
    width: screenWidth - 40,
    maxWidth: 400,
    borderRadius: 24,
    overflow: 'hidden',
  },
  modalGradient: {
    padding: 32,
    alignItems: 'center',
  },
  successIconContainer: {
    marginBottom: 20,
  },
  successIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  completionSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  activityCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    marginBottom: 24,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 8,
  },
  activityDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  activityPreview: {
    marginBottom: 16,
  },
  activityPreviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    marginBottom: 8,
  },
  activityIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(45, 125, 122, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityPreviewText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  moreActivities: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
  progressIndicator: {
    alignItems: 'center',
  },
  progressDots: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2D7D7A',
    marginHorizontal: 2,
  },

  modalActions: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  secondaryButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ChapterDetailScreen;
