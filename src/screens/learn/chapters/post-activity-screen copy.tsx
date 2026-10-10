'use client';
import useAppStore from '@/core/stores';
import {useNavigation, useRoute} from '@react-navigation/native';
import type React from 'react';
import {useCallback, useEffect, useState} from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  SlideInDown,
  SlideInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useShallow} from 'zustand/react/shallow';

// Import your existing activity components
import CalendarActivity from '@/components/post-activites/CalendarActivity';
import ChecklistActivity from '@/components/post-activites/ChecklistActivity';
import MultipleChoiceActivity from '@/components/post-activites/MultipleChoiceActivity';
import RatingScaleActivity from '@/components/post-activites/RatingScaleActivity';
import ReviewCardActivity from '@/components/post-activites/ReviewCardActivity';
import StoryCardActivity from '@/components/post-activites/StoryCardActivity';
import TextInputActivity from '@/components/post-activites/TextInput';
// Import new review components
import MentalHealthSymptomsReview from '@/components/post-activites/MentalHealthSymptomsReview';
import CrisisSupportReview from '@/components/post-activites/CrisisSupportReview';
import HighRiskDaysList from '@/components/post-activites/HighRiskDaysList';

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
  const insets = useSafeAreaInsets();

  const {
    videoId,
    chapterId,
    activityIndex = 0,
  } = route.params as {
    videoId: string;
    activityIndex?: number;
    chapterId?: number;
  };

  const [currentActivityIndex, setCurrentActivityIndex] =
    useState(activityIndex);
  const [responses, setResponses] = useState<{[key: string]: any}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Animation values
  const progressValue = useSharedValue(0);
  const cardScale = useSharedValue(1);

  // Store selectors
  const {getVideoById, saveActivityResponse, getActivityResponse} = useAppStore(
    useShallow(state => state?.playlist || {}),
  );

  const video = getVideoById?.(videoId);
  const activities = video?.postActivities || [];
  const currentActivity = activities[currentActivityIndex];
  const totalActivities = activities.length;

  // Load existing responses
  useEffect(() => {
    if (!videoId || !activities.length) return;

    const loadResponses = async () => {
      const loadedResponses: {[key: string]: any} = {};
      for (const activity of activities) {
        const response = getActivityResponse?.(videoId, activity.id);
        if (response !== undefined) {
          loadedResponses[activity.id] = response;
        }
      }
      setResponses(loadedResponses);
    };

    loadResponses();
  }, [videoId, activities, getActivityResponse]);

  // Update progress animation
  useEffect(() => {
    const progress = (currentActivityIndex + 1) / totalActivities;
    progressValue.value = withSpring(progress);
  }, [currentActivityIndex, totalActivities]);

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressValue.value * 100}%`,
  }));

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: cardScale.value}],
  }));

  // Handle activity response
  const handleActivityResponse = useCallback(
    (response: any) => {
      if (currentActivity) {
        setResponses(prev => ({
          ...prev,
          [currentActivity.id]: response,
        }));
      }
    },
    [currentActivity],
  );

  // Handle next/submit
  const handleNext = useCallback(async () => {
    if (!currentActivity) return;

    const response = responses[currentActivity.id];

    // Validation
    if (currentActivity.responseType !== 'review' && !response) {
      // Show validation error
      return;
    }

    setIsSubmitting(true);
    cardScale.value = withSpring(0.95);

    try {
      // Save response
      await saveActivityResponse?.(
        videoId,
        currentActivity.id,
        response || null,
      );

      // Move to next activity or complete
      if (currentActivityIndex < activities.length - 1) {
        setCurrentActivityIndex(prev => prev + 1);
      } else {
        // All activities completed
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error saving response:', error);
    } finally {
      setIsSubmitting(false);
      cardScale.value = withSpring(1);
    }
  }, [
    currentActivity,
    responses,
    currentActivityIndex,
    activities.length,
    videoId,
    saveActivityResponse,
    navigation,
  ]);

  // Handle previous
  const handlePrevious = useCallback(() => {
    if (currentActivityIndex > 0) {
      setCurrentActivityIndex(prev => prev - 1);
    } else {
      navigation.goBack();
    }
  }, [currentActivityIndex, navigation]);

  // Render activity component
  const renderActivity = useCallback(() => {
    if (!currentActivity) return null;

    const commonProps = {
      activity: currentActivity,
      response: responses[currentActivity.id],
      onResponseChange: handleActivityResponse,
    };

    // Special case for high-risk days activity
    if (currentActivity.id === 'activity_3_2_1') {
      return <HighRiskDaysList {...commonProps} />;
    }

    switch (currentActivity.type) {
      case 'text':
        return <TextInputActivity {...commonProps} />;
      case 'multiple_choice':
        return <MultipleChoiceActivity {...commonProps} />;
      case 'rating_scale':
        return <RatingScaleActivity {...commonProps} />;
      case 'review_card':
        return <ReviewCardActivity {...commonProps} />;
      case 'calendar':
        return <CalendarActivity {...commonProps} />;
      case 'story_card':
        return <StoryCardActivity {...commonProps} />;
      case 'checklist':
        return <ChecklistActivity {...commonProps} />;
      case 'mental_health_review':
        return <MentalHealthSymptomsReview {...commonProps} />;
      case 'crisis_support_review':
        return <CrisisSupportReview {...commonProps} />;
      default:
        return (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              Unknown activity type: {(currentActivity as any).type}
            </Text>
          </View>
        );
    }
  }, [currentActivity, responses, handleActivityResponse]);

  if (!currentActivity) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No activity found</Text>
      </View>
    );
  }

  console.log({currentActivity});
  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#2D7D7A" />

      {/* Header */}

      <View style={[styles.header, {paddingTop: insets.top}]}>
        <LinearGradient
          colors={['#2D7D7A', '#0b7b76ff', '#0d645eff']}
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          }}
          useAngle
          angle={360}
        />
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handlePrevious}
            activeOpacity={0.8}>
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>

          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>
              Activity {currentActivityIndex + 1}
            </Text>
            <Text style={styles.headerSubtitle}>
              {currentActivityIndex + 1} of {totalActivities}
            </Text>
          </View>

          <View style={styles.headerRight}>
            <Text style={styles.progressText}>
              {Math.round(((currentActivityIndex + 1) / totalActivities) * 100)}
              %
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <Animated.View
              style={[styles.progressFill, progressAnimatedStyle]}
            />
          </View>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, {flexGrow: 1}]}
        showsVerticalScrollIndicator={false}>
        <Animated.View
          style={[styles.activityCard, cardAnimatedStyle, {flex: 1}]}
          entering={SlideInUp.duration(400)}>
          {/* Question */}
          <View style={styles.questionContainer}>
            <Text style={styles.questionTitle}>{currentActivity.question}</Text>
            {currentActivity.description && (
              <Text style={styles.questionDescription}>
                {currentActivity.description}
              </Text>
            )}
          </View>

          {/* Activity Component */}
          <View style={styles.activityContainer}>{renderActivity()}</View>
        </Animated.View>
      </ScrollView>

      {/* Bottom Actions */}
      <Animated.View
        style={styles.bottomActions}
        entering={SlideInDown.delay(200)}>
        <View style={styles.bottomGradient}>
          <LinearGradient
            colors={[
              'rgba(255,255,255,0)',
              'rgba(255,255,255,0.8)',
              'rgba(255,255,255,1)',
            ]}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.actionButtons}>
            {currentActivityIndex > 0 && (
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handlePrevious}
                activeOpacity={0.8}>
                <MaterialIcons name="arrow-back" size={20} color="#2D7D7A" />
                <Text style={styles.secondaryButtonText}>Previous</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[
                styles.primaryButton,
                {flex: currentActivityIndex === 0 ? 1 : 0.6},
              ]}
              onPress={handleNext}
              activeOpacity={0.8}>
              <View style={styles.primaryButtonGradient}>
                <LinearGradient
                  colors={['#1e9793ff', '#2D7D7A']}
                  style={StyleSheet.absoluteFillObject}
                  useAngle
                  angle={260}
                />
                <Text style={styles.primaryButtonText}>
                  {isSubmitting
                    ? 'Saving...'
                    : currentActivityIndex < activities.length - 1
                    ? 'Next'
                    : 'Complete'}
                </Text>
                {!isSubmitting && (
                  <MaterialIcons
                    name={
                      currentActivityIndex < activities.length - 1
                        ? 'arrow-forward'
                        : 'check'
                    }
                    size={20}
                    color="white"
                  />
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  headerRight: {
    width: 40,
    alignItems: 'center',
  },
  progressText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginTop: 16,
  },
  progressTrack: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120,
  },
  activityCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  questionContainer: {
    marginBottom: 24,
  },
  questionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    lineHeight: 28,
    marginBottom: 8,
  },
  questionDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  activityContainer: {
    minHeight: 200,
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  bottomGradient: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    borderRadius: 16,
    overflow: 'hidden',
    minWidth: 120,
  },
  primaryButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#2D7D7A',
    backgroundColor: 'white',
    gap: 8,
    flex: 0.4,
  },
  secondaryButtonText: {
    color: '#2D7D7A',
    fontSize: 16,
    fontWeight: 'bold',
  },
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
  },
});

export default ActivityFeedbackScreen;
