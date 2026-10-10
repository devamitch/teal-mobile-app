import {
  ActivityResponse,
  ReviewCardActivity,
} from '@/core/stores/slices/playlist/types';
import React, {useEffect} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';

interface ReviewCardActivityProps {
  activity: ReviewCardActivity;
  response?: ActivityResponse<ReviewCardActivity>;
  onResponseChange: (response: ActivityResponse<ReviewCardActivity>) => void;
}

export const VideoReviewCardActivityComponent: React.FC<
  ReviewCardActivityProps
> = ({activity, response, onResponseChange}) => {
  // Debug logging
  console.log(
    'VideoReviewCardActivityComponent - Activity:',
    JSON.stringify(activity, null, 2),
  );
  console.log(
    'VideoReviewCardActivityComponent - This should NOT be called for 3.6.1 activities',
  );

  useEffect(() => {
    if (!response) {
      onResponseChange({reviewed: true});
    }
  }, [response, onResponseChange]);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.reviewCard}>
          <Text style={styles.reviewText}>
            This is a review card. The content would be displayed here.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  question: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  reviewCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  reviewText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default VideoReviewCardActivityComponent;
