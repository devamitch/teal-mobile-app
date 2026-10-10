import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useState, useCallback} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useSharedValue, withSpring} from 'react-native-reanimated';
import {useShallow} from 'zustand/react/shallow';

import PostActivityLayout from '@/components/learn/activity/post-activity-layout';
import {RenderActivity} from '@/components/learn/activity/RenderActivity';
import useAppStore from '@/core/stores';
import type {VideoActivity} from '@/core/stores/slices/playlist/types';

interface ActivityFeedbackScreenProps {
  route: {
    params: {
      videoId: string;
      chapterId: string;
      activityIndex?: number;
    };
  };
}

const ActivityFeedbackScreen: React.FC<ActivityFeedbackScreenProps> = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {
    videoId,
    chapterId,
    activityIndex = 0,
  } = route.params as {
    videoId: string;
    activityIndex?: number;
    chapterId?: string;
  };

  const [currentActivityIndex, setCurrentActivityIndex] =
    useState(activityIndex);

  // Store selectors
  const {
    isSubmitting,
    setIsSubmitting,
    getVideoById,
    saveActivityResponse,
    getActivityResponse,
  } = useAppStore(useShallow(state => state.playlist));

  // Animation values
  const cardScale = useSharedValue(1);

  // Get current activity data
  const video = getVideoById?.(videoId);
  const activities = video?.postActivities || [];
  const currentActivity = activities[currentActivityIndex] as
    | VideoActivity
    | undefined;
  const totalActivities = activities?.length || 0;

  const progressValue =
    totalActivities > 0 ? (currentActivityIndex + 1) / totalActivities : 0;

  const handleNext = () => {
    if (!currentActivity) return;

    setIsSubmitting(true);
    cardScale.value = withSpring(0.95);

    cardScale.value = withSpring(1);
    if (currentActivityIndex < totalActivities - 1) {
      setCurrentActivityIndex(i => i + 1);
    } else {
      // When all activities are completed, go back to LearnModuleShowcase
      navigation.navigate('LearnModuleShowcase' as never);
    }
    setIsSubmitting(false);
  };

  const handlePrevious = () => {
    if (currentActivityIndex > 0) {
      setCurrentActivityIndex(currentActivityIndex - 1);
    }
  };

  const handleResponseChange = useCallback(
    (response: any) => {
      if (currentActivity) {
        saveActivityResponse?.(videoId, currentActivity.id, response);
      }
    },
    [currentActivity, saveActivityResponse, videoId],
  );

  if (!currentActivity) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          No activity found or activities completed.
        </Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <PostActivityLayout
      currentActivityIndex={currentActivityIndex}
      totalActivities={totalActivities}
      activityTitle={currentActivity.question}
      activityDescription={currentActivity.description ?? ''}
      progressValue={progressValue}
      onBack={() => navigation.goBack()}
      onPrevious={handlePrevious}
      onNext={handleNext}
      isSubmitting={isSubmitting}
      cardScale={cardScale.value}>
      <RenderActivity
        activity={currentActivity}
        response={getActivityResponse?.(videoId, currentActivity.id)}
        onResponseChange={handleResponseChange}
      />
    </PostActivityLayout>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default ActivityFeedbackScreen;
