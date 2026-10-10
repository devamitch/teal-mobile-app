import {MEDIA_CHAPTER_THEME as THEME} from '@/data/module-data';
import {StyleSheet, Text, View} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Animated, {FadeIn} from 'react-native-reanimated';

export const EmptyChapters = () => {
  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.centerContainer}>
        <Animated.View entering={FadeIn} style={styles.messageContainer}>
          <Text style={styles.emptyText}>No chapters available</Text>
          <Text style={styles.emptySubtext}>
            New learning content will be available soon
          </Text>
        </Animated.View>
      </View>
    </GestureHandlerRootView>
  );
};

export const ChapterLoading = () => {
  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.centerContainer}>
        <Animated.View entering={FadeIn} style={styles.messageContainer}>
          <Text style={styles.loadingText}>
            Loading your learning journey...
          </Text>
          <Text style={styles.loadingSubtext}>
            Preparing your personalized content
          </Text>
        </Animated.View>
      </View>
    </GestureHandlerRootView>
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
