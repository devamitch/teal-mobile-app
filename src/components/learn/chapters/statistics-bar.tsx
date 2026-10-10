import type React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Animated, {FadeInUp} from 'react-native-reanimated';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {MEDIA_CHAPTER_THEME as THEME} from '@/data/module-data';

interface StatisticsBarProps {
  totalChapters: number;
  totalVideos: number;
  totalDuration: string;
  overallCompletion: number;
}

const StatisticsBar: React.FC<StatisticsBarProps> = ({
  totalChapters,
  totalVideos,
  totalDuration,
  overallCompletion,
}) => {
  return (
    <Animated.View entering={FadeInUp.delay(200)} style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Progress</Text>
          <View style={styles.completionBadge}>
            <Text style={styles.completionText}>{overallCompletion}%</Text>
          </View>
        </View>

        <View style={styles.progressBar}>
          <View
            style={[styles.progressFill, {width: `${overallCompletion}%`}]}
          />
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <MaterialIcons
              name="library-books"
              size={16}
              color={THEME.colors.primary}
            />
            <Text style={styles.statValue}>{totalChapters}</Text>
            <Text style={styles.statLabel}>Modules</Text>
          </View>

          <View style={styles.statItem}>
            <MaterialIcons
              name="play-circle-outline"
              size={16}
              color={THEME.colors.primary}
            />
            <Text style={styles.statValue}>{totalVideos}</Text>
            <Text style={styles.statLabel}>Videos</Text>
          </View>

          <View style={styles.statItem}>
            <MaterialIcons
              name="schedule"
              size={16}
              color={THEME.colors.primary}
            />
            <Text style={styles.statValue}>{totalDuration}</Text>
            <Text style={styles.statLabel}>Duration</Text>
          </View>
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
    padding: THEME.spacing.lg,
    ...THEME.shadows.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME.colors.text,
  },
  completionBadge: {
    backgroundColor: THEME.colors.primaryLight,
    paddingHorizontal: THEME.spacing.sm,
    paddingVertical: 4,
    borderRadius: THEME.borderRadius.sm,
  },
  completionText: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.colors.primary,
  },
  progressBar: {
    height: 6,
    backgroundColor: THEME.colors.surface,
    borderRadius: 3,
    marginBottom: THEME.spacing.lg,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: THEME.colors.primary,
    borderRadius: 3,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    fontWeight: '500',
  },
});

export default StatisticsBar;
