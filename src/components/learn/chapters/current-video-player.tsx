import useAppStore from '@/core/stores';
import {MEDIA_CHAPTER_THEME as THEME} from '@/data/module-data';
import type React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import Animated, {FadeInUp} from 'react-native-reanimated';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useShallow} from 'zustand/react/shallow';
import MiniVideoPlayer from '../videoplayer/MiniVideoPlayer';
import {safeImageUri} from '@/utils/image-utils';

interface CurrentVideoPlayerProps {
  onPlayPress: () => void;
}

const CurrentVideoPlayer: React.FC<CurrentVideoPlayerProps> = ({
  onPlayPress,
}) => {
  const {getCurrentChapter, getCurrentVideo} = useAppStore(
    useShallow(state => state?.playlist),
  );
  const video = getCurrentVideo?.();
  const chapterId = getCurrentChapter?.()?.id;

  if (!video) return null;

  return (
    <Animated.View entering={FadeInUp.delay(100)} style={styles.container}>
      <View style={styles.card}>
        <View style={styles.videoContainer}>
          <MiniVideoPlayer
            {...video}
            muted={false}
            controls
            paused={true}
            allowNativeController
            chapterId={chapterId}
            videoId={video?.id}
          />

          {/* {
          Make video mini control here
          
          } */}
        </View>

        <View style={styles.videoInfo}>
          <Text style={styles.videoTitle} numberOfLines={2}>
            {video.title}
          </Text>

          <View style={styles.authorRow}>
            <Image
              source={safeImageUri(video?.authorImageUri)}
              style={styles.authorImage}
              defaultSource={{uri: '/placeholder.svg?height=24&width=24'}}
            />
            <Text style={styles.authorName}>by {video.author}</Text>
          </View>

          <View style={styles.ratingRow}>
            <View style={styles.rating}>
              <MaterialIcons
                name="star"
                size={16}
                color={THEME.colors.warning}
              />
              <Text style={styles.ratingText}>{video.reviewStars}</Text>
            </View>
            <Text style={styles.reviewCount}>
              ({video.reviewCount} reviews)
            </Text>
          </View>

          <Text style={styles.description} numberOfLines={3}>
            {video.description}
          </Text>

          {video.hasActivity && (
            <View style={styles.activityBadge}>
              <MaterialIcons
                name="assignment"
                size={14}
                color={THEME.colors.primary}
              />
              <Text style={styles.activityText}>Includes Activity</Text>
            </View>
          )}
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: THEME.spacing.lg,
    paddingBottom: THEME.spacing.lg,
  },
  card: {
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.borderRadius.lg,
    overflow: 'hidden',
    ...THEME.shadows.md,
  },
  videoContainer: {
    position: 'relative',
    height: 200,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{translateX: -28}, {translateY: -28}],
  },
  playButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  durationBadge: {
    position: 'absolute',
    bottom: THEME.spacing.sm,
    right: THEME.spacing.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: THEME.spacing.xs,
    paddingVertical: 4,
    borderRadius: THEME.borderRadius.sm,
  },
  durationText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  videoInfo: {
    padding: THEME.spacing.lg,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME.colors.text,
    lineHeight: 24,
    marginBottom: THEME.spacing.sm,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: THEME.spacing.xs,
  },
  authorImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: THEME.spacing.xs,
  },
  authorName: {
    fontSize: 14,
    color: THEME.colors.textSecondary,
    fontWeight: '500',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: THEME.spacing.sm,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: THEME.spacing.xs,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.colors.text,
    marginLeft: 2,
  },
  reviewCount: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
  },
  description: {
    fontSize: 14,
    color: THEME.colors.textSecondary,
    lineHeight: 20,
    marginBottom: THEME.spacing.sm,
  },
  activityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: THEME.colors.primaryLight,
    paddingHorizontal: THEME.spacing.sm,
    paddingVertical: 4,
    borderRadius: THEME.borderRadius.sm,
  },
  activityText: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.primary,
    marginLeft: 4,
  },
});

export default CurrentVideoPlayer;
