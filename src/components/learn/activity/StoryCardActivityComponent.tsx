import {
  ActivityResponse,
  StoryCardActivity,
} from '@/core/stores/slices/playlist/types';
import React, {useEffect} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';

interface StoryCardActivityProps {
  activity: StoryCardActivity;
  response?: ActivityResponse<StoryCardActivity>;
  onResponseChange: (response: ActivityResponse<StoryCardActivity>) => void;
}

export const VideoStoryCardActivityComponent: React.FC<
  StoryCardActivityProps
> = ({activity, response, onResponseChange}) => {
  useEffect(() => {
    if (!response) {
      onResponseChange({viewed: true});
    }
  }, [response, onResponseChange]);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.storyCard}>
          <Text style={styles.storyText}>
            {activity.description ||
              'This is a story card. The story content would be displayed here.'}
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
  storyCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    padding: 16,
    marginTop: 16,
  },
  storyText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default VideoStoryCardActivityComponent;
