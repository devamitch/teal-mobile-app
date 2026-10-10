import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Animated, {SlideInUp, SlideOutUp} from 'react-native-reanimated';

interface ActivityCardProps {
  currentActivity: any;
  cardAnimatedStyle: any;
  children: React.ReactNode;
}

const ActivityCard: React.FC<ActivityCardProps> = ({
  currentActivity,
  cardAnimatedStyle,
  children,
}) => {
  return (
    <Animated.View
      style={[styles.activityCard, cardAnimatedStyle]}
      entering={SlideInUp.duration(400)}
      exiting={SlideOutUp.duration(400)}>
      <View style={styles.questionContainer}>
        <Text style={styles.questionTitle}>{currentActivity.question}</Text>
        {currentActivity.description && (
          <Text style={styles.questionDescription}>
            {currentActivity.description}
          </Text>
        )}
      </View>

      <View style={styles.activityContainer}>{children}</View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  activityCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  questionContainer: {
    marginBottom: 32,
  },
  questionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1F2937',
    lineHeight: 32,
    marginBottom: 8,
  },
  questionDescription: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
  },
  activityContainer: {
    minHeight: 100,
  },
});

export default ActivityCard;
