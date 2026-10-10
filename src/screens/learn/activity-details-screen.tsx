import {useState, useEffect, useMemo, useCallback} from 'react';
import {View, Text, StyleSheet, ScrollView, StatusBar} from 'react-native';
import {useNavigation, RouteProp} from '@react-navigation/native';
import VideoCalendarActivityComponent from '../../components/learn/activity/CalendarActivity';
import VideoRatingScaleActivityComponent from '../../components/learn/activity/RatingScaleActivityComponent';
import EmojiSymptomRatingComponent from '../../components/learn/activity/EmojiSymptomRatingComponent';
import BackButton from '@/components/ui/buttons/back-button';
import CompleteButton from '@/components/ui/buttons/complete-button';
import TextInputActivity from '@/components/post-activites/TextInput';
import ChecklistActivity from '@/components/post-activites/ChecklistActivity';
import TextListActivity from '@/components/post-activites/TextListActivity';
import ContactReview from '@/components/post-activites/ContactReview';
import SimpleContactReview from '@/components/post-activites/SimpleContactReview';
import SupportResources from '@/components/post-activites/SupportResources';
import SafetyPlanReview from '@/components/post-activites/SafetyPlanReview';
import MultipleChoiceActivity from '@/components/post-activites/MultipleChoiceActivity';
import HighRiskDaysList from '@/components/post-activites/HighRiskDaysList';
import ReviewCardActivity from '@/components/post-activites/ReviewCardActivity'; // Enhanced review card for anger management
import CrisisSupportReview from '@/components/post-activites/CrisisSupportReview';
import FONT_FAMILIES from '@/constants/fonts';
import useAppStore from '@/core/stores';
import {useShallow} from 'zustand/react/shallow';

type ActivityDetailsScreenProps = {
  route: RouteProp<
    {
      params: {
        activity: any;
        activityType: any;
        title: any;
        thumbnailUrl?: any;
        module?: any; // Add module to get the full list of items
        currentIndex?: number; // Add current index to navigate to next
      };
    },
    'params'
  >;
};

const ActivityDetailsScreen = ({route}: ActivityDetailsScreenProps) => {
  const navigation = useNavigation();
  const {activity, activityType, module} = route.params;

  const [isCompleted, setIsCompleted] = useState(false);
  const [activityResponse, setActivityResponse] = useState<any>(null);

  // Get store functions for saving activity responses
  const {saveActivityResponse, getActivityResponse} = useAppStore(
    useShallow(state => state.playlist),
  );

  // Get completion tracking functions
  const {markItemComplete, isItemComplete} = useAppStore(
    state => state.completion,
  );

  // Get the parent video ID for this activity
  // We'll use a consistent pattern: assume the activity belongs to the first video that has postActivities
  const parentVideoId = useMemo(() => {
    if (!module) return 'default_video';
    for (const video of module.videos) {
      if (video.postActivities && video.postActivities.length > 0) {
        // Check if this activity is in this video's postActivities
        const foundActivity = video.postActivities.find(
          (act: any) => act.id === activity.id,
        );
        if (foundActivity) {
          return video.id;
        }
      }
    }
    // Fallback: use the first video ID
    return module.videos[0]?.id || 'default_video';
  }, [module, activity]);

  // Helper function to format response for different activity types
  const formatResponseForStore = useCallback(
    (response: any, activityType: string) => {
      if (!response) return null;

      // The store expects specific response formats based on activity type
      switch (activityType.toLowerCase()) {
        case 'text':
        case 'question':
        case 'text_input':
          if (typeof response === 'string') {
            return {text: response};
          } else if (Array.isArray(response)) {
            return {text: response.join(', ')};
          }
          return response;

        case 'text_list':
          if (Array.isArray(response)) {
            return {items: response};
          }
          return response;

        case 'checklist':
          if (Array.isArray(response)) {
            return {selectedIds: response};
          }
          return response;

        case 'multiple_choice':
          if (typeof response === 'string') {
            return {selectedId: response};
          } else if (Array.isArray(response)) {
            return {selectedIds: response};
          }
          return response;

        case 'contact_review':
        case 'simple_contact_review':
        case 'support_resources':
        case 'safety_plan_review':
          return {reviewed: true, ...response};

        case 'rating':
          if (typeof response === 'number') {
            return {rating: response};
          }
          return response;

        case 'review':
          return {reviewed: true, ...response};

        default:
          // For unknown types, wrap in a generic format
          return response;
      }
    },
    [],
  );

  // Check completion status on mount
  useEffect(() => {
    // Logger: Display complete activity information
    console.log('=== ACTIVITY DETAILS ===');
    console.log('Activity ID:', activity.id);
    console.log('Activity Type:', activityType);
    console.log('Activity Title:', activity.title || activity.question);
    console.log('Complete Activity Object:', JSON.stringify(activity, null, 2));
    console.log('Parent Video ID:', parentVideoId);
    console.log('Route Params:', JSON.stringify(route.params, null, 2));
    console.log('========================');

    const moduleId = 'current_module'; // Use consistent moduleId
    const itemId = activity.id || activity._number || `activity_${activity.id}`;

    // Check completion store first
    const isCompletedInStore = isItemComplete(moduleId, itemId);

    // Also check if activity response exists
    const existingResponse = getActivityResponse?.(parentVideoId, activity.id);

    // Set completed if either store says it's complete or there's a response
    const shouldBeCompleted = isCompletedInStore || !!existingResponse;

    setIsCompleted(shouldBeCompleted);

    if (existingResponse) {
      setActivityResponse(existingResponse);
    }
  }, [activity.id, parentVideoId, getActivityResponse]); // Removed isItemComplete from dependencies

  const handleComplete = useCallback(async () => {
    const moduleId = 'current_module'; // Use consistent moduleId
    const itemId = activity.id || activity._number || `activity_${activity.id}`;

    // Always save a completion response, regardless of whether user provided input
    const completionResponse = activityResponse || {
      completed: true,
      timestamp: new Date().toISOString(),
      // For review type activities, mark as reviewed
      ...(activity.responseType === 'review' && {reviewed: true}),
      // For other types, provide a default response if none exists
      ...(activity.responseType !== 'review' &&
        !activityResponse && {
          value: 'completed_without_input',
          force_completed: true,
        }),
    };

    try {
      // Save the response to the store
      await saveActivityResponse?.(
        parentVideoId,
        activity.id,
        completionResponse,
      );

      // Mark as complete in completion store
      markItemComplete(moduleId, itemId);

      setIsCompleted(true);
      console.log('Activity completed and saved:', {
        parentVideoId,
        activityId: activity.id,
        moduleId,
        itemId,
        response: completionResponse,
      });

      // Simply go back to LearnModuleShowcase - no auto-navigation
      navigation.goBack();
    } catch (error) {
      console.error('Failed to save activity response:', error);
      // Still allow completion even if save fails
      const moduleId = 'current_module';
      const itemId =
        activity.id || activity._number || `activity_${activity.id}`;
      markItemComplete(moduleId, itemId);
      setIsCompleted(true);
      navigation.goBack();
    }
  }, [
    activity.id,
    activity.responseType,
    activityResponse,
    parentVideoId,
    saveActivityResponse,
    markItemComplete,
    navigation,
  ]);

  // Remove auto-complete logic - user must press Complete button manually
  // useEffect(() => {
  //   if (activityResponse && !isCompleted) {
  //     // Small delay to ensure the response is processed
  //     setTimeout(() => {
  //       handleComplete();
  //     }, 1000); // 1 second delay
  //   }
  // }, [activityResponse, isCompleted]);

  // General memoized callback for all activity responses to prevent infinite loops
  const handleActivityResponse = useCallback(
    (response: any) => {
      setActivityResponse(response);
      // Immediately save to store when user provides response
      if (response) {
        const formattedResponse = formatResponseForStore(
          response,
          activityType,
        );
        saveActivityResponse?.(parentVideoId, activity.id, formattedResponse);

        // Auto-complete activity if response indicates completion
        if (response.completed) {
          handleComplete();
        }
      }
    },
    [
      parentVideoId,
      activity.id,
      saveActivityResponse,
      formatResponseForStore,
      activityType,
      handleComplete,
    ],
  );

  // Complete button is always enabled - user can complete activity anytime
  const isCompleteDisabled = false;

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        {/* <Text style={styles.headerTitle} numberOfLines={1}>
          Activity: {activity._number || activity.number || 'Activity'}
        </Text> */}
      </View>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContentContainer}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{activity.question}</Text>
          <Text style={styles.description}>{activity.description}</Text>
        </View>
        <View style={styles.activityContainer}>
          {(() => {
            // Debug logging
            console.log('Activity Debug:', {
              id: activity.id,
              responseType: activity.responseType,
              type: activity.type,
              question: activity.question,
            });

            // Special case for activity 3.2.1 - show high risk days list
            if (
              activity.id === '3.2.1' ||
              activity.id?.includes('activity_3_2_1') ||
              (activity.id?.includes('3.2. Identify High Risk Days') &&
                activity.id?.includes('activity_3_2_1'))
            ) {
              console.log('Rendering HighRiskDaysList for 3.2.1');
              return (
                <HighRiskDaysList
                  activity={activity}
                  onResponseChange={handleActivityResponse}
                />
              );
            }

            // Use the responseType from the activity to determine which component to render
            const responseType = activity.responseType || 'text';
            console.log('Using responseType:', responseType);
            console.log('Activity type:', activity.type);

            // Special check for mental health symptoms rating review activities
            // (specifically for reviewing onboarding mental health symptoms, not distraction strategies)
            if (
              (activity.type === 'mental_health_review' &&
                activity.responseType === 'rating') ||
              (activity.responseType === 'rating' &&
                activity?.tags?.includes('mental_health_review') &&
                activity.question
                  ?.toLowerCase()
                  .includes('mental health symptoms'))
            ) {
              console.log(
                'Loading MentalHealthSymptomsRatingReview component (special check)',
              );
              const MentalHealthSymptomsRatingReview =
                require('@/components/post-activites/MentalHealthSymptomsRatingReview').default;
              return (
                <MentalHealthSymptomsRatingReview
                  activity={activity}
                  onResponseChange={handleActivityResponse}
                />
              );
            }

            // Special check for crisis support review activities
            if (
              activity.type === 'crisis_support_review' ||
              activity?.tags?.includes('high_risk_days') ||
              activity?.tags?.includes('insight_card') ||
              (activity.responseType === 'review' &&
                activity?.tags?.includes('predictions') &&
                (activity.id?.includes('Understanding Symptom Patterns') ||
                  activity.question?.includes('Symptom Patterns')))
            ) {
              console.log(
                'Loading CrisisSupportReview component (special check)',
              );
              return (
                <CrisisSupportReview
                  activity={activity}
                  onResponseChange={handleActivityResponse}
                />
              );
            }

            switch (responseType) {
              case 'review':
                // Special case for anger management summary activity (3.6.1)
                const isAngerSummary =
                  activity.id?.includes('3.6.') ||
                  activity.id?.includes('activity_3_6_1') ||
                  activity.id?.includes('Overall Module Example');

                console.log(
                  'Activity Details Screen - Activity ID:',
                  activity.id,
                );
                console.log(
                  'Activity Details Screen - Is Anger Summary:',
                  isAngerSummary,
                );

                if (isAngerSummary) {
                  console.log(
                    'Activity Details Screen - Using Enhanced ReviewCardActivity',
                  );
                  return (
                    <ReviewCardActivity
                      activity={activity}
                      onResponseChange={handleActivityResponse}
                    />
                  );
                } else {
                  console.log(
                    'Activity Details Screen - Using Calendar Component (default review)',
                  );
                  return (
                    <VideoCalendarActivityComponent
                      activity={activity}
                      onResponseChange={handleActivityResponse}
                    />
                  );
                }
              case 'rating':
                return (
                  <VideoRatingScaleActivityComponent
                    activity={activity}
                    onResponseChange={handleActivityResponse}
                  />
                );
              case 'text_list':
                return (
                  <TextListActivity
                    activity={activity}
                    onResponseChange={handleActivityResponse}
                  />
                );
              case 'text':
              case 'text_input':
                console.log('Rendering TextInputActivity for text/text_input');
                return (
                  <TextInputActivity
                    activity={activity}
                    onResponseChange={handleActivityResponse}
                  />
                );
              case 'checklist':
                return (
                  <ChecklistActivity
                    activity={activity}
                    onResponseChange={handleActivityResponse}
                  />
                );
              case 'multiple_choice':
                return (
                  <MultipleChoiceActivity
                    activity={activity}
                    onResponseChange={handleActivityResponse}
                  />
                );
              case 'contact_review':
                return (
                  <ContactReview
                    activity={activity}
                    onResponseChange={handleActivityResponse}
                  />
                );
              case 'simple_contact_review':
                return (
                  <SimpleContactReview
                    activity={activity}
                    onResponseChange={handleActivityResponse}
                  />
                );
              case 'support_resources':
                return (
                  <SupportResources
                    activity={activity}
                    onResponseChange={handleActivityResponse}
                  />
                );
              case 'safety_plan_review':
                return (
                  <SafetyPlanReview
                    activity={activity}
                    onResponseChange={handleActivityResponse}
                  />
                );
              case 'emoji_rating':
                return (
                  <EmojiSymptomRatingComponent
                    activity={activity}
                    onResponseChange={handleActivityResponse}
                  />
                );
              case 'rating':
                // Check if this is the mental health symptoms rating activity (from onboarding)
                console.log('In rating case, checking tags:', activity?.tags);
                console.log(
                  'Has mental_health_review tag:',
                  activity?.tags?.includes('mental_health_review'),
                );
                if (
                  activity?.tags?.includes('mental_health_review') &&
                  activity.question
                    ?.toLowerCase()
                    .includes('mental health symptoms')
                ) {
                  console.log(
                    'Loading MentalHealthSymptomsRatingReview component',
                  );
                  const MentalHealthSymptomsRatingReview =
                    require('@/components/post-activites/MentalHealthSymptomsRatingReview').default;
                  return (
                    <MentalHealthSymptomsRatingReview
                      activity={activity}
                      onResponseChange={handleActivityResponse}
                    />
                  );
                }
                // For other rating activities, fall through to default rating component
                console.log('Using fallback for rating activity');
                return (
                  <View style={styles.fallbackContainer}>
                    <Text style={styles.fallbackText}>
                      Rating activity type is not yet fully implemented.
                    </Text>
                    <Text style={styles.fallbackSubtext}>
                      Response type: {responseType}
                    </Text>
                  </View>
                );
              case 'mental_health_review':
                const MentalHealthSymptomsReview =
                  require('@/components/post-activites/MentalHealthSymptomsReview').default;
                return (
                  <MentalHealthSymptomsReview
                    activity={activity}
                    onResponseChange={handleActivityResponse}
                  />
                );
              case 'crisis_support_review':
                const CrisisSupportReview =
                  require('@/components/post-activites/CrisisSupportReview').default;
                return (
                  <CrisisSupportReview
                    activity={activity}
                    onResponseChange={handleActivityResponse}
                  />
                );
              default:
                return (
                  <View style={styles.fallbackContainer}>
                    <Text style={styles.fallbackText}>
                      Activity type "{responseType}" is not yet supported.
                    </Text>
                    <Text style={styles.fallbackSubtext}>
                      Response type: {responseType}
                    </Text>
                  </View>
                );
            }
          })()}
        </View>
      </ScrollView>

      {/* Complete Button Overlay */}
      <View style={styles.completeButtonContainer}>
        <CompleteButton
          onPress={handleComplete}
          isCompleted={isCompleted}
          disabled={isCompleteDisabled}
          size="large"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 16,
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: 32,
  },
  thumbnail: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  contentContainer: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
    fontFamily: FONT_FAMILIES.YoungSerifRegular,
    lineHeight: 32,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
  },
  activityContainer: {
    paddingHorizontal: 20,
  },
  reviewCardContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 20,
    marginVertical: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#2D7D7A',
  },
  reviewCardText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    fontFamily: FONT_FAMILIES.LatoRegular,
  },
  fallbackContainer: {
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 20,
    marginVertical: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  fallbackText: {
    fontSize: 16,
    color: '#B91C1C',
    fontWeight: '600',
    marginBottom: 8,
    fontFamily: FONT_FAMILIES.MerriweatherBold,
  },
  fallbackSubtext: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: FONT_FAMILIES.LatoRegular,
  },
  completeButtonContainer: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    zIndex: 10,
    backgroundColor: 'transparent',
  },
});

export default ActivityDetailsScreen;
