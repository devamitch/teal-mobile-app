import type React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ImageRequireSource,
} from 'react-native';
import Animated, {FadeInUp} from 'react-native-reanimated';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {RectButton} from 'react-native-gesture-handler';
import {MEDIA_CHAPTER_THEME as THEME} from '@/data/module-data';
import type {VideoRecommendation} from '@/utils/video-utils';
import {getImageSource} from '@/utils/image-utils';

interface RecommendationsSectionProps {
  recommendations: VideoRecommendation[];
  onVideoPress: (videoId: string) => void;
}

const RecommendationsSection: React.FC<RecommendationsSectionProps> = ({
  recommendations,
  onVideoPress,
}) => {
  if (recommendations.length === 0) return null;

  return (
    <Animated.View entering={FadeInUp.delay(400)} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recommended for You</Text>
        <Text style={styles.subtitle}>
          Curated content based on your progress
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {recommendations.map((video, index) => (
          <Animated.View
            key={video.id}
            entering={FadeInUp.delay(500 + index * 100)}>
            <RectButton
              style={styles.recommendationCard}
              onPress={() => onVideoPress(video.id)}>
              <View style={styles.cardHeader}>
                <View
                  style={[
                    styles.priorityBadge,
                    {backgroundColor: getPriorityColor(video.priority)},
                  ]}>
                  <Text style={styles.priorityText}>{video.priority}</Text>
                </View>
                <Text
                  style={[
                    styles.reason,
                    {color: getPriorityColor(video.priority)},
                  ]}>
                  {video.reason}
                </Text>
              </View>

              <View style={styles.thumbnailContainer}>
                <Image
                  source={
                    video.thumbnailUrl
                      ? getImageSource(video.thumbnailUrl)
                      : {uri: '/placeholder.svg?height=120&width=200'}
                  }
                  style={styles.thumbnail}
                />
                <View style={styles.playOverlay}>
                  <MaterialIcons
                    name="play-circle-outline"
                    size={40}
                    color="rgba(255,255,255,0.9)"
                  />
                </View>
                <View style={styles.durationBadge}>
                  <Text style={styles.durationText}>{video.duration}</Text>
                </View>
              </View>

              <View style={styles.videoInfo}>
                <Text style={styles.moduleTitle} numberOfLines={1}>
                  {video.moduleTitle}
                </Text>
                <Text style={styles.videoTitle} numberOfLines={2}>
                  {video.title}
                </Text>
                <Text style={styles.authorName}>by {video.author}</Text>
              </View>

              <RectButton
                style={[
                  styles.startButton,
                  {backgroundColor: getPriorityColor(video.priority)},
                ]}
                onPress={() => onVideoPress(video.id)}>
                <View style={styles.startButtonContent}>
                  <MaterialIcons name="play-arrow" size={16} color="#fff" />
                  <Text style={styles.startButtonText}>Start Learning</Text>
                </View>
              </RectButton>
            </RectButton>
          </Animated.View>
        ))}
      </ScrollView>
    </Animated.View>
  );
};

const getPriorityColor = (priority: number) => {
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444'];
  return colors[priority - 1] || colors[0];
};

const styles = StyleSheet.create({
  container: {
    marginBottom: THEME.spacing.xl,
  },
  header: {
    paddingHorizontal: THEME.spacing.lg,
    marginBottom: THEME.spacing.lg,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: THEME.colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: THEME.colors.textSecondary,
  },
  scrollContent: {
    paddingHorizontal: THEME.spacing.lg,
    gap: THEME.spacing.lg,
  },
  recommendationCard: {
    width: 280,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: THEME.spacing.lg,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: THEME.spacing.md,
  },
  priorityBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#fff',
  },
  reason: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  thumbnailContainer: {
    position: 'relative',
    height: 140,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: THEME.spacing.md,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  durationText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  videoInfo: {
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
    fontSize: 16,
    fontWeight: '700',
    color: THEME.colors.text,
    lineHeight: 22,
    marginBottom: THEME.spacing.xs,
  },
  authorName: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    fontWeight: '500',
  },
  startButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  startButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: THEME.spacing.sm,
    gap: THEME.spacing.xs,
  },
  startButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
});

export default RecommendationsSection;
