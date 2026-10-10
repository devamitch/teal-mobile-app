import type React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Animated, {FadeInUp} from 'react-native-reanimated';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {RectButton} from 'react-native-gesture-handler';
import {MEDIA_CHAPTER_THEME as THEME} from '@/data/module-data';
import type {ActiveVideo} from '@/utils/video-utils';

interface CurrentVideoCardProps {
  video: ActiveVideo;
  onVideoPress: (videoId: string) => void;
}

const CurrentVideoCard: React.FC<CurrentVideoCardProps> = ({
  video,
  onVideoPress,
}) => {
  return (
    <Animated.View entering={FadeInUp.delay(200)} style={styles.container}>
      <View style={styles.header}>
        <View style={styles.statusBadge}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>IN PROGRESS</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.moduleTitle}>{video.moduleTitle}</Text>
        <Text style={styles.videoTitle} numberOfLines={2}>
          {video.title}
        </Text>
        <Text style={styles.videoMeta}>
          {video.author} • {video.duration}
        </Text>
      </View>

      {video.progress && video.progress > 0 && (
        <View style={styles.progressSection}>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, {width: `${video.progress}%`}]}
            />
          </View>
          <Text style={styles.progressText}>{video.progress}% watched</Text>
        </View>
      )}

      <RectButton
        style={styles.continueButton}
        onPress={() => onVideoPress(video.id)}>
        <View style={styles.continueButtonContent}>
          <MaterialIcons name="play-arrow" size={18} color="#fff" />
          <Text style={styles.continueButtonText}>Continue Watching</Text>
        </View>
      </RectButton>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: THEME.colors.card,
    marginHorizontal: THEME.spacing.lg,
    marginBottom: THEME.spacing.lg,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: THEME.colors.primary,
    ...THEME.shadows.sm,
  },
  header: {
    marginBottom: THEME.spacing.md,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: THEME.colors.primaryLight,
    paddingHorizontal: THEME.spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: THEME.colors.primary,
    marginRight: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: THEME.colors.primary,
    textTransform: 'uppercase',
  },
  content: {
    marginBottom: THEME.spacing.md,
  },
  moduleTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.primary,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: THEME.colors.text,
    lineHeight: 24,
    marginBottom: THEME.spacing.xs,
  },
  videoMeta: {
    fontSize: 14,
    color: THEME.colors.textSecondary,
    fontWeight: '400',
  },
  progressSection: {
    marginBottom: THEME.spacing.md,
  },
  progressBar: {
    height: 6,
    backgroundColor: THEME.colors.borderLight,
    borderRadius: 3,
    marginBottom: THEME.spacing.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: THEME.colors.primary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    fontWeight: '500',
  },
  continueButton: {
    backgroundColor: THEME.colors.primary,
    borderRadius: THEME.borderRadius.md,
    overflow: 'hidden',
  },
  continueButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: THEME.spacing.sm,
    gap: THEME.spacing.xs,
  },
  continueButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});

export default CurrentVideoCard;
