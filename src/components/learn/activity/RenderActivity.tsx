import {
  ActivityResponse,
  ActivityType,
  VideoActivity,
} from '@/core/stores/slices/playlist/types';
import React from 'react';
import {Text} from 'react-native';

// Import your activity components
import {VideoCalendarActivityComponent} from './CalendarActivity';
import VideoChecklistActivityComponent from './ChecklistActivityComponent';
import VideoMultipleChoiceActivityComponent from './MultipleChoiceActivityComponent';
import VideoRatingScaleActivityComponent from './RatingScaleActivityComponent';
import VideoReviewCardActivityComponent from './ReviewCardActivityComponent';
import VideoStoryCardActivityComponent from './StoryCardActivityComponent';
import TextActivityComponent from './TextActivity';
import HighRiskDaysList from '../../post-activites/HighRiskDaysList';
import ReviewCardActivity from '../../post-activites/ReviewCardActivity'; // Enhanced review card for anger management

type ActivityComponentProps<T extends VideoActivity> = {
  activity: T;
  response: ActivityResponse<T> | undefined;
  onResponseChange: (res: ActivityResponse<T>) => void;
};

type ActivityComponentMap = {
  [T in ActivityType]: React.ComponentType<
    ActivityComponentProps<Extract<VideoActivity, {type: T}>>
  >;
};

const activityComponentMap: Partial<ActivityComponentMap> = {
  calendar: VideoCalendarActivityComponent as any,
  rating_scale: VideoRatingScaleActivityComponent as any,
  text: TextActivityComponent as any,
  checklist: VideoChecklistActivityComponent as any,
  multiple_choice: VideoMultipleChoiceActivityComponent as any,
  story_card: VideoStoryCardActivityComponent as any,
  review_card: VideoReviewCardActivityComponent as any,
};

interface RenderActivityProps<T extends VideoActivity> {
  activity: T;
  response: ActivityResponse<T> | undefined;
  onResponseChange: (res: ActivityResponse<T>) => void;
}

// Helper function to normalize activity type from module data format to component map format
const normalizeActivityType = (type: string): ActivityType => {
  // Handle the special case formats from module data
  switch (type) {
    case 'Activity: text':
      return 'text';
    case 'Activity: review card':
      return 'review_card';
    case 'Activity: rating scale':
      return 'rating_scale';
    case 'Activity: checklist':
      return 'checklist';
    case 'Activity: multiple choice':
      return 'multiple_choice';
    case 'Activity: calendar':
      return 'calendar';
    case 'Activity: story card':
      return 'story_card';
    default:
      // If it's already in the correct format, return as-is
      return type as ActivityType;
  }
};

export const RenderActivity = <T extends VideoActivity>({
  activity,
  response,
  onResponseChange,
}: RenderActivityProps<T>) => {
  // Debug logging for all activities
  console.log(
    'RenderActivity - Activity Object:',
    JSON.stringify(activity, null, 2),
  );
  console.log('RenderActivity - Activity ID:', activity.id);
  console.log('RenderActivity - Activity Type:', activity.type);

  // Special case for high-risk days activity
  if (activity.id === '3.2.1') {
    console.log('RenderActivity - Routing to HighRiskDaysList');
    return (
      <HighRiskDaysList
        activity={activity as any}
        response={response as any}
        onResponseChange={onResponseChange as any}
      />
    );
  }

  // Special case for anger management summary activity (3.6.1)
  const isAngerSummary =
    activity.id?.includes('3.6.') ||
    activity.id?.includes('activity_3_6_1') ||
    activity.id?.includes('Overall Module Example');

  console.log('RenderActivity - Is Anger Summary Check:', isAngerSummary);
  console.log(
    'RenderActivity - ID includes 3.6.:',
    activity.id?.includes('3.6.'),
  );
  console.log(
    'RenderActivity - ID includes activity_3_6_1:',
    activity.id?.includes('activity_3_6_1'),
  );
  console.log(
    'RenderActivity - ID includes Overall Module Example:',
    activity.id?.includes('Overall Module Example'),
  );

  if (isAngerSummary) {
    console.log('RenderActivity - Routing to Enhanced ReviewCardActivity');
    return (
      <ReviewCardActivity
        activity={activity as any}
        response={response as any}
        onResponseChange={onResponseChange as any}
      />
    );
  }

  // Normalize the activity type to match the component map
  const normalizedType = normalizeActivityType(activity.type);

  const Component = activityComponentMap[normalizedType] as React.ComponentType<
    ActivityComponentProps<T>
  >;

  if (!Component) {
    return (
      <Text>
        Unknown activity type: {activity.type} (normalized: {normalizedType})
      </Text>
    );
  }

  // Create normalized activity object that preserves the original ID and other properties
  const normalizedActivity = {
    ...activity,
    type: normalizedType,
  } as T;

  return (
    <Component
      activity={normalizedActivity}
      response={response}
      onResponseChange={onResponseChange}
    />
  );
};
