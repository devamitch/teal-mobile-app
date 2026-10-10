import type React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Animated, {
  FadeInUp,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {MEDIA_CHAPTER_THEME as THEME} from '@/data/module-data';

interface OverviewStatsProps {
  totalChapters: number;
  totalVideos: number;
  totalDuration: string;
  overallCompletion: number;
  totalCompleted: number;
  chaptersWithActivities: number;
}

const OverviewStats: React.FC<OverviewStatsProps> = ({
  totalChapters,
  totalVideos,
  totalDuration,
  overallCompletion,
  totalCompleted,
  chaptersWithActivities,
}) => {
  const stats = [
    {
      icon: 'library-books',
      label: 'Chapters',
      value: totalChapters,
      color: '#3B82F6',
      sublabel: `${chaptersWithActivities} interactive`,
    },
    {
      icon: 'play-circle-outline',
      label: 'Videos',
      value: totalVideos,
      color: '#10B981',
      sublabel: `${totalCompleted} completed`,
    },
    {
      icon: 'schedule',
      label: 'Duration',
      value: totalDuration,
      color: '#F59E0B',
      sublabel: 'Total content',
    },
    {
      icon: 'trending-up',
      label: 'Progress',
      value: `${overallCompletion}%`,
      color: '#8B5CF6',
      sublabel: 'Overall completion',
    },
  ];

  const progressStyle = useAnimatedStyle(() => {
    return {
      width: withSpring(`${overallCompletion}%`, {
        damping: 20,
        stiffness: 90,
      }),
    };
  });

  return (
    <Animated.View
      entering={FadeInUp.delay(200).springify()}
      style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Learning Overview</Text>
        <Text style={styles.subtitle}>
          Track your progress across all modules
        </Text>
      </View>

      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <Animated.View
            key={stat.label}
            entering={FadeInUp.delay(300 + index * 100).springify()}
            style={styles.statCard}>
            <View style={[styles.iconContainer, {backgroundColor: stat.color}]}>
              <MaterialIcons name={stat.icon as any} size={22} color="#fff" />
            </View>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
            <Text style={styles.statSublabel}>{stat.sublabel}</Text>
          </Animated.View>
        ))}
      </View>

      <Animated.View
        entering={FadeInUp.delay(700).springify()}
        style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Overall Progress</Text>
          <Text style={styles.progressValue}>{overallCompletion}%</Text>
        </View>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressBar, progressStyle]} />
        </View>
        <Text style={styles.progressDetails}>
          {totalCompleted} of {totalVideos} lessons completed
        </Text>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginHorizontal: THEME.spacing.lg,
    marginTop: -THEME.spacing.lg,
    marginBottom: THEME.spacing.xl,
    borderRadius: 24,
    padding: THEME.spacing.xl,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 12,
  },
  header: {
    marginBottom: THEME.spacing.xl,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: THEME.colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: THEME.colors.textSecondary,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    marginBottom: THEME.spacing.xl,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.xs,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: THEME.spacing.sm,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: THEME.colors.text,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  statSublabel: {
    fontSize: 10,
    color: THEME.colors.textLight,
    fontWeight: '500',
    textAlign: 'center',
  },
  progressSection: {
    paddingTop: THEME.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.sm,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.colors.text,
  },
  progressValue: {
    fontSize: 20,
    fontWeight: '800',
    color: THEME.colors.primary,
  },
  progressTrack: {
    height: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: THEME.spacing.xs,
  },
  progressBar: {
    height: '100%',
    backgroundColor: THEME.colors.primary,
    borderRadius: 5,
    shadowColor: THEME.colors.primary,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  progressDetails: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default OverviewStats;
