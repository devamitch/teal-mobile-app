import React, {useEffect} from 'react';
import {ScrollView, StatusBar, StyleSheet} from 'react-native';
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import ActivityBottomActions from './ActivityBottomActions';
import ActivityCard from './ActivityCard';
import ActivityHeader from './ActivityHeader';

interface PostActivityLayoutProps {
  children: React.ReactNode;
  currentActivityIndex: number;
  totalActivities: number;
  activityTitle: string;
  progressValue: number;
  onBack: () => void;
  onPrevious: () => void;
  onNext: () => void;
  isSubmitting: boolean;
  cardScale?: number;
  activityDescription?: string;
}

const PostActivityLayout: React.FC<PostActivityLayoutProps> = ({
  children,
  currentActivityIndex,
  totalActivities,
  activityTitle,
  progressValue: initialProgressValue,
  onBack,
  onPrevious,
  onNext,
  isSubmitting,
  cardScale: initialCardScale = 1,
}) => {
  const insets = useSafeAreaInsets();
  const progressValue = useSharedValue(initialProgressValue);
  const cardScale = useSharedValue(initialCardScale);

  // Animation styles
  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressValue.value * 100}%`,
  }));

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: cardScale.value}],
  }));

  // Update progress animation when prop changes
  useEffect(() => {
    progressValue.value = withSpring(initialProgressValue);
  }, [initialProgressValue]);

  // Update card scale animation when prop changes
  useEffect(() => {
    cardScale.value = withSpring(initialCardScale);
  }, [initialCardScale]);

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header Section */}
      <ActivityHeader
        insets={insets}
        currentActivityIndex={currentActivityIndex}
        totalActivities={totalActivities}
        progressAnimatedStyle={progressAnimatedStyle}
        onBack={onBack}
      />

      {/* Content Section */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <ActivityCard
          currentActivity={{question: activityTitle}}
          cardAnimatedStyle={cardAnimatedStyle}
          // entering={SlideInUp.duration(400)}
        >
          {children}
        </ActivityCard>
      </ScrollView>

      {/* Bottom Actions */}
      <ActivityBottomActions
        currentActivityIndex={currentActivityIndex}
        totalActivities={totalActivities}
        isSubmitting={isSubmitting}
        onPrevious={onPrevious}
        onNext={onNext}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120,
  },
});

export default PostActivityLayout;
