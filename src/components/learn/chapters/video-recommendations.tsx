import type React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import Animated, {FadeInUp} from 'react-native-reanimated';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {RectButton} from 'react-native-gesture-handler';
import {MEDIA_CHAPTER_THEME as THEME} from '@/data/module-data';
import type {VideoRecommendation} from '@/utils/video-utils';

interface VideoRecommendationsProps {
  recommendations: VideoRecommendation[];
  onVideoPress: (videoId: string) => void;
}

const VideoRecommendations: React.FC<VideoRecommendationsProps> = ({
  recommendations,
  onVideoPress,
}) => {
  return (
    <Animated.View entering={FadeInUp.delay(300)} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recommended for You</Text>
        <Text style={styles.subtitle}>Start your learning journey</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {recommendations.map((video, index) => (
          <Animated.View key={video.id} entering={FadeInUp.delay(index * 100)}>
            <RectButton
              style={styles.recommendationCard}
              onPress={() => onVideoPress(video.id)}>
              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <View style={styles.priorityBadge}>
                    <Text style={styles.priorityText}>{video.priority}</Text>
                  </View>
                  <Text style={styles.reason}>{video.reason}</Text>
                </View>

                <View style={styles.videoThumbnail}>
                  <MaterialIcons
                    name="play-circle-outline"
                    size={48}
                    color={THEME.colors.primary}
                  />
                </View>

                <View style={styles.videoInfo}>
                  <Text style={styles.moduleTitle} numberOfLines={1}>
                    {video.moduleTitle}
                  </Text>
                  <Text style={styles.videoTitle} numberOfLines={2}>
                    {video.title}
                  </Text>

                  <View style={styles.videoMeta}>
                    <Text style={styles.author}>{video.author}</Text>
                    <Text style={styles.duration}>{video.duration}</Text>
                  </View>
                </View>

                <RectButton
                  style={styles.startButton}
                  onPress={() => onVideoPress(video.id)}>
                  <View style={styles.startButtonContent}>
                    <Text style={styles.startButtonText}>Start</Text>
                    <MaterialIcons
                      name="arrow-forward"
                      size={16}
                      color="#fff"
                    />
                  </View>
                </RectButton>
              </View>
            </RectButton>
          </Animated.View>
        ))}
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: THEME.spacing.xl,
  },
  header: {
    paddingHorizontal: THEME.spacing.lg,
    marginBottom: THEME.spacing.md,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: THEME.colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: THEME.colors.textSecondary,
  },
  scrollContent: {
    paddingHorizontal: THEME.spacing.lg,
    gap: THEME.spacing.md,
  },
  recommendationCard: {
    width: 280,
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.borderRadius.lg,
    overflow: 'hidden',
    ...THEME.shadows.md,
  },
  cardContent: {
    padding: THEME.spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: THEME.spacing.md,
  },
  priorityBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: THEME.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  reason: {
    fontSize: 12,
    fontWeight: '500',
    color: THEME.colors.primary,
    textTransform: 'uppercase',
  },
  videoThumbnail: {
    height: 120,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: THEME.spacing.md,
  },
  videoInfo: {
    marginBottom: THEME.spacing.md,
  },
  moduleTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.primary,
    marginBottom: 4,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.colors.text,
    lineHeight: 20,
    marginBottom: THEME.spacing.xs,
  },
  videoMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  author: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
  },
  duration: {
    fontSize: 12,
    fontWeight: '500',
    color: THEME.colors.textSecondary,
  },
  startButton: {
    backgroundColor: THEME.colors.primary,
    borderRadius: THEME.borderRadius.md,
    overflow: 'hidden',
  },
  startButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: THEME.spacing.sm,
  },
  startButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginRight: THEME.spacing.xs,
  },
});

export default VideoRecommendations;
