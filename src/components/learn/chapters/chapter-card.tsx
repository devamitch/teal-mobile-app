import {Chapter} from '@/core/stores/slices/playlist/types';
import {MEDIA_CHAPTER_THEME as THEME} from '@/data/module-data';
import {safeImageUri} from '@/utils/image-utils';
import {BlurView} from '@react-native-community/blur';
import React, {useCallback, useMemo} from 'react';
import {
  Dimensions,
  ImageBackground,
  PixelRatio,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Pressable, RectButton} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  Extrapolate,
  FadeIn,
  FadeInDown,
  FadeInUp,
  interpolate,
  SlideInRight,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ThumbnailPlayer from '../videoplayer/ThumbnailPlayer';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
const CARD_MARGIN = THEME.spacing.lg;
const CARD_WIDTH = SCREEN_WIDTH - CARD_MARGIN * 2;
const IS_SMALL_SCREEN = SCREEN_WIDTH < 375;
const PIXEL_RATIO = PixelRatio.get();

interface ChapterCardProps {
  chapter?: Chapter;
  index: number;
  onPress: () => void;
  onVideoPress: (videoId: string, startPos?: number) => void;
  isLoading?: boolean;
}

const ChapterCard = React.memo<ChapterCardProps>(
  ({chapter, index, onPress, onVideoPress, isLoading = false}) => {
    // Memoized calculations
    const cardData = useMemo(() => {
      const isCompleted = chapter?.completionPercentage === 100;
      const isStarted = (chapter?.completionPercentage || 0) > 0;
      const completionPercentage = chapter?.completionPercentage || 0;

      return {
        isCompleted,
        isStarted,
        completionPercentage,
        title: chapter?.title || 'New Chapter',
        id: chapter?.id || 'New Chapter',
        videoCount: chapter?.videoCount || 0,
        duration: chapter?.totalDuration || '--:--',
        rating: chapter?.averageRating || '4.8',
        completedCount: chapter?.completedCount || 0,
        video: chapter?.videos?.[0],
        thumbnail:
          chapter?.thumbnail ||
          'https://images.unsplash.com/photo-1498758536662-35b82cd15e29?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      };
    }, [chapter]);

    // Animation values
    const cardScale = useSharedValue(1);
    const cardRotateY = useSharedValue(0);
    const progressWidth = useSharedValue(0);
    const shimmerTranslateX = useSharedValue(-CARD_WIDTH);
    const heartScale = useSharedValue(1);
    const buttonScale = useSharedValue(1);
    const overlayOpacity = useSharedValue(0);

    // Responsive dimensions
    const responsiveDimensions = useMemo(
      () => ({
        heroHeight: IS_SMALL_SCREEN ? 160 : 200,
        titleSize: IS_SMALL_SCREEN ? 15 : 17,
        padding: IS_SMALL_SCREEN ? THEME.spacing.md : THEME.spacing.lg,
        buttonHeight: IS_SMALL_SCREEN ? 44 : 50,
      }),
      [],
    );

    // Optimized animation delays
    const animationDelay = useMemo(() => 100 + index * 60, [index]);

    // Gesture handler for card interactions
    const panGestureHandler = useAnimatedGestureHandler({
      onStart: () => {
        overlayOpacity.value = withTiming(0.1, {duration: 150});
      },
      onActive: event => {
        const rotateY = interpolate(
          event.translationX,
          [-50, 0, 50],
          [-5, 0, 5],
          Extrapolate.CLAMP,
        );
        cardRotateY.value = rotateY;
        cardScale.value = interpolate(
          Math.abs(event.translationX),
          [0, 100],
          [1, 0.98],
          Extrapolate.CLAMP,
        );
      },
      onEnd: () => {
        cardRotateY.value = withSpring(0);
        cardScale.value = withSpring(1);
        overlayOpacity.value = withTiming(0, {duration: 200});
      },
    });

    // Animated styles
    const cardAnimatedStyle = useAnimatedStyle(() => ({
      transform: [
        {scale: cardScale.value},
        {perspective: 1000},
        {rotateY: `${cardRotateY.value}deg`},
      ],
    }));

    const overlayAnimatedStyle = useAnimatedStyle(() => ({
      opacity: overlayOpacity.value,
    }));

    const progressAnimatedStyle = useAnimatedStyle(() => ({
      width: `${progressWidth.value}%`,
    }));

    const shimmerAnimatedStyle = useAnimatedStyle(() => ({
      transform: [{translateX: shimmerTranslateX.value}],
    }));

    const heartAnimatedStyle = useAnimatedStyle(() => ({
      transform: [{scale: heartScale.value}],
    }));

    const buttonAnimatedStyle = useAnimatedStyle(() => ({
      transform: [{scale: buttonScale.value}],
    }));

    // Callbacks
    const handlePressIn = useCallback(() => {
      cardScale.value = withSpring(0.97, {damping: 15});
      buttonScale.value = withSpring(0.95);
    }, []);

    const handlePressOut = useCallback(() => {
      cardScale.value = withSpring(1, {damping: 15});
      buttonScale.value = withSpring(1);
    }, []);

    const handleHeartPress = useCallback(() => {
      heartScale.value = withSequence(
        withTiming(1.3, {duration: 100}),
        withTiming(1, {duration: 100}),
      );
    }, []);

    const handleVideoPress = useCallback(() => {
      onVideoPress(
        chapter?.recentVideo?.id || '',
        chapter?.recentVideo?.currentPlaybackTime,
      );
    }, [chapter?.recentVideo?.id, onVideoPress]);

    // Effects
    React.useEffect(() => {
      // Progress animation
      progressWidth.value = withDelay(
        animationDelay + 400,
        withTiming(cardData.completionPercentage, {duration: 1200}),
      );

      // Shimmer effect for loading
      if (isLoading) {
        shimmerTranslateX.value = withSequence(
          withTiming(CARD_WIDTH, {duration: 1000}),
          withTiming(-CARD_WIDTH, {duration: 0}),
          withTiming(CARD_WIDTH, {duration: 1000}),
        );
      }
    }, [cardData.completionPercentage, animationDelay, isLoading]);

    // Skeleton loader
    if (isLoading) {
      return (
        <Animated.View
          entering={FadeInUp.delay(animationDelay).duration(400)}
          style={styles.container}>
          <View style={[styles.card, {backgroundColor: THEME.colors.surface}]}>
            <View
              style={[
                styles.skeletonHero,
                {height: responsiveDimensions.heroHeight},
              ]}>
              <Animated.View style={[styles.shimmer, shimmerAnimatedStyle]} />
            </View>
            <View
              style={[styles.content, {padding: responsiveDimensions.padding}]}>
              <View style={styles.skeletonTitle} />
              <View style={styles.skeletonMeta} />
              <View style={styles.skeletonProgress} />
              <View style={styles.skeletonButtons} />
            </View>
          </View>
        </Animated.View>
      );
    }

    return (
      <Animated.View
        entering={FadeInUp.delay(animationDelay).duration(500).springify()}
        style={styles.container}>
        <Animated.View style={[cardAnimatedStyle]}>
          <RectButton
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={onPress}>
            <View style={[styles.card, THEME.shadows.lg]}>
              {/* Overlay for interaction feedback */}
              <Animated.View
                style={[styles.interactionOverlay, overlayAnimatedStyle]}
              />
              <Animated.View
                style={{height: 0, width: 0, position: 'absolute'}}>
                <ThumbnailPlayer
                  {...cardData?.video}
                  videoUrl={cardData?.video?.videoUrl}
                  chapterId={cardData?.id}
                  videoId={cardData?.video?.id || ''}
                />
              </Animated.View>

              {/* Hero Section */}
              <ImageBackground
                source={safeImageUri(cardData.thumbnail)}
                style={[
                  styles.heroImage,
                  {height: responsiveDimensions.heroHeight},
                ]}
                imageStyle={styles.heroImageStyle}
                resizeMode="cover">
                {/* Enhanced gradient overlay */}
                <LinearGradient
                  colors={[
                    'rgba(0,0,0,0.8)',
                    'rgba(0,0,0,0.4)',
                    'rgba(0,0,0,0.2)',
                    'transparent',
                  ]}
                  style={styles.heroGradient}
                  start={{x: 0, y: 1}}
                  end={{x: 0, y: 0.2}}
                />

                {/* Floating Header */}
                <View style={styles.header}>
                  <Animated.View
                    entering={SlideInRight.delay(
                      animationDelay + 200,
                    ).springify()}
                    style={styles.chapterInfo}>
                    <BlurView
                      style={styles.chapterInfoBlur}
                      blurAmount={20}
                      blurType="dark"
                    />
                    <LinearGradient
                      colors={[
                        THEME.colors.primaryLight,
                        'rgba(255,255,255,0.1)',
                      ]}
                      style={styles.chapterInfoGradient}
                    />
                    <View style={styles.chapterInfoContent}>
                      <View
                        style={[
                          styles.chapterBadge,
                          {backgroundColor: THEME.colors.primary},
                        ]}>
                        <Text style={styles.chapterNumber}>{index + 1}</Text>
                      </View>
                      <View style={styles.titleSection}>
                        <Text
                          style={[styles.title]}
                          numberOfLines={2}
                          allowFontScaling
                          maxFontSizeMultiplier={1.5}
                          minimumFontScale={0.5}
                          adjustsFontSizeToFit>
                          {cardData?.title?.trim()}
                        </Text>
                        <View style={styles.ratingRow}>
                          <Ionicons
                            name="star"
                            size={12}
                            color={THEME.colors.warning}
                          />
                          <Text style={styles.ratingText}>
                            {cardData.rating}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </Animated.View>

                  {/* Heart/Favorite Button */}
                  <Animated.View style={[heartAnimatedStyle]}>
                    <RectButton
                      style={styles.heartButton}
                      onPress={handleHeartPress}>
                      <BlurView
                        style={styles.heartBlur}
                        blurAmount={15}
                        blurType="dark"
                      />
                      <Ionicons
                        name="heart-outline"
                        size={20}
                        color={THEME.colors.error}
                      />
                    </RectButton>
                  </Animated.View>

                  {/* Completion Badge */}
                  {cardData.isCompleted && (
                    <Animated.View
                      entering={FadeIn.delay(animationDelay + 600).springify()}
                      style={styles.completionBadge}>
                      <LinearGradient
                        colors={[THEME.colors.success, THEME.colors.secondary]}
                        style={styles.completionBadgeGradient}>
                        <Ionicons
                          name="checkmark-circle"
                          size={22}
                          color="#FFF"
                        />
                      </LinearGradient>
                    </Animated.View>
                  )}
                </View>

                {/* Floating Stats */}
                <Animated.View
                  entering={FadeInDown.delay(animationDelay + 400)}
                  style={styles.statsContainer}>
                  <BlurView
                    style={styles.statsBlur}
                    blurAmount={15}
                    blurType="dark"
                  />
                  <View style={styles.statsContent}>
                    <View style={styles.statItem}>
                      <Ionicons name="play-circle" size={14} color="#FFF" />
                      <Text style={styles.statText}>{cardData.videoCount}</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                      <Ionicons name="time" size={14} color="#FFF" />
                      <Text style={styles.statText}>{cardData.duration}</Text>
                    </View>
                  </View>
                </Animated.View>
              </ImageBackground>

              {/* Content Section */}
              <View
                style={[
                  styles.content,
                  {padding: responsiveDimensions.padding},
                ]}>
                {/* Progress Section */}
                {cardData.isStarted && (
                  <Animated.View
                    entering={FadeIn.delay(animationDelay + 700)}
                    style={styles.progressSection}>
                    <View style={styles.progressHeader}>
                      <Text
                        style={[
                          styles.progressLabel,
                          {color: THEME.colors.text},
                        ]}>
                        Progress
                      </Text>
                      <View
                        style={[
                          styles.progressBadge,
                          {backgroundColor: THEME.colors.primaryLight},
                        ]}>
                        <Text
                          style={[
                            styles.progressPercent,
                            {color: THEME.colors.primary},
                          ]}>
                          {cardData.completionPercentage}%
                        </Text>
                      </View>
                    </View>

                    {/* Enhanced Progress Bar */}
                    <View style={styles.progressBarContainer}>
                      <View
                        style={[
                          styles.progressBar,
                          {backgroundColor: THEME.colors.borderLight},
                        ]}>
                        <Animated.View style={[progressAnimatedStyle]}>
                          <LinearGradient
                            colors={
                              cardData.isCompleted
                                ? [THEME.colors.success, THEME.colors.secondary]
                                : THEME.gradients.primary
                            }
                            style={styles.progressFill}
                            start={{x: 0, y: 0}}
                            end={{x: 1, y: 0}}
                          />
                        </Animated.View>
                      </View>

                      {/* Progress Dots */}
                      <View style={styles.progressDots}>
                        {Array.from({
                          length: Math.min(cardData.videoCount, 6),
                        }).map((_, i) => (
                          <View
                            key={i}
                            style={[
                              styles.progressDot,
                              {
                                backgroundColor:
                                  i <
                                  (cardData.completedCount /
                                    cardData.videoCount) *
                                    6
                                    ? THEME.colors.primary
                                    : THEME.colors.border,
                              },
                            ]}
                          />
                        ))}
                      </View>
                    </View>

                    <Text
                      style={[
                        styles.progressText,
                        {color: THEME.colors.textSecondary},
                      ]}>
                      {cardData.completedCount} of {cardData.videoCount}{' '}
                      completed
                    </Text>
                  </Animated.View>
                )}

                {/* Action Buttons */}
                <Animated.View
                  entering={FadeInUp.delay(animationDelay + 800)}
                  style={styles.actionContainer}>
                  {/* Details Button */}
                  <Pressable
                    style={[
                      styles.secondaryButton,
                      {height: responsiveDimensions.buttonHeight},
                    ]}
                    onPress={onPress}>
                    <View
                      style={[
                        styles.secondaryButtonBg,
                        {borderColor: THEME.colors.border},
                      ]}>
                      <Ionicons
                        name="information-circle-outline"
                        size={18}
                        color={THEME.colors.primary}
                      />
                      <Text
                        style={[
                          styles.secondaryButtonText,
                          {color: THEME.colors.primary},
                        ]}>
                        Details
                      </Text>
                    </View>
                  </Pressable>

                  {/* Primary Action Button */}
                  <Animated.View style={[buttonAnimatedStyle, {flex: 2}]}>
                    <RectButton
                      style={[
                        styles.primaryButton,
                        styles.primaryButtonGradient,
                        {
                          height: responsiveDimensions.buttonHeight,
                          overflow: 'hidden',
                        },
                      ]}
                      // onPress={handleVideoPress}
                      onPress={onPress}>
                      <LinearGradient
                        colors={
                          cardData.isStarted
                            ? [THEME.colors.accent, '#FF7043']
                            : ['#2D7D7A', '#0b7b76ff', '#0d645eff']
                        }
                        style={{
                          position: 'absolute',
                          top: 0,
                          bottom: 0,
                          left: 0,
                          right: 0,
                        }}
                        start={{x: 0, y: 1}}
                        end={{x: 1, y: 0}}
                        useAngle
                        angle={260}
                      />
                      <Ionicons
                        name={cardData.isStarted ? 'play-forward' : 'play'}
                        size={18}
                        color="#FFF"
                      />
                      <Text style={styles.primaryButtonText}>
                        {cardData.isStarted ? 'Continue' : 'Start Learning'}
                      </Text>
                    </RectButton>
                  </Animated.View>
                </Animated.View>
              </View>
            </View>
          </RectButton>
        </Animated.View>
      </Animated.View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: CARD_MARGIN,
    paddingBottom: THEME.spacing.lg,
  },
  card: {
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.borderRadius.xl,
    overflow: 'hidden',
    position: 'relative',
  },
  interactionOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: THEME.colors.primary,
    zIndex: 1,
  },
  heroImage: {
    position: 'relative',
  },
  heroImageStyle: {
    borderTopLeftRadius: THEME.borderRadius.xl,
    borderTopRightRadius: THEME.borderRadius.xl,
  },
  heroGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '75%',
  },
  header: {
    position: 'absolute',
    top: THEME.spacing.md,
    left: THEME.spacing.md,
    right: THEME.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  chapterInfo: {
    flex: 1,
    marginRight: THEME.spacing.sm,
    borderRadius: THEME.borderRadius.md,
    overflow: 'hidden',
  },
  chapterInfoBlur: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  chapterInfoGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  chapterInfoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: THEME.spacing.sm,
  },
  chapterBadge: {
    width: 28,
    height: 28,
    borderRadius: THEME.borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: THEME.spacing.sm,
  },
  chapterNumber: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  titleSection: {
    flex: 1,
  },
  title: {
    color: '#FFF',
    fontWeight: '700',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 3,
  },
  heartButton: {
    width: 36,
    height: 36,
    borderRadius: THEME.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: THEME.spacing.xs,
  },
  heartBlur: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  completionBadge: {
    borderRadius: THEME.borderRadius.full,
    overflow: 'hidden',
  },
  completionBadgeGradient: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    position: 'absolute',
    bottom: THEME.spacing.md,
    right: THEME.spacing.md,
    borderRadius: THEME.borderRadius.sm,
    overflow: 'hidden',
  },
  statsBlur: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  statsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.sm,
    paddingVertical: THEME.spacing.xs,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 3,
  },
  statDivider: {
    width: 1,
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: THEME.spacing.xs,
  },
  content: {
    backgroundColor: THEME.colors.card,
  },
  progressSection: {
    marginBottom: THEME.spacing.lg,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.sm,
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  progressBadge: {
    paddingHorizontal: THEME.spacing.xs,
    paddingVertical: 2,
    borderRadius: THEME.borderRadius.sm,
  },
  progressPercent: {
    fontSize: 11,
    fontWeight: '700',
  },
  progressBarContainer: {
    marginBottom: THEME.spacing.xs,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: THEME.spacing.xs,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
    marginBottom: THEME.spacing.xs,
  },
  progressDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
  },
  actionContainer: {
    flexDirection: 'row',
    gap: THEME.spacing.sm,
  },
  secondaryButton: {
    flex: 1,
    borderRadius: THEME.borderRadius.sm,
  },
  secondaryButtonBg: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: THEME.borderRadius.sm,
  },
  secondaryButtonText: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
  },
  primaryButton: {
    borderRadius: THEME.borderRadius.sm,
    overflow: 'hidden',
  },
  primaryButtonGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 6,
  },
  // Skeleton styles
  skeletonHero: {
    backgroundColor: THEME.colors.borderLight,
    position: 'relative',
    overflow: 'hidden',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  skeletonTitle: {
    height: 20,
    backgroundColor: THEME.colors.borderLight,
    borderRadius: 4,
    marginBottom: THEME.spacing.sm,
  },
  skeletonMeta: {
    height: 14,
    width: '60%',
    backgroundColor: THEME.colors.borderLight,
    borderRadius: 4,
    marginBottom: THEME.spacing.md,
  },
  skeletonProgress: {
    height: 40,
    backgroundColor: THEME.colors.borderLight,
    borderRadius: THEME.borderRadius.sm,
    marginBottom: THEME.spacing.md,
  },
  skeletonButtons: {
    height: 44,
    backgroundColor: THEME.colors.borderLight,
    borderRadius: THEME.borderRadius.sm,
  },
});

ChapterCard.displayName = 'ChapterCard';

export default ChapterCard;
